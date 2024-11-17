package com.example.hairSalonBooking.model.response;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherResponse {
    long id;
    String code;
    String name;
    double discountAmount;
    LocalDate expiryDate;
    int quantity;
    boolean isDelete;

}
