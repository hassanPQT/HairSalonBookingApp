package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.model.request.CreateVoucherRequest;
import com.example.hairSalonBooking.model.request.UpdateVoucherRequest;
import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.VoucherResponse;
import com.example.hairSalonBooking.service.VoucherService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class VoucherController {
    @Autowired
    private VoucherService voucherService;
    @PostMapping("/voucher")
    public ApiResponse<VoucherResponse> createVoucher(@Valid @RequestBody CreateVoucherRequest request){
        ApiResponse response = new ApiResponse();
        response.setResult(voucherService.createVoucher(request));
        return response;
    }

    @GetMapping("/vouchers")
    public ApiResponse<VoucherResponse> getAllVouchers(){
        ApiResponse response = new ApiResponse();
        response.setResult(voucherService.getAllVouchers());
        return response;
    }
    @GetMapping("/voucher")
    public ApiResponse<VoucherResponse> getAllVouchersActive(){
        ApiResponse response = new ApiResponse();
        response.setResult(voucherService.getAllVouchersIsDeleteFalse());
        return response;
    }
    @GetMapping("/voucher/{code}")
    public ApiResponse<VoucherResponse> getVouchers(@PathVariable String code){
        ApiResponse response = new ApiResponse();
        response.setResult(voucherService.getVoucherByCode(code));
        return response;
    }
    @PutMapping("/voucher/{id}")
    public ApiResponse<VoucherResponse> updateVouchers(@PathVariable long id, @Valid @RequestBody UpdateVoucherRequest request){
        ApiResponse response = new ApiResponse();
        response.setResult(voucherService.updateVoucher(id,request));
        return response;
    }
    @DeleteMapping("/voucher/{id}")
    public ApiResponse<VoucherResponse> deleteVouchers(@PathVariable long id){
        ApiResponse response = new ApiResponse();
        response.setResult(voucherService.deleteVoucher(id));
        return response;
    }
}
