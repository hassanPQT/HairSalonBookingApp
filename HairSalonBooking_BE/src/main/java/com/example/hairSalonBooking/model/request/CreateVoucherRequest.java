package com.example.hairSalonBooking.model.request;

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
public class CreateVoucherRequest {
    @NotBlank(message = "INVALID_VOUCHER_CODE")
    String code;
    @NotBlank(message = "INVALID_VOUCHER_NAME")
    String name;
    @Min(value = 0, message = "INVALID_VOUCHER_DISCOUNT")
    double discountAmount;
    LocalDate expiryDate;
    @Min(value = 0, message = "INVALID_VOUCHER_QUANTITY")
    int quantity;

}
