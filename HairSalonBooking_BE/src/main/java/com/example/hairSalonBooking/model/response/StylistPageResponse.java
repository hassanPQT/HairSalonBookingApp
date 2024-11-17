package com.example.hairSalonBooking.model.response;

import lombok.Data;

import java.util.List;

@Data
public class StylistPageResponse {
    private List<StyPageResponse> content;
    private int pageNumber;
    private int totalPages;
    private long totalElements;
}
