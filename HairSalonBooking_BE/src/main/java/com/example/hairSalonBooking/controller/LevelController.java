package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.model.response.ApiResponse;
import com.example.hairSalonBooking.model.response.LevelResponse;
import com.example.hairSalonBooking.service.LevelService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")
public class LevelController {
    @Autowired
    private LevelService levelService;
    @GetMapping("/levels")
    public ApiResponse<List<LevelResponse>> getAllLevels(){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(levelService.getAllLevel());
        return apiResponse;
    }
}
