package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.model.request.UpdateKpiRequest;
import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.service.KpiService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")
public class KpiController {
    @Autowired
    private KpiService kpiService;

    @GetMapping("/kpis")
    public ApiResponse getAllKpis(){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(kpiService.getAllKpi());
        return apiResponse;
    }
    @GetMapping("/kpis/{levelId}")
    public ApiResponse getKpiByLevel(@PathVariable long levelId){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(kpiService.getKpiByLevel(levelId));
        return apiResponse;
    }

    @PutMapping("/kpi/{levelId}")
    public ApiResponse updateKpi(@Valid @RequestBody UpdateKpiRequest request, @PathVariable long levelId){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(kpiService.updateKpi(request,levelId));
        return apiResponse;
    }
}
