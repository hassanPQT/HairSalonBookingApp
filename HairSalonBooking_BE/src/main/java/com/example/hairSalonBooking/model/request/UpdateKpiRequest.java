package com.example.hairSalonBooking.model.request;

import com.example.hairSalonBooking.entity.Kpi;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateKpiRequest {
    long levelId;
    List<KpiRequest> bonus;

}
