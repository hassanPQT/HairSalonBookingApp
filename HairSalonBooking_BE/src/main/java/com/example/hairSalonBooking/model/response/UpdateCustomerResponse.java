package com.example.hairSalonBooking.model.response;

import jakarta.validation.constraints.Email;
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
public class UpdateCustomerResponse {
    String fullName;

    @Email(message = "Email not valid")
    String email;

    String phone;
    LocalDate dob;
}
