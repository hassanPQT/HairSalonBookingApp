package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Booking;
import com.example.hairSalonBooking.entity.SalonService;
import com.example.hairSalonBooking.entity.Shift;
import com.example.hairSalonBooking.entity.Slot;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.UpdateSlotRequest;
import com.example.hairSalonBooking.model.response.SlotResponse;
import com.example.hairSalonBooking.model.response.SlotTimeResponse;
import com.example.hairSalonBooking.repository.BookingRepository;
import com.example.hairSalonBooking.repository.ServiceRepository;
import com.example.hairSalonBooking.repository.ShiftRepository;
import com.example.hairSalonBooking.repository.SlotRepository;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;


@Service
public class SlotService {
    @Autowired
    SlotRepository slotRepository;
    @Autowired
    BookingRepository bookingRepository;
    @Autowired
    ServiceRepository serviceRepository;
    @Autowired
    private ShiftRepository shiftRepository;
    public Slot create(Slot slot) {
        // Kiểm tra xem slot có ID đã tồn tại không
        if (slot.getSlotid() != 0 && slotRepository.existsById(slot.getSlotid())) {
            throw new AppException(ErrorCode.SLOT_ID_EXISTED); // Ném ngoại lệ nếu ID đã tồn tại
        }

        // Lưu slot mới
        return slotRepository.save(slot);
    }

    //Read
    public List<Slot> getAllSlot() {
        List<Slot> slots = slotRepository.getAllSlotActive();
        return slots;
    }

    public List<Slot> getAllSlotValid(LocalDate date) {
        List<Slot> slots = slotRepository.getAllSlotActive();
        List<Slot> slotToRemove = new ArrayList<>();
        for(Slot slot : slots){
            LocalTime now = LocalTime.now();
            LocalDate dateNow = LocalDate.now();
            if(dateNow.isEqual(date)){
                if(now.isAfter(slot.getSlottime())){
                    slotToRemove.add(slot);
                }else{
                    break;
                }
            }else{
                break;
            }

        }
        slots.removeAll(slotToRemove);
        return slots;
    }
    //Update
    public Slot update(long slotid, Slot slot) {
        //B1: tìm ra thằng student cần đc update thông qua ID
        Slot updeSlot = slotRepository.findSlotBySlotid(slotid);
        if (updeSlot == null) {
            // Handle the case when the stylist is not found
            throw new AppException(ErrorCode.SLOT_NOT_FOUND);
        }
        //B2: Cập nhập thông tin nó
        updeSlot.setSlotid(slot.getSlotid());
        updeSlot.setSlottime(slot.getSlottime());
        //B3: Lưu xuống DataBase
        return slotRepository.save(updeSlot);

    }

//Delete

    public Slot delete(long slotid) {
        //B1: tìm ra thằng student cần đc update thông qua ID
        Slot updeSlot = slotRepository.findSlotBySlotid(slotid);
        if (updeSlot == null) {
            // Handle the case when the stylist is not found
            throw new AppException(ErrorCode.SLOT_NOT_FOUND);
        }
        updeSlot.setDeleted(true);
        return slotRepository.save(updeSlot);
    }

