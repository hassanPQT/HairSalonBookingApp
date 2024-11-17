package com.example.hairSalonBooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class SalonBranch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long salonId;
    String address;
    @Column(unique = true)
    String hotline;
    boolean isDelete = false;

    @OneToMany(mappedBy = "salonBranch")
    @JsonIgnore
    Set<Account> accounts;

    @OneToMany(mappedBy = "salonBranch")
    @JsonIgnore
    Set<Booking> bookings;

}