package com.example.hairSalonBooking.model.response;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StylistResponse {
    long accountid;
    String username;
    String email;
    String fullname;
    String phone;
    String image;
    LocalDate dob;
    String gender;
    String salonAddress;
    String levelName;

    Set<String> skillName;
    //    @JsonIgnore // ẩn delete status không cho người dùng nhập

    boolean isDeleted = false;

}