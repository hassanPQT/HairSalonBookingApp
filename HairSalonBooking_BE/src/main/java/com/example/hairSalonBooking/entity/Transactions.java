package com.example.hairSalonBooking.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Transactions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long transactionsId;

    @ManyToOne
    @JoinColumn(name = "from_id")
    Account fromAccount;
    @ManyToOne
    @JoinColumn(name = "to_id")
    Account toAccount;
    double amount;  // Số tiền giao dịch
    LocalDate transactionDate;  // Ngày giao dịch
    String bankCode;
    String cardType;
    String transactionIdVNPay;
    @ManyToOne
    @JoinColumn(name = "payment_id")
    Payment payment;
}
