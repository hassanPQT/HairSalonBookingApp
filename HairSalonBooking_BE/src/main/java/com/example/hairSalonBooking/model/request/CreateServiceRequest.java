package com.example.hairSalonBooking.model.request;


import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateServiceRequest {
    @NotBlank(message = "SERVICE_NO_BLANK")
    String serviceName;
    @NotNull(message = "PRICE_NO_BLANK")
    int price;
    String description;
    LocalTime duration;
    String image;
    long skillId;
    Set<String> collectionsImage;

}
