package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.SalaryRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SalaryRecordRepository extends JpaRepository<SalaryRecord, Long> {

    @Query("SELECT sr FROM SalaryRecord sr " +
            "JOIN sr.account a " +
            "WHERE a.salonBranch.salonId = :salonId " +
            "AND sr.monthAndYear = :monthAndYear")
    List<SalaryRecord> findSalaryRecordsBySalonIdAndYearMonth(@Param("salonId") Long salonId,
                                                              @Param("monthAndYear") String monthAndYear);
}
