package com.example.hairSalonBooking.model.response;


import com.example.hairSalonBooking.entity.Account;
import lombok.Data;

import java.util.List;

@Data
public class AccountPageResponse {
    private List<CusPageResponse> content;
    private int pageNumber;
    private int totalPages;
    private long totalElements;

}
