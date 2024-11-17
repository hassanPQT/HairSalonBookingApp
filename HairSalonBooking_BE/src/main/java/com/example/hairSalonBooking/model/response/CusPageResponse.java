package com.example.hairSalonBooking.model.response;


import com.example.hairSalonBooking.enums.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CusPageResponse {
    long AccountId;
    String email;
    String fullName;
    LocalDate dob;
    String gender;
    String phone;
    String image;
    boolean isDelete;
}
