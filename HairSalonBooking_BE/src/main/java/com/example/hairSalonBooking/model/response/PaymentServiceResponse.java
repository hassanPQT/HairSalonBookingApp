package com.example.hairSalonBooking.model.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class PaymentServiceResponse {
    String serviceName;
    String image;
    int price;

    public PaymentServiceResponse(String serviceName, String image,int price) {
        this.serviceName = serviceName;
        this.image = image;
        this.price = price;
    }
}
