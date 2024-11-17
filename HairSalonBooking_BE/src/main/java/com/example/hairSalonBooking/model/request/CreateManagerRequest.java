package com.example.hairSalonBooking.model.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CreateManagerRequest {
    @Email(message = "INVALID_EMAIL")
    String email;
    @NotBlank(message = "INVALID_USERNAME")
    String username;
    @Size(min = 6, message = "PASSWORD_SIZE_INVALID")
    String password;
    String fullName;
    @PastOrPresent(message = "INVALID_DOB")
    LocalDate dob;
    long salonId;
    @Pattern(regexp = "(84|0[35789])\\d{8}\\b", message = "INVALID_PHONE")
    String phone;
    String gender;

}
