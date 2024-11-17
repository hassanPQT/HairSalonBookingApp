package com.example.hairSalonBooking.model.request;

import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KpiRequest {
    @Min(value = 0, message = "PERFORMANCE_SCORE_POSITIVE")
    double performance_score;
    @Min(value = 0, message = "REVENUE_POSITIVE")
    double revenue_from;
    @Min(value = 0, message = "REVENUE_POSITIVE")
    double revenue_to;
    @Min(value = 0, message = "BONUS_POSITIVE")
    double bonus_percent;
}
