package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.model.request.FindCustomerByPhone;
import com.example.hairSalonBooking.model.request.UpdateCustomerRequest;
import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.ProfileResponse;
import com.example.hairSalonBooking.service.CustomerService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")
public class CustomerController {

    @Autowired
    CustomerService customerService;

    @PutMapping("/{AccountId}")
    public ApiResponse<UpdateCustomerRequest> updateCustomer(@Valid @RequestBody UpdateCustomerRequest request,
                                                             @PathVariable long AccountId){
        ApiResponse response = new ApiResponse();
        response.setResult(customerService.updateCustomer(request,AccountId));
        response.setMessage("Update successfully");
        return response;
    }

    @GetMapping("/profile")
    public ApiResponse<ProfileResponse> getProfile(){
        ApiResponse response = new ApiResponse();
        response.setResult(customerService.getProfile());
        return response;
    }
    @PostMapping("/phone")
    public ApiResponse<String> getCustomerByPhoneNumber(@RequestBody FindCustomerByPhone findCustomerByPhone){
        ApiResponse response = new ApiResponse();
        response.setResult(customerService.getCustomerByPhoneNumber(findCustomerByPhone.getPhone()));
        return response;
    }

    @DeleteMapping("/{accountId}")
    public ApiResponse<String> deActiveUser(@PathVariable long accountId){
        ApiResponse response = new ApiResponse();
        response.setResult(customerService.deActiveUser(accountId));
        return response;
    }
    @PutMapping("/active/{accountId}")
    public ApiResponse<String> activeUser(@PathVariable long accountId){
        ApiResponse response = new ApiResponse();
        response.setResult(customerService.activeUser(accountId));
        return response;
    }


}
