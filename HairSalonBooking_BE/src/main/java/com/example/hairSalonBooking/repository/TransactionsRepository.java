package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Payment;
import com.example.hairSalonBooking.entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionsRepository extends JpaRepository<Transactions, Long> {
}
