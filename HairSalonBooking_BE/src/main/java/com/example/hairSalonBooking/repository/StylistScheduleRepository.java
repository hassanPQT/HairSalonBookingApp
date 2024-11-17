package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.StylistSchedule;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface StylistScheduleRepository extends JpaRepository<StylistSchedule,Long> {
    @Query(value = "select * from stylist_schedule ss where ss.account_id = ?1 " +
            "and ss.working_day = ?2",nativeQuery = true)
    StylistSchedule getScheduleId(long stylistId, LocalDate date);
    @Query(value = "select distinct ss.* from  stylist_schedule ss\n" +
            "inner join specific_stylist_schedule sss\n" +
            "on ss.stylist_schedule_id = sss.stylist_schedule_id\n" +
            "inner join account a\n" +
            "on ss.account_id = a.accountid\n" +
            "where a.salon_id = ?1 and ss.working_day = ?2",nativeQuery = true)
    List<StylistSchedule> getStylistScheduleByDayAndSalonId(long salonId, LocalDate date);

    StylistSchedule findByStylistScheduleId(long id);
    @Query(value = "DELETE FROM specific_stylist_schedule WHERE stylist_schedule_id = ?1",nativeQuery = true)
    @Modifying
    @Transactional
    void deleteSpecificSchedule(long id);


    @Query("SELECT ss FROM StylistSchedule ss")
    List<StylistSchedule> findAllStylists();

    @Query(value = "select ss.* from stylist_schedule ss\n" +
            "where ss.account_id = ?1 and month(ss.working_day) = ?2\n" +
            "order by ss.working_day asc",nativeQuery = true)
    List<StylistSchedule> getStylistSchedule(long accountId, int month);


    @Query(value = "SELECT s.end_time FROM shift s " +
            "JOIN specific_stylist_schedule ss ON s.shift_id = ss.shift_id " +
            "JOIN stylist_schedule sss ON ss.stylist_schedule_id = sss.stylist_schedule_id " +
            "WHERE sss.stylist_schedule_id = :stylistScheduleId " +
            "AND sss.working_day = :bookingDay " +
            "ORDER BY s.end_time DESC " +
            "LIMIT 1", nativeQuery = true)
    Optional<LocalTime> findShiftEndTime(@Param("stylistScheduleId") Long stylistScheduleId,
                                         @Param("bookingDay") LocalDate bookingDay);


    @Query(value = "SELECT s.shift_id " +
            "FROM shift s " +
            "JOIN specific_stylist_schedule ss ON s.shift_id = ss.shift_id " +
            "JOIN stylist_schedule sss ON ss.stylist_schedule_id = sss.stylist_schedule_id " +
            "WHERE sss.stylist_schedule_id = :stylistScheduleId " +
            "AND sss.working_day = :workingDay " +
            "ORDER BY s.shift_id", nativeQuery = true)
    List<Long> findShiftIdsByStylistScheduleAndWorkingDay(@Param("stylistScheduleId") Long stylistScheduleId,
                                                          @Param("workingDay") String workingDay);
}




