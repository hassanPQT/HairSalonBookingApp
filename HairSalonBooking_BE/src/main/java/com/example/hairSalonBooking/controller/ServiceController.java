package com.example.hairSalonBooking.controller;




import com.cloudinary.Api;
import com.example.hairSalonBooking.entity.Account;

import com.example.hairSalonBooking.entity.SalonService;
import com.example.hairSalonBooking.model.request.CreateServiceRequest;

import com.example.hairSalonBooking.model.request.CreateServiceRequest;
import com.example.hairSalonBooking.model.request.SearchServiceNameRequest;
import com.example.hairSalonBooking.model.request.ServiceUpdateRequest;

import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.ServiceResponse;



import com.example.hairSalonBooking.model.response.*;


import com.example.hairSalonBooking.model.response.*;

import com.example.hairSalonBooking.service.HairSalonServiceService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.example.hairSalonBooking.repository.ServiceRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


import java.time.LocalTime;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/service")
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")

public class ServiceController {

    @Autowired
    private HairSalonServiceService  hairSalonServiceService;

    @Autowired
    private ServiceRepository serviceRepository;


    @PostMapping
    ApiResponse<ServiceResponse> createService(@Valid @RequestBody CreateServiceRequest Request) {
        ApiResponse<ServiceResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(hairSalonServiceService.createService(Request));
        return apiResponse;
    }

    @GetMapping
    ApiResponse<List<ServiceResponse>> getAllServices() {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(hairSalonServiceService.getAllServicesActive());
        return apiResponse;
    }


    @GetMapping("/{serviceId}")
    ApiResponse<ServiceResponse> SearchServiceById(@PathVariable long serviceId) {
        ApiResponse response = new ApiResponse<>();
        response.setResult(hairSalonServiceService.searchServiceId(serviceId));
        return response ;
    }
    @PostMapping("/searchByName")
    ApiResponse<List<ServiceResponse>> SearchServiceName(@RequestBody SearchServiceNameRequest serviceName) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(hairSalonServiceService.searchServiceByName(serviceName));
        return apiResponse;
    }


    @DeleteMapping("/delete/{serviceId}")
    ApiResponse<String> deleteUser(@PathVariable long serviceId) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(hairSalonServiceService.deleteService(serviceId));
        return apiResponse;

    }
    @PutMapping("/update/{serviceId}")
    public ServiceResponse updateService(@PathVariable long serviceId, @RequestBody ServiceUpdateRequest request) {
        return hairSalonServiceService.updateService(serviceId, request);
    }


    @GetMapping("/page")
    public ApiResponse<ServicePageResponse> getAllServicePage(@RequestParam int page, @RequestParam int size) {
        ApiResponse response = new ApiResponse<>();
        response.setResult(hairSalonServiceService.getAllServicePage(page, size));
        return response;

    }
    @GetMapping("/active/page")
    public ApiResponse<ServicePageResponse> getAllActiveServicePage(@RequestParam int page, @RequestParam int size) {
        ApiResponse response = new ApiResponse<>();
        response.setResult(hairSalonServiceService.getAllActiveServicePage(page, size));
        return response;

    }
    @GetMapping("/all")
    public ResponseEntity getAllService() {
        List<ServiceResponse> services = hairSalonServiceService.getAllServices();
        return ResponseEntity.ok(services);
    }
    @GetMapping("/newest")
    public ApiResponse<List<ServiceResponse>> getNewestService() {
        ApiResponse response = new ApiResponse<>();
        response.setResult(hairSalonServiceService.getNewestService());
        return response;
    }

    @PutMapping("/active/{serviceId}")
    public ApiResponse<String> updateService(@PathVariable long serviceId) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(hairSalonServiceService.activeService(serviceId));
        return apiResponse;
    }



}
