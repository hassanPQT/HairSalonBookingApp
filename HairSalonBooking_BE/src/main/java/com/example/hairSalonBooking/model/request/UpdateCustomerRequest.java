package com.example.hairSalonBooking.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
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
public class UpdateCustomerRequest {
    String fullname;

    @Email(message = "INVALID_EMAIL")
    String email;
    @Pattern(regexp = "(84|0[3|5|7|8|9])+(\\d{8})\\b", message = "INVALID_PHONE")
    String phone;
    @PastOrPresent(message = "INVALID_DOB")
    LocalDate dob;
    String image;

}
