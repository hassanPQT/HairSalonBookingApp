package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.entity.Booking;
import com.example.hairSalonBooking.entity.SalonBranch;
import com.example.hairSalonBooking.enums.BookingStatus;
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

public interface BookingRepository extends JpaRepository<Booking,Long> {
    @Query(value = "select b.* from booking b\n" +
            "            inner join stylist_schedule ssch\n" +
            "            on b.stylist_schedule_id = ssch.stylist_schedule_id\n" +
            "            where ssch.working_day = ?1 and ssch.account_id = ?2 and b.status != 'CANCELLED'\n" +
            "            order by b.slot_id desc ",nativeQuery = true)
    List<Booking> getBookingsByStylistInDay(LocalDate date, long stylistId);

    @Query(value = "select b.* from booking b\n" +
            "      inner join stylist_schedule ssch\n" +
            "         on b.stylist_schedule_id = ssch.stylist_schedule_id\n" +
            "        where ssch.working_day = ?1 and ssch.account_id = ?2 and b.status != 'CANCELLED' and b.booking_id != ?3\n" +
            "          order by b.slot_id desc", nativeQuery = true)
    List<Booking> getBookingsByStylistInDayForUpdate(LocalDate date, long stylistId, long bookingId);



    @Query(value = "select b.* from booking b\n" +
            "inner join slot sl\n" +
            "on b.slot_id = sl.slotid\n" +
            "inner join stylist_schedule ss\n" +
            "on b.stylist_schedule_id = ss.stylist_schedule_id\n" +
            "where ss.account_id = ?1 and sl.slottime > ?2 and b.booking_day = ?3\n" +
            "and b.status != 'CANCELLED'\n" +
            "limit 1",nativeQuery = true)
    Booking bookingNearestOverTime(long stylistId, LocalTime time, LocalDate date);
    @Query(value = "select b.* from booking b\n" +
            "inner join slot sl\n" +
            "on b.slot_id = sl.slotid\n" +
            "inner join stylist_schedule ss\n" +
            "on b.stylist_schedule_id = ss.stylist_schedule_id\n" +
            "where ss.account_id = ?1 and sl.slottime < ?2 and b.booking_day = ?3\n" +
            "and b.status != 'CANCELLED'\n" +
            "limit 1",nativeQuery = true)
    Booking bookingNearestBeforeTime(long stylistId, LocalTime time, LocalDate date);
    @Query(value = "select b.* from booking b\n" +
            "inner join slot s \n" +
            "on b.slot_id = s.slotid\n" +
            "inner join stylist_schedule ss\n" +
            "on b.stylist_schedule_id = ss.stylist_schedule_id\n" +
            "where s.slotid = ?1 and ss.account_id = ?2 and ss.working_day = ?3 and b.status != 'CANCELLED'",nativeQuery = true)
    Booking bookingAtTime(long slotId, long id, LocalDate date);


    Booking findBookingByBookingId(long id);
    @Query(value = "select b.* from booking b \n" +
            "inner join stylist_schedule ssch\n" +
            "on b.stylist_schedule_id = ssch.stylist_schedule_id\n" +
            "inner join booking_detail bd\n" +
            "on b.booking_id = bd.booking_id\n" +
            "where ssch.working_day = ?1 and ssch.account_id = ?2\n" +
            "order by b.booking_id desc\n" +
            "limit 1 ",nativeQuery = true)
    Booking bookingNearest(LocalDate date, long stylistId);

    List<Booking> findByAccountAndStatus(Account account, BookingStatus status);



    @Query(value = "select * from booking b\n" +
            "where b.account_id = ?1 and b.status = ?2;",nativeQuery = true)
    List<Booking> getBookingsByIdAndSatus(long id, String status);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM booking_detail WHERE booking_id = ?1 ",nativeQuery = true)
    void deleteBookingDetail(long id);
    @Query("SELECT b FROM Booking b WHERE b.account.accountid = :stylistId AND b.account.role = 'STYLIST' AND b.bookingDay = :today")
    List<Booking> findBookingsByStylistAndDate(@Param("stylistId") Long stylistId, @Param("today") LocalDate today);

    @Query(value = "select b.* from booking b\n" +
            "inner join stylist_schedule ss\n" +
            "on b.stylist_schedule_id = ss.stylist_schedule_id\n" +
            "where ss.account_id = ?1 and b.booking_day = ?2\n" +
            "order by b.status desc, b.slot_id asc",nativeQuery = true)
    List<Booking> findAllByAccountInAndSalonBranch(long stylistId, LocalDate date);

    @Query(value = "select count(*) from booking b\n" +
            "inner join slot s\n" +
            "on b.slot_id = s.slotid\n" +
            "inner join specific_stylist_schedule ssch\n" +
            "on b.stylist_schedule_id = ssch.stylist_schedule_id\n" +
            "inner join stylist_schedule ss\n" +
            "on b.stylist_schedule_id = ss.stylist_schedule_id\n" +
            "inner join shift sh\n" +
            "on ssch.shift_id = sh.shift_id\n" +
            "where s.slottime >= sh.start_time and s.slottime < sh.end_time and  sh.shift_id = ?1 and b.status = 'COMPLETED' \n" +
            "and ss.account_id = ?2 and ss.working_day = ?3;",nativeQuery = true)
    int countTotalBookingCompleteInShift(long shiftId, long accountId, LocalDate date);

