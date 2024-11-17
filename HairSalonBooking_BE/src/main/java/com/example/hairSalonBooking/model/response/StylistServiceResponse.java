package com.example.hairSalonBooking.model.response;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StylistServiceResponse {

    long serviceId;
    String serviceName;
    double price;
    boolean isDeleted = false;

}