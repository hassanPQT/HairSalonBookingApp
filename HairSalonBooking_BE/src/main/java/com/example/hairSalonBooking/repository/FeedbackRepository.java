package com.example.hairSalonBooking.repository;


import com.example.hairSalonBooking.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.hairSalonBooking.entity.Booking;
import com.example.hairSalonBooking.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback,Long> {
    Feedback findFeedbackByBookingBookingId(long id);

    @Query(value = "select f.* from feedback f\n" +
            "inner join booking b \n" +
            "on f.booking_id = b.booking_id\n" +
            "inner join stylist_schedule ss\n" +
            "on b.stylist_schedule_id = ss.stylist_schedule_id\n" +
            "where ss.account_id = ?1\n" +
            "order by f.day desc",nativeQuery = true)
    List<Feedback> getListFeedbackByStylist(long accountId);

}
