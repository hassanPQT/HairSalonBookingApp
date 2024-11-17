package com.example.hairSalonBooking.entity;

import com.example.hairSalonBooking.service.LocalTimeDeserializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long slotid;

    //    @JsonDeserialize(using = LocalTimeDeserializer.class)
    LocalTime slottime;



    boolean deleted = false;

    @OneToMany(mappedBy = "slot")
    @JsonIgnore
    Set<Booking> bookings;
}