    public List<SlotResponse> updateSlotTime(UpdateSlotRequest request){
        List<Slot> slotsWithoutMinute = slotRepository.getSlotsWithoutMinute();
        List<Slot> newListSlot = new ArrayList<>();
        long slotBeginId = 1 ;
        Slot slotBegin = slotRepository.findSlotBySlotid(slotBeginId);
        newListSlot.add(slotBegin);
        List<Slot> slots = new ArrayList<>();
        List<SlotResponse> responses = new ArrayList<>();
        Shift shift = shiftRepository.getShiftByEndTimeDesc(1);
        List<LocalTime> newTime = new ArrayList<>();
        for(Slot slot : slotsWithoutMinute){
            Slot newSlot = new Slot();
            newSlot.setSlottime(slot.getSlottime().plusHours(request.getTime().getHour()).plusMinutes(request.getTime().getMinute()));
            newSlot.setDeleted(false);
            Slot slotAfter = slotRepository.getSlotAfter(newSlot.getSlottime());
            if(slotAfter == null){
                if(newSlot.getSlottime().isBefore(shift.getEndTime()) || newSlot.getSlottime().equals(shift.getEndTime())){
                    newListSlot.add(newSlot);
                    LocalTime newEndTime = shift.getEndTime().minusHours(newSlot.getSlottime().getHour()).minusMinutes(newSlot.getSlottime().getMinute());
                    if(request.getTime().isBefore(newEndTime) || request.getTime().equals(newEndTime)){
                        Slot newSlotTime = new Slot();
                        newSlotTime.setSlottime(newSlot.getSlottime().plusMinutes(request.getTime().getMinute()));
                        newSlotTime.setDeleted(false);
                        newListSlot.add(newSlotTime);
                        break;
                    }
                    break;
                }
                break;
            }
            LocalTime newSlotAfterTime = null;
            if(newSlot.getSlottime().isBefore(slotAfter.getSlottime())){
                newListSlot.add(newSlot);
                newSlotAfterTime = slotAfter.getSlottime().minusHours(newSlot.getSlottime().getHour()).minusMinutes(newSlot.getSlottime().getMinute());
            }
            LocalTime currentSlotTime = newSlot.getSlottime().plusMinutes(request.getTime().getMinute());
            while(request.getTime().isBefore(newSlotAfterTime) || request.getTime().equals(newSlotAfterTime)){
                Slot newSlotTime = new Slot();

                newSlotTime.setSlottime(currentSlotTime);
                newSlotTime.setDeleted(false);
                newListSlot.add(newSlotTime);
                newSlotAfterTime = newSlotAfterTime.minusHours(request.getTime().getHour()).minusMinutes(request.getTime().getMinute());
                currentSlotTime = currentSlotTime.plusMinutes(request.getTime().getMinute());
            }

        }
//    Comparator<Slot> slotComparator = new Comparator<Slot>() {
//        @Override
//        public int compare(Slot s1, Slot s2) {
//            return s1.getSlottime().compareTo(s2.getSlottime()) ; // So sánh theo thuộc tính time
//        }
//    };
//        List<Slot> newSlotTimeSort = new ArrayList<>(newListSlot);
//        Collections.sort(newSlotTimeSort,slotComparator);

        for(Slot slot : newListSlot){
            Slot checkSlot = slotRepository.findBySlottime(slot.getSlottime());
            newTime.add(slot.getSlottime());
            if(checkSlot == null) {
                Slot newSlot =  slotRepository.save(slot);
                SlotResponse slotResponse = new SlotResponse();
                slotResponse.setSlotid(newSlot.getSlotid());
                slotResponse.setSlottime(newSlot.getSlottime());
                responses.add(slotResponse);
            }else{
                checkSlot.setDeleted(false);
                slotRepository.save(checkSlot);
                SlotResponse slotResponse = new SlotResponse();
                slotResponse.setSlotid(checkSlot.getSlotid());
                slotResponse.setSlottime(checkSlot.getSlottime());
                responses.add(slotResponse);
            }

        }
        List<Slot> allSlot = slotRepository.findAll();
        allSlot.removeIf(time -> newTime.contains(time.getSlottime()));
        for(Slot slot : allSlot){
            Slot slotInvalid = slotRepository.findSlotBySlotid(slot.getSlotid());
            slotInvalid.setDeleted(true);
            slotRepository.save(slot);
        }


        return responses;
    }

    public SlotTimeResponse getSlotTimeBetween(){
        Slot slotBegin = slotRepository.slotBeginActive();
        Slot slotAfterBegin = slotRepository.slotAfterBeginActive(slotBegin.getSlottime());
        Slot slotEnd = slotRepository.slotEndActive();
        LocalTime timeBetweenTwoSlot = slotAfterBegin.getSlottime().minusHours(slotBegin.getSlottime().getHour()).minusMinutes(slotBegin.getSlottime().getMinute());
        SlotTimeResponse  response = new SlotTimeResponse();
        response.setTimeStart(slotBegin.getSlottime());
        response.setTimeEnd(slotEnd.getSlottime());
        response.setTimeBetween(timeBetweenTwoSlot);
        return response;
    }
}
