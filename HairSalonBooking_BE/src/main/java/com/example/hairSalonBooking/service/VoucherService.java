package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Voucher;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.CreateVoucherRequest;
import com.example.hairSalonBooking.model.request.UpdateVoucherRequest;
import com.example.hairSalonBooking.model.response.VoucherResponse;
import com.example.hairSalonBooking.repository.VoucherRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepository;
    @Autowired
    private ModelMapper modelMapper;

    public VoucherResponse createVoucher(CreateVoucherRequest request){
        Voucher voucher = voucherRepository.findVoucherByCode(request.getCode());
        if(voucher != null){
            throw new AppException(ErrorCode.DUPLICATE_VOUCHER_CODE);
        }
        Voucher newVoucher = modelMapper.map(request,Voucher.class);
        voucherRepository.save(newVoucher);
        return modelMapper.map(newVoucher,VoucherResponse.class);
    }

    public List<VoucherResponse> getAllVouchers(){ // danh cho admin xem tat ca voucher
        List<Voucher> vouchers = voucherRepository.findAll();
        List<VoucherResponse> responses = new ArrayList<>();
        for(Voucher voucher : vouchers){
            responses.add(modelMapper.map(voucher,VoucherResponse.class));
        }
        return responses;
    }
    public List<VoucherResponse> getAllVouchersIsDeleteFalse(){ // cho customer xem vouchers dang co the ap dung
        List<Voucher> vouchers = voucherRepository.findVouchersByIsDeleteFalse();
        List<VoucherResponse> responses = new ArrayList<>();
        for(Voucher voucher : vouchers){
            responses.add(modelMapper.map(voucher,VoucherResponse.class));
        }
        return responses;
    }
    public VoucherResponse getVoucherByCode(String code){ // search voucher con hieu luc theo code
        Voucher voucher = voucherRepository.findVoucherByCodeAndIsDeleteFalse(code);
        if(voucher == null){
            throw new AppException(ErrorCode.VOUCHER_NOT_FOUND);
        }
        return modelMapper.map(voucher,VoucherResponse.class);
    }
    public VoucherResponse updateVoucher(long id, UpdateVoucherRequest request){
        Voucher voucher = voucherRepository.findVoucherByVoucherId(id);
        if(voucher == null){
            throw new AppException(ErrorCode.VOUCHER_NOT_FOUND);
        }
        voucher.setCode(request.getCode());
        voucher.setName(request.getName());
        voucher.setQuantity(request.getQuantity());
        voucher.setDiscountAmount(request.getDiscountAmount());
        voucher.setExpiryDate(request.getExpiryDate());
        voucher.setDelete(request.isDelete());
        voucherRepository.save(voucher);
        return modelMapper.map(voucher,VoucherResponse.class);
    }

    public VoucherResponse deleteVoucher(long id){
        Voucher voucher = voucherRepository.findVoucherByVoucherId(id);
        if(voucher == null){
            throw new AppException(ErrorCode.VOUCHER_NOT_FOUND);
        }
        voucher.setDelete(true);
        voucherRepository.save(voucher);
        return modelMapper.map(voucher,VoucherResponse.class);
    }
}
