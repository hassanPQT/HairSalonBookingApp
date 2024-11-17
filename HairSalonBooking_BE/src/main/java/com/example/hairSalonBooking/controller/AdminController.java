package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.ManagerChartCricleResponse;
import com.example.hairSalonBooking.model.response.TotalMoneyByBookingDay;
import com.example.hairSalonBooking.service.BookingService;
import com.example.hairSalonBooking.service.BranchManagerService;
import com.example.hairSalonBooking.service.CustomerService;
import com.example.hairSalonBooking.service.HairSalonServiceService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")
public class AdminController {
    @Autowired
    private BookingService bookingService;
    @Autowired
    private HairSalonServiceService hairSalonServiceService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private BranchManagerService branchManagerService;
    @GetMapping("/admin/booking/count/{month}")
    public ApiResponse<Long> countAllBookingsInMonth(@PathVariable int month) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.countAllBookingsInMonth(month));
        return apiResponse;
    }

    @GetMapping("/admin/booking/total-money/month/{month}")
    public ApiResponse<Double> totalMoneyAllSalonInMonth(@PathVariable int month) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.totalMoneyAllSalonByMonth(month));
        return apiResponse;
    }

    @GetMapping("/admin/customer/count")
    public ApiResponse<Long> countAllCustomers(){
        ApiResponse response = new ApiResponse();
        response.setResult(customerService.countAllCustomers());
        return response;

    }
    @GetMapping("/admin/service/count")
    public ApiResponse<Long> countAllServices() {
        ApiResponse response = new ApiResponse<>();
        response.setResult(hairSalonServiceService.countAllServices());
        return response;
    }

    @GetMapping("/admin/chart/")
    public ApiResponse<ManagerChartCricleResponse> adminChartCircle() {
        ApiResponse response = new ApiResponse<>();
        response.setResult(branchManagerService.adminChart());
        return response;
    }
}
