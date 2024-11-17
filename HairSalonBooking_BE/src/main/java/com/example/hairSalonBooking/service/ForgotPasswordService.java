package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.entity.ForgotPassword;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.ChangePasswordRequest;
import com.example.hairSalonBooking.model.request.MailBody;
import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.ForgotPasswordResponse;
import com.example.hairSalonBooking.repository.AccountRepository;
import com.example.hairSalonBooking.repository.ForgotPasswordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Random;

@Service
public class ForgotPasswordService {
    @Autowired
    private ForgotPasswordRepository forgotPasswordRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public ForgotPasswordResponse verifyEmail(String email){
        Account account = accountRepository.findAccountByEmail(email);
        if(account == null){
            throw new AppException(ErrorCode.EMAIL_NOT_FOUND);
        }
        ForgotPassword checkAccount = forgotPasswordRepository.findForgotPasswordByAccount(account);
        if(checkAccount != null){
            forgotPasswordRepository.deleteById(checkAccount.getFpid());
        }
        int otp = optGenerate();
        MailBody mailBody = MailBody.builder()
                .to(email)
                .subject("OTP for your forgot password request")
                .otp(otp)
                .build();
        ForgotPassword fp = ForgotPassword.builder()
                .otp(otp)
                .expirationTime(new Date(System.currentTimeMillis() + 70 * 1000))
                .account(account)
                .build();
        emailService.sendSimpleMessage(mailBody);
        forgotPasswordRepository.save(fp);
        ForgotPasswordResponse response = ForgotPasswordResponse.builder()
                .message("Email sent verify")
                .build();
        return  response;

    }
    public ForgotPasswordResponse verifyOTP(Integer otp, String email){
        Account account = accountRepository.findAccountByEmail(email);
        if(account == null){
            throw new AppException(ErrorCode.EMAIL_NOT_FOUND);
        }
        ForgotPassword fp = forgotPasswordRepository.findForgotPasswordByOtpAndAccount(otp,account);
        if(fp == null){
            throw new AppException(ErrorCode.INVALID_OTP);
        }
        if(fp.getExpirationTime().before(Date.from(Instant.now()))){
            throw new AppException(ErrorCode.OTP_HAS_EXPIRED);
        }
        ForgotPasswordResponse response = ForgotPasswordResponse.builder()
                .message("OTP is verified")
                .build();
        return response;
    }
    public ForgotPasswordResponse changePassword(String email, ChangePasswordRequest request){
        if(!request.getPassword().equals(request.getRepassword())){
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }
        Account account = accountRepository.findAccountByEmail(email);
        if(account == null){
            throw new AppException(ErrorCode.EMAIL_NOT_FOUND);
        }
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        accountRepository.save(account);
        ForgotPassword fp = forgotPasswordRepository.findForgotPasswordByAccount(account);
        forgotPasswordRepository.deleteById(fp.getFpid());
        ForgotPasswordResponse response = ForgotPasswordResponse.builder()
                .message("Change password successfully")
                .build();
        return response;
    }
    private Integer optGenerate(){
        Random random = new Random();
        return random.nextInt(100_000, 999_999);
    }
}
