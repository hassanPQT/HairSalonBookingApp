package com.example.hairSalonBooking.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long feedbackId;
    LocalDate day;
    String content;
    double score;
    @ManyToOne
    @JoinColumn(name = "account_id")
    Account account;
    @OneToOne
    @JoinColumn(name = "booking_id")
    Booking booking;
}