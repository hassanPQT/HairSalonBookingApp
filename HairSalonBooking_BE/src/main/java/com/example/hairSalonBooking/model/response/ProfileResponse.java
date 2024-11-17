package com.example.hairSalonBooking.model.response;

import com.example.hairSalonBooking.enums.Role;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileResponse {
    long accountid;
    String fullname;
    String email;
    LocalDate dob;
    String phone;
    String gender;
    String image;
    long salonId;
    Role role;
}
