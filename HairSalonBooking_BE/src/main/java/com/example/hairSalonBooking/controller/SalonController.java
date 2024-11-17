package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.model.request.CreateSalonRequest;
import com.example.hairSalonBooking.model.request.UpdateSalonRequest;
import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.SalonResponse;
import com.example.hairSalonBooking.service.SalonBranchService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class SalonController {
    @Autowired
    private SalonBranchService salonBranchService;

    @PostMapping("salon")
    public ApiResponse<SalonResponse> createSalon(@Valid @RequestBody CreateSalonRequest request){
        ApiResponse response = new ApiResponse<>();
        response.setResult(salonBranchService.createSalonRequest(request));
        return response;
    }

    @GetMapping("salons")
    public ApiResponse<SalonResponse> getAllSalons(){
        ApiResponse response = new ApiResponse<>();
        response.setResult(salonBranchService.getAllSalons());
        return response;
    }
    @GetMapping("salon")
    public ApiResponse<SalonResponse> getAllSalonsAcitve(){
        ApiResponse response = new ApiResponse<>();
        response.setResult(salonBranchService.getAllSalonsActive());
        return response;
    }
    /*@GetMapping("salon/{address}")
    public ApiResponse<SalonResponse> getSalon(@PathVariable String address){
        ApiResponse response = new ApiResponse<>();
        response.setResult(salonBranchService.getSalon(address));
        return response;
    }*/
    @GetMapping("salon/{address}")
    public ApiResponse<SalonResponse> getSalonByAddress(@PathVariable String address){
        ApiResponse response = new ApiResponse<>();
        response.setResult(salonBranchService.getSalonByAddress(address));
        return response;
    }
    @PutMapping("/salon/{id}")
    public ApiResponse<SalonResponse> updateSalon(@PathVariable long id, @RequestBody UpdateSalonRequest request){
        ApiResponse response = new ApiResponse<>();
        response.setResult(salonBranchService.updateSalon(request,id));
        return response;
    }

    @DeleteMapping("/salon/{id}")
    public ApiResponse<SalonResponse> deleteSalon(@PathVariable long id){
        ApiResponse response = new ApiResponse<>();
        response.setResult(salonBranchService.deleteSalon(id));
        return response;
    }

    @PutMapping("/salon/active/{id}")
    public ApiResponse<SalonResponse> activeSalon(@PathVariable long id){
        ApiResponse response = new ApiResponse<>();
        response.setResult(salonBranchService.activeSalon(id));
        return response;
    }
}