    @Query(value = "select b.* from booking b where b.booking_day = ?1 and b.status = 'PENDING'",nativeQuery = true)
    List<Booking> getBookingByDateAndStatusPending(LocalDate date);




    List<Booking> findByBookingDayAndAccountAndStatus(LocalDate date, Account account, BookingStatus status);


    @Query(value = "SELECT b.*, ss.account_id AS stylist_account_id FROM booking b " +
            "JOIN stylist_schedule ss ON b.stylist_schedule_id = ss.stylist_schedule_id " +
            "WHERE ss.account_id = :stylistId " +
            "AND b.booking_day = :bookingDay " +
            "AND b.slot_id > :slotId " +
            "AND b.status = 'PENDING'" +
            "ORDER BY b.slot_id ASC LIMIT 1", nativeQuery = true)
    Optional<Booking> findNextBookingSameDay(@Param("stylistId") Long stylistId,
                                             @Param("slotId") Long slotId,
                                             @Param("bookingDay") LocalDate bookingDay);


    @Query(value = "SELECT * FROM booking b WHERE b.booking_id = :bookingId", nativeQuery = true)
    Optional<Booking> findBookingById(@Param("bookingId") Long bookingId);
    @Query(value = "UPDATE booking_detail SET price = ?1 WHERE booking_id = ?2  and service_id= ?3;", nativeQuery = true)
    @Transactional
    @Modifying
    void updateBookingDetail(double price,long bookingId, long serviceId);
    @Query(value = "select b.booking_day, sum(p.payment_amount) from booking b\n" +
            "inner join payment p\n" +
            "on b.booking_id = p.booking_id\n" +
            "where month(b.booking_day) = ?1 and b.salon_id = ?2\n" +
            "group by b.booking_day",nativeQuery = true)
    List<Object[]> getTotalMoneyByBookingDay(int month, long salonId);
    @Query(value = "select sum(p.payment_amount) from booking b\n" +
            "inner join payment p\n" +
            "on b.booking_id = p.booking_id\n" +
            "where month(b.booking_day) = ?1 and b.salon_id = ?2",nativeQuery = true)
    double getTotalMoneyBySalonIdInMonth(int month, long salonId);

    @Query(value = "select sum(p.payment_amount) from booking b\n" +
            "inner join payment p\n" +
            "on b.booking_id = p.booking_id\n" +
            "where month(b.booking_day) = ?1",nativeQuery = true)
    double getTotalMoneyAllSalonIdInMonth(int month);

    @Query(value = "select count(*) from booking b where month(b.booking_day) = ?1",nativeQuery = true)
    long countAllBookingsInMonth(int month);

    @Query("SELECT b FROM Booking b JOIN b.stylistSchedule ss WHERE ss.account.accountid = :stylistId")
    List<Booking> findBookingByStylistId(@Param("stylistId") Long stylistId);
    @Query("SELECT b FROM Booking b " +
            "JOIN b.stylistSchedule ss " +
            "WHERE ss.account.accountid = :stylistId AND b.status = 'COMPLETED'" +
            "AND FUNCTION('YEAR', b.bookingDay) = :year " +
            "AND FUNCTION('MONTH', b.bookingDay) = :month")
    List<Booking> findBookingByStylistIdAndMonthYear(@Param("stylistId") Long stylistId,
                                                     @Param("month") int month,
                                                     @Param("year") int year);
    @Query(value = "select distinct b.* from booking b\n" +
            "inner join specific_stylist_schedule sssch\n" +
            "on b.stylist_schedule_id = sssch.stylist_schedule_id\n" +
            "inner join shift s \n" +
            "on sssch.shift_id = s.shift_id\n" +
            "inner join slot sl\n" +
            "on b.slot_id = sl.slotid\n" +
            "where b.stylist_schedule_id = ?1 and b.slot_id = ?2  and b.status = 'PENDING';",nativeQuery = true)
    List<Booking> getBookingsByStylistScheduleAndShiftId(long stylistScheduleId, long slotId);
    @Query(value = "select b.* from booking b \n" +
            "inner join payment p \n" +
            "on b.booking_id = p.booking_id\n" +
            "where p.payment_status = 'Completed' and b.booking_id = ?1",nativeQuery = true)
    Booking checkBookingStatus(long bookingId);

    @Query(value = "select b.* from booking b\n" +
            "inner join slot s \n" +
            "on b.slot_id = s.slotid\n" +
            "inner join stylist_schedule ss\n" +
            "on b.stylist_schedule_id = ss.stylist_schedule_id\n" +
            "where s.slotid = ?1 and b.booking_day = ?2 and ss.stylist_schedule_id = ?3 and b.status != 'CANCELLED'",nativeQuery = true)
    Booking getBySlotSlotidAndBookingDayAndStylistScheduleStylistScheduleId(long slotId, LocalDate date, long stylistScheduleId);

    @Query(value = "select count(*) from booking b\n" +
            "where b.status = 'COMPLETED' and year(b.booking_day) = ?1 and month(b.booking_day) =  ?2",nativeQuery = true)
    long countAllBookingsCompleted(int year, int month);
}

