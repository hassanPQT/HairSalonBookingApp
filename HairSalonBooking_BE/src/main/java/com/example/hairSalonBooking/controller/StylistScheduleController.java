package com.example.hairSalonBooking.controller;


import com.example.hairSalonBooking.model.request.AddShiftRequest;
import com.example.hairSalonBooking.model.request.SpecificStylistScheduleRequest;
import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.SpecificStylistScheduleResponse;

import com.example.hairSalonBooking.model.response.StylistScheduleResponse;

import com.example.hairSalonBooking.service.StylistScheduleService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")

public class StylistScheduleController {

    @Autowired
    private StylistScheduleService stylistScheduleService;
    @Autowired
    private ModelMapper modelMapper;
    @PostMapping("/stylist/schedule")
    public ApiResponse<List<SpecificStylistScheduleRequest>> createStylistSchedule(@RequestBody SpecificStylistScheduleRequest request){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(stylistScheduleService.createStylistSchedule(request));
        return apiResponse;
    }

    @GetMapping("/stylist/schedule/{date}/{salonId}")
    public ApiResponse<List<SpecificStylistScheduleResponse>> getStylistScheduleByDay(@PathVariable LocalDate date,
                                                                                      @PathVariable long salonId){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(stylistScheduleService.getStylistScheduleByDay(date,salonId));
        return apiResponse;
    }


    @GetMapping("/stylist/schedule/month/{accountId}/{month}")
    public ApiResponse<List<StylistScheduleResponse>> getStylistScheduleByMonth(@PathVariable long accountId, @PathVariable int month ){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(stylistScheduleService.getStylistScheduleInMonth(accountId,month));
        return apiResponse;
    }


    @GetMapping("/stylist/schedule/{id}")
    public ApiResponse<SpecificStylistScheduleResponse> getStylistSchedule(@PathVariable long id){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(stylistScheduleService.getStylistSchedule(id));
        return apiResponse;
    }
    @PutMapping("/stylist/schedule/{id}")
    public ApiResponse<SpecificStylistScheduleResponse> updateStylistSchedule(@PathVariable long id, @RequestBody SpecificStylistScheduleRequest request){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(stylistScheduleService.updateStylistSchedule(id, request));
        return apiResponse;
    }

    @DeleteMapping("/stylist/schedule/{id}")
    public ApiResponse<SpecificStylistScheduleResponse> deleteStylistSchedule(@PathVariable long id){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(stylistScheduleService.deleteStylistSchedule(id));
        return apiResponse;
    }
}
