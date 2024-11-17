package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.model.request.ChangePasswordRequest;
import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.ForgotPasswordResponse;
import com.example.hairSalonBooking.service.ForgotPasswordService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")
public class ForgotPasswordController {
    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @PostMapping("verifyEmail/{email}")
    public ApiResponse<ForgotPasswordResponse> verifyEmail(@PathVariable String email){
        ApiResponse response = new ApiResponse();
        response.setResult(forgotPasswordService.verifyEmail(email));
        return response;
    }

    @PostMapping("verifyOtp/{email}/{otp}")
    public ApiResponse<ForgotPasswordResponse> verifyOtp(@PathVariable String email, @PathVariable Integer otp){
        ApiResponse response = new ApiResponse();
        response.setResult(forgotPasswordService.verifyOTP(otp,email));
        return response;
    }
    @PostMapping("changePassword/{email}")

    public ApiResponse<ForgotPasswordResponse> changePassword(@PathVariable String email,
                                                              @RequestBody ChangePasswordRequest request){

        ApiResponse response = new ApiResponse();
        response.setResult(forgotPasswordService.changePassword(email,request));
        return response;
    }
}
