package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.*;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.AddShiftRequest;
import com.example.hairSalonBooking.model.request.SpecificStylistScheduleRequest;
import com.example.hairSalonBooking.model.response.SpecificStylistScheduleResponse;
import com.example.hairSalonBooking.model.response.StylistScheduleResponse;
import com.example.hairSalonBooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class StylistScheduleService {

    @Autowired
    private StylistScheduleRepository stylistScheduleRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ShiftRepository shiftRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private SlotRepository slotRepository;

    List<Booking> bookingByShiftNotWorking = new ArrayList<>();
    public SpecificStylistScheduleRequest createStylistSchedule(SpecificStylistScheduleRequest list){
        StylistSchedule schedule = stylistScheduleRepository.getScheduleId(list.getStylistId(), list.getWorkingDate());
        if(schedule != null){
            throw  new AppException(ErrorCode.STYLIST_SCHEDULE_EXIST);
        }
        Set<Shift> shiftSet = new HashSet<>();
        for(Long id: list.getShiftId()){
            Shift shift = shiftRepository.findByShiftId(id);
            shiftSet.add(shift);
        }
        Account account = accountRepository.findAccountByAccountid(list.getStylistId());
        StylistSchedule stylistSchedule = new StylistSchedule();
        stylistSchedule.setAccount(account);
        stylistSchedule.setWorkingDay(list.getWorkingDate());
        stylistSchedule.setShifts(shiftSet);
        stylistScheduleRepository.save(stylistSchedule);



        return list;
    }

    public List<SpecificStylistScheduleResponse> getStylistScheduleByDay(LocalDate date, long salonId){
        List<SpecificStylistScheduleResponse> specificStylistScheduleResponses = new ArrayList<>();
        List<StylistSchedule> stylistSchedules = stylistScheduleRepository.getStylistScheduleByDayAndSalonId(salonId,date);
        for(StylistSchedule stylistSchedule : stylistSchedules){
            Set<Long> shifts = shiftRepository.getShiftIdByStylistSchedule(stylistSchedule.getStylistScheduleId());
            SpecificStylistScheduleResponse response = new SpecificStylistScheduleResponse();
            response.setId(stylistSchedule.getStylistScheduleId());
            response.setStylistName(stylistSchedule.getAccount().getFullname());
            response.setWorkingDate(stylistSchedule.getWorkingDay());
            response.setShiftId(shifts);
            specificStylistScheduleResponses.add(response);
        }
        return  specificStylistScheduleResponses;
    }

    public SpecificStylistScheduleResponse updateStylistSchedule(long id, SpecificStylistScheduleRequest request){

        StylistSchedule schedule = stylistScheduleRepository.findByStylistScheduleId(id);
        Set<Shift> shifts = new HashSet<>();
        for(Long shiftId : request.getShiftId()){
            Shift shift = shiftRepository.findByShiftId(shiftId);
            shifts.add(shift);
        }
        Set<Shift> allShifts = shiftRepository.getAllShifts();
        allShifts.removeAll(shifts);
        for(Shift shift : allShifts){
            List<Slot> slots = slotRepository.getSlotsInShift(shift.getShiftId());
            for(Slot slot : slots){
                List<Booking> bookings = bookingRepository.getBookingsByStylistScheduleAndShiftId(schedule.getStylistScheduleId(), slot.getSlotid());
                bookingByShiftNotWorking.addAll(bookings);
            }
        }
        stylistScheduleRepository.deleteSpecificSchedule(schedule.getStylistScheduleId());
        Account account  = accountRepository.findAccountByAccountid(request.getStylistId());
        schedule.setShifts(shifts);
        schedule.setAccount(account);
        schedule.setWorkingDay(request.getWorkingDate());
        stylistScheduleRepository.save(schedule);
        SpecificStylistScheduleResponse response = new SpecificStylistScheduleResponse();
        response.setId(schedule.getStylistScheduleId());
        response.setStylistName(account.getFullname());
        response.setWorkingDate(request.getWorkingDate());
        response.setShiftId(request.getShiftId());
        return  response;
    }

    public StylistScheduleResponse getStylistSchedule(long id){
        StylistSchedule schedule = stylistScheduleRepository.findByStylistScheduleId(id);
        Set<Long> shiftsId = shiftRepository.getShiftIdByStylistSchedule(id);
        StylistScheduleResponse response = new StylistScheduleResponse();
        response.setId(schedule.getStylistScheduleId());
        response.setStylistName(schedule.getAccount().getFullname());
        response.setStylistId(schedule.getAccount().getAccountid());
        response.setWorkingDate(schedule.getWorkingDay());
        response.setShiftId(shiftsId);
        return response;
    }

    public StylistScheduleResponse deleteStylistSchedule(long id){
        StylistSchedule schedule = stylistScheduleRepository.findByStylistScheduleId(id);
        Set<Long> shiftsId = shiftRepository.getShiftIdByStylistSchedule(id);
        for(Long shiftId : shiftsId){
            List<Slot> slots = slotRepository.getSlotsInShift(shiftId);
            for(Slot slot : slots){
                List<Booking> bookings = bookingRepository.getBookingsByStylistScheduleAndShiftId(schedule.getStylistScheduleId(), slot.getSlotid());
                bookingByShiftNotWorking.addAll(bookings);
            }
        }
        StylistScheduleResponse response = new StylistScheduleResponse();
        response.setId(schedule.getStylistScheduleId());
        response.setStylistName(schedule.getAccount().getFullname());
        response.setStylistId(schedule.getAccount().getAccountid());
        response.setWorkingDate(schedule.getWorkingDay());
        response.setShiftId(shiftsId);
        stylistScheduleRepository.deleteSpecificSchedule(id);
        stylistScheduleRepository.deleteById(id);
        return response;
    }

    public List<StylistScheduleResponse> getStylistScheduleInMonth(long accountId, int month){
        List<StylistSchedule> stylistSchedules = stylistScheduleRepository.getStylistSchedule(accountId,month);
        List<StylistScheduleResponse> responses = new ArrayList<>();
        for(StylistSchedule stylistSchedule : stylistSchedules){
            Set<Long> shiftId = shiftRepository.getShiftIdByStylistSchedule(stylistSchedule.getStylistScheduleId());
            StylistScheduleResponse response = new StylistScheduleResponse();
            response.setId(stylistSchedule.getStylistScheduleId());
            response.setStylistName(stylistSchedule.getAccount().getFullname());
            response.setStylistId(stylistSchedule.getAccount().getAccountid());
            response.setWorkingDate(stylistSchedule.getWorkingDay());
            response.setShiftId(shiftId);
            responses.add(response);
        }
        return responses;
    }

}
