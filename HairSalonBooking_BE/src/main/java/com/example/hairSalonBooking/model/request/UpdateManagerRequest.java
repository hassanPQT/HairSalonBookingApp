package com.example.hairSalonBooking.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UpdateManagerRequest {
    @Email(message = "INVALID_EMAIL")
    String email;
    String fullName;
    @PastOrPresent(message = "INVALID_DOB")
    LocalDate dob;


    long salonId;

    @Pattern(regexp = "(84|0[35789])\\d{8}\\b", message = "INVALID_PHONE")
    String phone;
    String gender;
    boolean isDelete;
}
