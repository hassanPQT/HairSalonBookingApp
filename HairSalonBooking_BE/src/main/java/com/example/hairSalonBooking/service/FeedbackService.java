package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.entity.Booking;
import com.example.hairSalonBooking.entity.Feedback;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.CreateFeedBackRequest;
import com.example.hairSalonBooking.model.response.FeedbackResponse;
import com.example.hairSalonBooking.repository.AccountRepository;
import com.example.hairSalonBooking.repository.BookingRepository;
import com.example.hairSalonBooking.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private BookingRepository bookingRepository;
    public FeedbackResponse createFeedback(CreateFeedBackRequest request){
        Account account = accountRepository.findAccountByAccountid(request.getAccountId());
        if(account == null){
            throw new AppException(ErrorCode.ACCOUNT_Not_Found_Exception);
        }
        Booking booking = bookingRepository.findBookingByBookingId(request.getBookingId());
        if(booking == null){
            throw new AppException(ErrorCode.BOOKING_NOT_FOUND);
        }
        Feedback feedback = new Feedback();
        feedback.setDay(request.getDate());
        feedback.setScore(request.getScore());
        feedback.setContent(request.getContent());
        feedback.setAccount(account);
        feedback.setBooking(booking);
        feedbackRepository.save(feedback);
        FeedbackResponse response = new FeedbackResponse();
        response.setScore(feedback.getScore());
        response.setContent(feedback.getContent());
        response.setDate(feedback.getDay());
        response.setBookingId(feedback.getBooking().getBookingId());
        return response;
    }

    public FeedbackResponse getFeedbackByBookingId(long bookingId){
        Feedback feedback = feedbackRepository.findFeedbackByBookingBookingId(bookingId);
        if(feedback == null){
            return null;
        }
        FeedbackResponse response = new FeedbackResponse();
        response.setScore(feedback.getScore());
        response.setContent(feedback.getContent());
        response.setDate(feedback.getDay());
        response.setBookingId(feedback.getBooking().getBookingId());
        return response;
    }

    public List<FeedbackResponse> getFeedbacksByStylist(long accountId){
        List<Feedback> feedbacks = feedbackRepository.getListFeedbackByStylist(accountId);
        List<FeedbackResponse> responses = new ArrayList<>();
        for(Feedback feedback : feedbacks){
            FeedbackResponse response = new FeedbackResponse();
            response.setScore(feedback.getScore());
            response.setContent(feedback.getContent());
            response.setDate(feedback.getDay());
            response.setCustomerImage(feedback.getAccount().getImage());
            response.setCustomerName(feedback.getAccount().getFullname());
            response.setBookingId(feedback.getBooking().getBookingId());
            responses.add(response);
        }

        return responses;
    }

}
