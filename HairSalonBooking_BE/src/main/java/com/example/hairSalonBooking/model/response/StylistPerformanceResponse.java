package com.example.hairSalonBooking.model.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StylistPerformanceResponse {
    private Long stylistId;
    private String stylistName;
    private String image;
    private Double averageFeedback;
    private Double totalRevenue;
}
