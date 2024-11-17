package com.example.hairSalonBooking.model.response;

import com.example.hairSalonBooking.entity.Skill;
import com.example.hairSalonBooking.enums.Role;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StylistProfileResponse {
    long accountid;
    String fullname;
    String email;
    LocalDate dob;
    String phone;
    String gender;
    String image;
    long salonId;
    long levelId;
    Set<Long> skillId;
    Role role;
}
