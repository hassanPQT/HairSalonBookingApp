package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Booking;
import com.example.hairSalonBooking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("SELECT p FROM Payment p WHERE p.booking = :booking")
    Payment findPaymentByBooking(@Param("booking") Booking booking);

    Payment findByTransactionId(String transactionId);
    Payment findByBooking_BookingId(Long booking);
}
