package com.example.hairSalonBooking.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Collections {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long collectionId;
    String collectionImage;

    @ManyToOne
    @JoinColumn(name = "service_id")
    SalonService service;
}