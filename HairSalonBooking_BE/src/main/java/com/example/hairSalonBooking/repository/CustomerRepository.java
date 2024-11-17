package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomerRepository extends JpaRepository<Account,Long> {
    Account findAccountByAccountid(long AccountID);
    Account findAccountByUsername(String username);

    @Query(value = "select count(*) from account a where a.role = 'CUSTOMER'",nativeQuery = true)
    long countAllCustomers();

    Account findByPhone(String phone);
}
