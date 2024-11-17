package com.example.hairSalonBooking.model.response;

import com.example.hairSalonBooking.entity.Skill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StyPageResponse {
    long accountid;
    String email;
    String fullname;
    String phone;
    String image;
    LocalDate dob;
    String gender;
    String getAddress;
    String levelName;
    Set<String> skillsName;
}
