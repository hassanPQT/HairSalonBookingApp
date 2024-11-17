package com.example.hairSalonBooking.model.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StylistRevenueResponse {
    Long stylistId;
    String stylistName;
    int bookingQuantity;
    Double totalRevenue;
    double bonusPercent;
}
