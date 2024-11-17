package com.example.hairSalonBooking.model.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ManagerResponse {
    long accountid;
    String email;
    String username;
    String fullName;
    LocalDate dob;
    String salonAddress;
    String phone;
    String gender;
    boolean isDelete;
}
