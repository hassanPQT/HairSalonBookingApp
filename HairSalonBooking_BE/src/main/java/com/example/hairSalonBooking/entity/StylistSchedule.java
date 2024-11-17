package com.example.hairSalonBooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class StylistSchedule {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    long stylistScheduleId;
    LocalDate workingDay;

    @ManyToOne
    @JoinColumn(name = "account_id")
    Account account;

    @ManyToMany
    @JoinTable(name = "specific_stylist_schedule",
            joinColumns = @JoinColumn(name = "stylist_schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "shift_id")
    )
    @JsonIgnore
    Set<Shift> shifts;

}