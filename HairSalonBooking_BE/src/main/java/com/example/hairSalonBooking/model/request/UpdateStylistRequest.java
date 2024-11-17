package com.example.hairSalonBooking.model.request;


import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UpdateStylistRequest {

    @Email(message = "INVALID_EMAIL")
    String email;

    String fullname;
    String image;
    @Pattern(regexp = "(84|0[35789])\\d{8}\\b",message = "INVALID_PHONE")
    String phone;
    @PastOrPresent(message = "INVALID_DOB")
    LocalDate dob;
    String gender;

  long salonId;
  long levelId;


    Set<Long> skillId;


    boolean isDelete = false;

}