package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.config.VnpayConfig;
import com.example.hairSalonBooking.controller.PaymentController;

import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;

import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.repository.AccountRepository;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import com.example.hairSalonBooking.entity.Booking;
import com.example.hairSalonBooking.entity.Payment;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.util.*;

import com.example.hairSalonBooking.repository.BookingRepository;
import com.example.hairSalonBooking.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
@Service
public class PaymentService {
    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private AccountRepository accountRepository;


    public String generatePaymentUrl(Long bookingId, HttpServletRequest req) throws UnsupportedEncodingException {
        Booking booking = bookingRepository.findBookingByBookingId(bookingId);
        if (booking == null) {
            throw new AppException(ErrorCode.BOOKING_NOT_FOUND);
        }

        Payment payment = paymentRepository.findPaymentByBooking(booking);
        if (payment == null || payment.getPaymentAmount() <= 0) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_AMOUNT);
        }

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = (long) (payment.getPaymentAmount() * 100);
        String bankCode = req.getParameter("bankCode");
        String vnp_TxnRef = VnpayConfig.getRandomNumber(8);

        String vnp_IpAddr = VnpayConfig.getIpAddress(req);
        String vnp_TmnCode = VnpayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnpayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString())).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        String paymentUrl = VnpayConfig.vnp_PayUrl + "?" + query.toString();
        log.info("VNPay Request Params: " + vnp_Params);
        log.info("VNPay Payment URL: " + paymentUrl);
        payment.setTransactionId(vnp_TxnRef);
        paymentRepository.save(payment);
        return paymentUrl;
    }

    public String generateDepositUrl(Long accountId, Double depositAmount, HttpServletRequest req) throws UnsupportedEncodingException {
        // Tìm account theo accountId
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_Not_Found_Exception));

        // Kiểm tra số tiền nạp có hợp lệ không
        if (depositAmount == null) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_AMOUNT);
        }

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "deposit"; // Đặt loại đơn hàng là nạp tiền
        long amount = (long) (depositAmount * 100);
        String bankCode = req.getParameter("bankCode");
        String vnp_TxnRef = VnpayConfig.getRandomNumber(8);

        String vnp_IpAddr = VnpayConfig.getIpAddress(req);
        String vnp_TmnCode = VnpayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Nap tien vao tai khoan:" + vnp_TxnRef); // Thay đổi nội dung đơn hàng
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnpayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString())).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        String paymentUrl = VnpayConfig.vnp_PayUrl + "?" + query.toString();
        log.info("VNPay Request Params: " + vnp_Params);
        log.info("VNPay Payment URL: " + paymentUrl);

        // Lưu transactionId trong bảng Payment (nạp tiền)
//        Payment payment = new Payment();
//        payment.setTransactionId(vnp_TxnRef);
//        payment.setPaymentAmount(depositAmount);
////        payment.setAccount(account);
//        payment.setPaymentMethod("VNPay");
//        payment.setPaymentStatus("PENDING");
//        paymentRepository.save(payment);

        return paymentUrl; // Trả về URL để redirect tới VNPay
    }



}
