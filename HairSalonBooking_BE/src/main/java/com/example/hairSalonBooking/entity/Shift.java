package com.example.hairSalonBooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long shiftId;
    LocalTime startTime;
    LocalTime endTime;
    int limitBooking;



    @ManyToMany(mappedBy = "shifts")
    Set<StylistSchedule> stylistSchedules;
}