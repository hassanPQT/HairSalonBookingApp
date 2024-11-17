package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Booking;

import com.example.hairSalonBooking.enums.BookingStatus;

import com.example.hairSalonBooking.model.request.ChangeStylist;
import com.example.hairSalonBooking.model.request.CreateNewBookingSuccess;
import com.example.hairSalonBooking.model.request.MailBody;

import com.example.hairSalonBooking.model.request.ReminderBooking;
import com.example.hairSalonBooking.repository.BookingRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@Service
public class EmailService {
    @Autowired
    private TemplateEngine templateEngine;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private BookingRepository bookingRepository;
    public void sendSimpleMessage(MailBody mailBody){
        try {
            Context context = new Context();
            context.setVariable("name",mailBody.getTo());
            context.setVariable("otp",mailBody.getOtp());
            String template = templateEngine.process("OTP-ForgotPassword",context);
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
            mimeMessageHelper.setFrom("fsalon391@gmail.com");
            mimeMessageHelper.setTo(mailBody.getTo());
            mimeMessageHelper.setText(template,true);
            mimeMessageHelper.setSubject(mailBody.getSubject());
            javaMailSender.send(mimeMessage);
        }catch (MessagingException exception){
            System.out.println("Can't not send email");

        }
    }

    public void sendReminderMail(ReminderBooking reminderBooking){
        try {
            Context context = new Context();
            context.setVariable("name",reminderBooking.getTo());
            context.setVariable("date",reminderBooking.getDate());
            context.setVariable("stylistName",reminderBooking.getStylistName());
            context.setVariable("time",reminderBooking.getTime());
            context.setVariable("address",reminderBooking.getSalonAddress());
            String template = templateEngine.process("ReminderBooking",context);
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
            mimeMessageHelper.setFrom("fsalon391@gmail.com");
            mimeMessageHelper.setTo(reminderBooking.getTo());
            mimeMessageHelper.setText(template,true);
            mimeMessageHelper.setSubject(reminderBooking.getSubject());
            javaMailSender.send(mimeMessage);
        }catch (MessagingException exception){
            System.out.println("Can't not send email");

        }
    }
    public void sendMailInformBookingSuccess(CreateNewBookingSuccess createNewBookingSuccess){
        try {
            Context context = new Context();
            context.setVariable("name",createNewBookingSuccess.getTo());
            context.setVariable("date",createNewBookingSuccess.getDate());
            context.setVariable("stylistName",createNewBookingSuccess.getStylistName());
            context.setVariable("time",createNewBookingSuccess.getTime());
            context.setVariable("address",createNewBookingSuccess.getSalonAddress());
            String template = templateEngine.process("CreateNewBooking",context);
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
            mimeMessageHelper.setFrom("fsalon391@gmail.com");
            mimeMessageHelper.setTo(createNewBookingSuccess.getTo());
            mimeMessageHelper.setText(template,true);
            mimeMessageHelper.setSubject(createNewBookingSuccess.getSubject());
            javaMailSender.send(mimeMessage);
        }catch (MessagingException exception){
            System.out.println("Can't not send email");

        }
    }

    public void sendMailChangeStylist(ChangeStylist request){
        try {
            Context context = new Context();
            context.setVariable("name",request.getTo());
            context.setVariable("date",request.getDate());
            context.setVariable("stylistName",request.getStylistName());
            context.setVariable("time",request.getTime());
            context.setVariable("address",request.getSalonAddress());
            String template = templateEngine.process("ChangeStylist",context);
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
            mimeMessageHelper.setFrom("fsalon391@gmail.com");
            mimeMessageHelper.setTo(request.getTo());
            mimeMessageHelper.setText(template,true);
            mimeMessageHelper.setSubject(request.getSubject());
            javaMailSender.send(mimeMessage);
        }catch (MessagingException exception){
            System.out.println("Can't not send email");

        }
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void sendAutomatic(){
        System.out.println("hello");
        LocalDate date = LocalDate.now();
        List<Booking> bookings = bookingRepository.getBookingByDateAndStatusPending(date);
        LocalTime now = LocalTime.now();
        for(Booking booking : bookings){
            LocalTime newTime = booking.getSlot().getSlottime().minusMinutes(15);
            if((newTime.getHour() == now.getHour()) && (newTime.getMinute() == now.getMinute())){
                ReminderBooking reminderBooking = ReminderBooking.builder()
                        .to(booking.getAccount().getEmail())
                        .subject("Reminder Your Booking")
                        .stylistName(booking.getStylistSchedule().getAccount().getFullname())
                        .date(booking.getBookingDay())
                        .time(booking.getSlot().getSlottime())
                        .salonAddress(booking.getSalonBranch().getAddress())
                        .build();
                sendReminderMail(reminderBooking);
                System.out.println("Send mail success");
            }
            if(now.isAfter(booking.getSlot().getSlottime().plusMinutes(15)) && booking.getStatus().equals(BookingStatus.PENDING)){
                booking.setStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);
            }

        }

    }
}
