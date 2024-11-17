package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.entity.ForgotPassword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword,Long> {
    ForgotPassword findForgotPasswordByOtpAndAccount(Integer otp, Account account);
    ForgotPassword findForgotPasswordByAccount(Account account);
}
