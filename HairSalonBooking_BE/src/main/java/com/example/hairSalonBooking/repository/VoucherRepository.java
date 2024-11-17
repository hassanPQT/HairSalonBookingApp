package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher,Long> {
    Voucher findVoucherByCode(String code);
    Voucher findVoucherByVoucherId(long id);
    Voucher findVoucherByCodeAndIsDeleteFalse(String code);
    @Query(value = "select * from voucher v where v.quantity > 0 and v.is_delete = false",nativeQuery = true)
    List<Voucher> findVouchersByIsDeleteFalse();
    Optional<Voucher> findByCode(String code);
}
