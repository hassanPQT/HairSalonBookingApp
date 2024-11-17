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
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long voucherId;
    @Column(unique = true)
    String code;
    String name;
    double discountAmount;
    LocalDate expiryDate;
    int quantity;
    boolean isDelete = false;

    @OneToMany(mappedBy = "voucher")
    @JsonIgnore
    Set<Booking> bookings;
}