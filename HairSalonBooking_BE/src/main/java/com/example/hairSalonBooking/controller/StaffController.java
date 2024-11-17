package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.entity.Booking;
import com.example.hairSalonBooking.model.request.*;


import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.StaffResponse;
import com.example.hairSalonBooking.service.StaffService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/")
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")
public class StaffController {
    @Autowired
    private StaffService staffService;
    @PostMapping("staff")
    public ApiResponse<StaffResponse> createStaff(@Valid @RequestBody CreateStaffRequest request){
        ApiResponse response = new ApiResponse<>();
        response.setMessage("Created new staff");
        response.setResult(staffService.createStaff(request));
        return response;
    }
    @PostMapping("staff/booking")
    public ApiResponse<Booking> createBookingByStaff(@Valid @RequestBody StaffCreateBookingRequest request){
        ApiResponse response = new ApiResponse<>();
        response.setResult(staffService.createBookingByStaff(request));
        return response;
    }


    @PostMapping("staff/booking/{date}")
    public ApiResponse<Booking> getBookingByPhoneNumber(@PathVariable LocalDate date, @RequestBody FindBookingByPhoneRequest request){
        ApiResponse response = new ApiResponse<>();
        response.setResult(staffService.getBookingByPhoneNumber(date,request.getPhone()));
        return response;
    }


    @GetMapping("/staffs")
    public ApiResponse<StaffResponse> getAllStaff(){
        ApiResponse response = new ApiResponse<>();
        response.setResult(staffService.getAllStaffs());
        return response;
    }
    @GetMapping("/staff/salon/{salonId}")
    public ApiResponse<StaffResponse> getAllStaffBySalonId(@PathVariable long salonId){
        ApiResponse response = new ApiResponse<>();
        response.setResult(staffService.getAllStaffBySalonId(salonId));
        return response;
    }
    @GetMapping("/staff/{accountId}")
    public ApiResponse<StaffResponse> getAllStaff(@PathVariable long accountId){
        ApiResponse response = new ApiResponse<>();
        response.setResult(staffService.getSpecificStaff(accountId));
        return response;
    }

    @PutMapping("/staff/{id}")
    public ApiResponse<StaffResponse> updateStaff(@PathVariable long id, @RequestBody UpdateStaffRequest request){
        ApiResponse response = new ApiResponse<>();
        response.setResult(staffService.updateStaff(request,id));
        return response;
    }

    @DeleteMapping("/staff/{id}")
    public ApiResponse<StaffResponse> deleteStaff(@PathVariable long id){
        ApiResponse response = new ApiResponse<>();
        response.setResult(staffService.deleteStaff(id));
        return response;
    }

    @PostMapping("staff/customer")
    public ApiResponse<StaffCreateCustomerRequest> staffCreateCustomer(@Valid @RequestBody StaffCreateCustomerRequest request){
        ApiResponse response = new ApiResponse<>();
        response.setResult(staffService.staffCreateCustomer(request));
        return response;
    }
}
