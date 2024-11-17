package com.example.hairSalonBooking.controller;


import com.example.hairSalonBooking.entity.SalonService;
import com.example.hairSalonBooking.entity.Slot;
//import com.example.hairSalonBooking.service.SlotService;
import com.example.hairSalonBooking.model.request.UpdateSlotRequest;
import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.SalonResponse;
import com.example.hairSalonBooking.model.response.SlotResponse;
import com.example.hairSalonBooking.model.response.SlotTimeResponse;
import com.example.hairSalonBooking.service.SlotService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/slot") // giảm bớt đường dẫn
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")
public class SlotController {

    @Autowired
    SlotService slotService;

    @PostMapping("/create")
    ApiResponse<SalonResponse> createSlot(@Valid @RequestBody Slot slot) {
        ApiResponse response = new ApiResponse<>();
        response.setResult(slotService.create(slot));
        return response; // Trả về apiResponse
    }


    @GetMapping("/read")
    ApiResponse<List<Slot>> getAllSlot() {
        ApiResponse response = new ApiResponse<>();
        response.setResult(slotService.getAllSlot());
        return response;
    }
    @GetMapping("/{date}")
    ApiResponse<List<Slot>> getAllSlotValid(@PathVariable LocalDate date) {
        ApiResponse response = new ApiResponse<>();
        response.setResult(slotService.getAllSlotValid(date));
        return response;
    }

    @PutMapping("{slotid}")
    ApiResponse <SalonResponse> updateSlot(@PathVariable long slotid,@Valid @RequestBody Slot slot) {
        ApiResponse response = new ApiResponse<>();
        response.setResult(slotService.update(slotid,slot));
        return response;

    }
    @DeleteMapping("{slotid}")
    ApiResponse <SalonResponse> deleteSlot(@PathVariable long slotid ) {
        ApiResponse response = new ApiResponse<>();
        response.setResult(slotService.delete(slotid));
        return response;
    }

    @PostMapping()
    public ApiResponse<List<SlotResponse>> updateSlotWithTime(@RequestBody UpdateSlotRequest request){
        ApiResponse response = new ApiResponse<>();
        response.setResult(slotService.updateSlotTime(request));
        return response;
    }

    @GetMapping("/time/between")
    public ApiResponse<SlotTimeResponse> getSlotTimeBetween(){
        ApiResponse response = new ApiResponse<>();
        response.setResult(slotService.getSlotTimeBetween());
        return response;
    }
}
