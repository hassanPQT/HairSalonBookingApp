package com.example.hairSalonBooking.model.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KpiResponse {
    long levelId;
    String levelName;
    double performance_score;
    double revenue_from;
    double revenue_to;
    double bonus_percent;
}
