package com.example.hairSalonBooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class SalonService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long serviceId;
    @Column(nullable = false)
    String serviceName;
    @Column(nullable = false)
    int price;
    String description;
    LocalTime duration;
    String image;

    @ManyToOne
    @JoinColumn(name = "skill_id")
    Skill skill;

    @OneToMany(mappedBy = "service")
    @JsonIgnore
    Set<Collections> collections;

    @ManyToMany(mappedBy = "services")
    Set<Booking> bookings;
    boolean isDelete = false;

}