package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.model.request.CreateManagerRequest;
import com.example.hairSalonBooking.model.request.UpdateBookingForStylistBusyRequest;
import com.example.hairSalonBooking.model.request.UpdateManagerRequest;
import com.example.hairSalonBooking.model.response.*;
import com.example.hairSalonBooking.service.BranchManagerService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/")
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")
public class BranchManagerController {
    @Autowired
    private BranchManagerService branchManagerService;
    @PostMapping("/manager")
    public ApiResponse<ManagerResponse> createManager(@Valid @RequestBody CreateManagerRequest request){
        ApiResponse response = new ApiResponse<>();
        response.setMessage("Created new manager");
        response.setResult(branchManagerService.createManager(request));
        return response;
    }
    @GetMapping("/manager/profile")
    public ApiResponse<ProfileResponse> getProfile(){
        ApiResponse response = new ApiResponse();
        response.setResult(branchManagerService.getProfile());
        return response;

    }
    @GetMapping("/managers")
    public ApiResponse<ManagerResponse> getAllManagers(){
        ApiResponse response = new ApiResponse<>();
        response.setResult(branchManagerService.getAllManagers());
        return response;
    }

    @GetMapping("/manager/{accountId}")
    public ApiResponse<ManagerResponse> getAllManagers(@PathVariable long accountId){
        ApiResponse response = new ApiResponse<>();
        response.setResult(branchManagerService.getSpecificManager(accountId));
        return response;
    }

    @PutMapping("/manager/{id}")
    public ApiResponse<ManagerResponse> updateManager(@PathVariable long id, @RequestBody UpdateManagerRequest request){
        ApiResponse response = new ApiResponse<>();
        response.setResult(branchManagerService.updateManager(id,request));
        return response;
    }
    @DeleteMapping("/manager/{id}")
    public ApiResponse<ManagerResponse> deleteManager(@PathVariable long id){
        ApiResponse response = new ApiResponse<>();
        response.setResult(branchManagerService.deleteManager(id));
        return response;
    }

    @GetMapping("/manager/stylists/booking/{branchId}/{date}")
    public ApiResponse<List<BookingResponse>> getAllBookingsForStylistInBranch(@PathVariable Long branchId, @PathVariable LocalDate date) {
        ApiResponse<List<BookingResponse>> response = new ApiResponse<>();
        response.setResult(branchManagerService.getAllBookingsForStylistsInBranch(branchId,date));
        return response;
    }

    @GetMapping("/manager/stylists/booking/pending/{page}/{size}/{branchId}/{date}")
    public ApiResponse<BookingPageResponse> getAllBookingsForStylistInBranchByPending(
            @PathVariable int page,
            @PathVariable int size,
            @PathVariable long branchId,
            @PathVariable LocalDate date) {
        ApiResponse<BookingPageResponse> response = new ApiResponse<>();
        response.setResult(branchManagerService.getAllBookingsForStylistInBranchByPending(page, size, branchId, date));
        return response;
    }
    @GetMapping("/manager/stylists/booking/complete/{page}/{size}/{branchId}/{date}")
    public ApiResponse<BookingPageResponse> getAllBookingsForStylistInBranchByComplete(
            @PathVariable int page,
            @PathVariable int size,
            @PathVariable long branchId,
            @PathVariable LocalDate date) {
        ApiResponse<BookingPageResponse> response = new ApiResponse<>();
        response.setResult(branchManagerService.getAllBookingsForStylistInBranchByComplete(page, size, branchId, date));
        return response;
    }
    @GetMapping("/manager/stylists/booking/inprocess/{page}/{size}/{branchId}/{date}")
    public ApiResponse<BookingPageResponse> getAllBookingsForStylistInBranchByInprocess(
            @PathVariable int page,
            @PathVariable int size,
            @PathVariable long branchId,
            @PathVariable LocalDate date) {
        ApiResponse<BookingPageResponse> response = new ApiResponse<>();
        response.setResult(branchManagerService.getAllBookingsForStylistInBranchByInprocess(page, size, branchId, date));
        return response;
    }
    @GetMapping("/manager/stylists/booking/cancel/{page}/{size}/{branchId}/{date}")
    public ApiResponse<BookingPageResponse> getAllBookingsForStylistInBranchByCancel(
            @PathVariable int page,
            @PathVariable int size,
            @PathVariable long branchId,
            @PathVariable LocalDate date) {
        ApiResponse<BookingPageResponse> response = new ApiResponse<>();
        response.setResult(branchManagerService.getAllBookingsForStylistInBranchByCancel(page, size, branchId, date));
        return response;
    }

    @GetMapping("/manager/chart/{salonId}")
    public ApiResponse<ManagerChartCricleResponse> getAllBookingsForStylistInBranchByCancel(@PathVariable long salonId) {
        ApiResponse response = new ApiResponse<>();
        response.setResult(branchManagerService.chart(salonId));
        return response;
    }

    @GetMapping("/manager/booking/stylist/busy")
    public ApiResponse<List<BookingResponse>> getBookingsForStylistBusy() {
        ApiResponse response = new ApiResponse<>();
        response.setResult(branchManagerService.getBookingsByStylistShiftId());
        return response;
    }
}
