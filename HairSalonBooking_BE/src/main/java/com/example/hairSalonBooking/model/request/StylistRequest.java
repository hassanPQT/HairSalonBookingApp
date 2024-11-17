package com.example.hairSalonBooking.model.request;


import com.example.hairSalonBooking.entity.Skill;
import jakarta.persistence.Column;
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
public class StylistRequest {


    @NotBlank(message = "INVALID_USERNAME")
    String username;
    @Size(min = 6, message ="PASSWORD_SIZE_INVALID")
    String password;
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