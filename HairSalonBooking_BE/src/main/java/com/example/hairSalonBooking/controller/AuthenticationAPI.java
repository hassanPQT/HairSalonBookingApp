
package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.model.request.LoginGG;


import com.example.hairSalonBooking.model.request.LoginRequest;
import com.example.hairSalonBooking.model.request.RegisterRequest;
import com.example.hairSalonBooking.model.response.AccountPageResponse;
import com.example.hairSalonBooking.model.response.AccountResponse;
import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.AuthenticationResponse;
import com.example.hairSalonBooking.service.AuthenticationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api")

//@CrossOrigin("http://localhost:3000/")
@CrossOrigin("https://f-salon.vercel.app/")

@SecurityRequirement(name = "api")
public class AuthenticationAPI {


    // DI :Dependency Injection

    @Autowired // mình sử dụng để gọi thằng service phục vụ
    AuthenticationService authenticationService;


    @PostMapping("/register")
    public ResponseEntity register(@Valid @RequestBody RegisterRequest registerRequest) {
        AccountResponse newAccount = authenticationService.register(registerRequest);
        return ResponseEntity.ok(newAccount);
    }

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(authenticationService.login(loginRequest));
        return apiResponse;
    }

    @PostMapping("/login-gg")
    private ApiResponse<AuthenticationResponse> checkLoginGoogle(@RequestBody LoginGG loginGG){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(authenticationService.loginGoogle(loginGG.getToken()));
        return apiResponse;
    }



    @GetMapping("/account")
    public ResponseEntity getAllAccount() {
        List<AccountResponse> accounts = authenticationService.getAllAccount();
        return ResponseEntity.ok(accounts);
    }


    @GetMapping("/account/page")
    public ApiResponse<AccountPageResponse> getAllAccountCustomer(@RequestParam int page, @RequestParam int size) {
        ApiResponse response = new ApiResponse<>();
        response.setResult(authenticationService.getAllAccountCustomer(page, size));
        return response;
    }

}


