package com.example.hairSalonBooking.model.response;


import com.example.hairSalonBooking.entity.Skill;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceResponse {

    long id;
    String serviceName;
    int price;
    String description;
    LocalTime duration;
    String image;
    String skillName;
    Set<String> collectionsImage;
    boolean isDelete;

}
