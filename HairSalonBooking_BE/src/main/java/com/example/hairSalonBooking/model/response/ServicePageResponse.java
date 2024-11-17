package com.example.hairSalonBooking.model.response;


import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.entity.SalonBranch;
import com.example.hairSalonBooking.entity.SalonService;
import lombok.Data;

import java.util.List;

@Data
public class ServicePageResponse {
    private List<ServiceResponse> content;
    private int pageNumber;
    private int totalPages;
    private long totalElements;
}
