package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Kpi;
import com.example.hairSalonBooking.entity.Level;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface KpiRepository extends JpaRepository<Kpi, Long> {
//    @Query("SELECT k FROM Kpi k WHERE k.level = :level AND k.yearAndMonth = :yearAndMonth")
//    Kpi findByLevelAndYearAndMonth(Level level, String yearAndMonth);

//     @Query("SELECT k FROM Kpi k JOIN k.level.accounts a WHERE a.accountid = :stylistId AND k.level.levelid = :levelId")
//     Kpi findByStylistIdAndLevel(@Param("stylistId") Long stylistId, @Param("levelId") Long levelId);

    @Query("SELECT k FROM Kpi k JOIN k.level l JOIN l.accounts a WHERE a.accountid = :stylistId AND l.levelid = :levelId")
    List<Kpi> findByStylistIdAndLevel(@Param("stylistId") Long stylistId, @Param("levelId") Long levelId);


    @Query("SELECT MAX(k.revenueFrom) FROM Kpi k JOIN k.level.accounts a WHERE a.accountid = :stylistId AND k.level.levelid = :levelId")
    Double findMaxRevenueByStylistIdAndLevel(@Param("stylistId") Long stylistId, @Param("levelId") Long levelId);

    @Query(value = "delete from kpi where level_id = ?1",nativeQuery = true)
    @Modifying
    @Transactional
    void deleteKpiByLevel(long levelId);

    List<Kpi> findByLevelLevelid(long levelId);

    @Query(value = "select k.* from kpi k where k.revenue_from <= ?1 and ?2 <= k.revenue_to " +
            "and k.level_id = ?3;",nativeQuery = true)
    Kpi getKpiByRevenueStylistLevel(double revenue, double revenue1, long levelId);


    @Query("SELECT k.bonusPercent FROM Kpi k " +
            "WHERE k.level.levelid = :levelId " +
            "AND :totalRevenue >= k.revenueFrom " +
            "AND :totalRevenue <= k.revenueTo")
    Optional<Double> findBonusPercentageByRevenueAndLevel(long levelId, double totalRevenue);
}
