package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.*;
import com.example.hairSalonBooking.enums.BookingStatus;
import com.example.hairSalonBooking.enums.Role;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.CreateStaffRequest;
import com.example.hairSalonBooking.model.request.StaffCreateBookingRequest;
import com.example.hairSalonBooking.model.request.StaffCreateCustomerRequest;
import com.example.hairSalonBooking.model.request.UpdateStaffRequest;
import com.example.hairSalonBooking.model.response.BookingResponse;
import com.example.hairSalonBooking.model.response.StaffResponse;
import com.example.hairSalonBooking.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class StaffService {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private SalonBranchRepository salonBranchRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private SlotRepository slotRepository;
    @Autowired
    private StylistScheduleRepository stylistScheduleRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public StaffResponse createStaff(CreateStaffRequest request){
        Account account = modelMapper.map(request,Account.class);
        try {
            SalonBranch salonBranch = salonBranchRepository.findSalonBranchBySalonId(request.getSalonId());
            account.setSalonBranch(salonBranch);
            account.setPassword(passwordEncoder.encode(request.getPassword()));
            account.setRole(Role.STAFF);
            accountRepository.save(account);
            return modelMapper.map(account,StaffResponse.class);
        }catch (Exception e){
            if(e.getMessage().contains(request.getUsername())){
                throw  new AppException(ErrorCode.USERNAME_EXISTED);
            }else if(e.getMessage().contains(request.getEmail())){
                throw new AppException(ErrorCode.EMAIL_EXISTED);
            }else{
                throw new AppException(ErrorCode.Phone_EXISTED);
            }
        }
    }
    //accountid;
    //    String email;
    //    String username;
    //    String fullName;
    //    LocalDate dob;
    //    String salonAddress;
    //    String phone;
    //    String gender;
    //    boolean isDelete
    public List<StaffResponse> getAllStaffs(){
        List<Account> accounts = accountRepository.getAccountsByRoleSTAFF();
        List<StaffResponse> staffResponses = new ArrayList<>();
        for(Account account : accounts){
            StaffResponse staffResponse = StaffResponse.builder()
                    .accountid(account.getAccountid())
                    .email(account.getEmail())
                    .username(account.getUsername())
                    .fullName(account.getFullname())
                    .dob(account.getDob())
                    .salonAddress(account.getSalonBranch().getAddress())
                    .phone(account.getPhone())
                    .gender(account.getGender())
                    .isDelete(account.isDeleted())
                    .build();
            staffResponses.add(staffResponse);
        }
        return staffResponses;
    }
    public StaffResponse getSpecificStaff(long accountId){
        Account account = accountRepository.findAccountByAccountid(accountId);
        StaffResponse staffResponse = new StaffResponse();
        staffResponse.setAccountid(account.getAccountid());
        staffResponse.setGender(account.getGender());
        staffResponse.setEmail(account.getEmail());
        staffResponse.setDob(account.getDob());
        staffResponse.setPhone(account.getPhone());
        staffResponse.setFullName(account.getFullname());
        staffResponse.setSalonAddress(account.getSalonBranch().getAddress());
        return staffResponse;
    }
    public StaffResponse updateStaff(UpdateStaffRequest request, long id){
        Account account = accountRepository.findAccountByAccountid(id);
        if(account == null){
            throw new AppException(ErrorCode.ACCOUNT_Not_Found_Exception);
        }

        SalonBranch salonBranch = salonBranchRepository.findSalonBranchBySalonId(request.getSalonId());
        account.setEmail(request.getEmail());
        account.setDob(request.getDob());
        account.setPhone(request.getPhone());
        account.setFullname(request.getFullName());
        account.setSalonBranch(salonBranch);
        account.setGender(request.getGender());
        account.setDeleted(request.isDelete());
        accountRepository.save(account);
        StaffResponse staffResponse = StaffResponse.builder()
                .accountid(account.getAccountid())
                .email(account.getEmail())
                .username(account.getUsername())
                .fullName(account.getFullname())
                .dob(account.getDob())
                .salonAddress(account.getSalonBranch().getAddress())
                .phone(account.getPhone())
                .gender(account.getGender())
                .isDelete(account.isDeleted())
                .build();
        return staffResponse;
    }
    public StaffResponse deleteStaff(long id){
        Account account = accountRepository.findAccountByAccountid(id);
        if(account == null){
            throw new AppException(ErrorCode.ACCOUNT_Not_Found_Exception);
        }
        account.setDeleted(true);
        accountRepository.save(account);
        StaffResponse staffResponse = StaffResponse.builder()
                .accountid(account.getAccountid())
                .email(account.getEmail())
                .username(account.getUsername())
                .fullName(account.getFullname())
                .dob(account.getDob())
                .salonAddress(account.getSalonBranch().getAddress())
                .phone(account.getPhone())
                .gender(account.getGender())
                .isDelete(account.isDeleted())
                .build();
        return staffResponse;
    }
    public List<StaffResponse> getAllStaffBySalonId(long salonId){
        List<Account> accounts = accountRepository.findByRoleAndIsDeletedFalseAndSalonBranchSalonId(Role.STAFF,salonId);
        List<StaffResponse> staffResponses = new ArrayList<>();
        for(Account account : accounts){
            StaffResponse staffResponse = new StaffResponse();
            staffResponse.setSalonAddress(account.getSalonBranch().getAddress());
            staffResponse.setDob(account.getDob());
            staffResponse.setGender(account.getGender());
            staffResponse.setEmail(account.getEmail());
            staffResponse.setPhone(account.getPhone());
            staffResponse.setAccountid(account.getAccountid());
            staffResponse.setFullName(account.getFullname());
            staffResponses.add(staffResponse);
        }
        return staffResponses;
    }
    public StaffCreateBookingRequest createBookingByStaff(StaffCreateBookingRequest request){
        Account account = accountRepository.findByPhone(request.getPhoneNumber());
        if(account == null){
            throw new AppException(ErrorCode.ACCOUNT_Not_Found_Exception);
        }
        Set<SalonService> serviceSet = new HashSet<>();
        for(Long id: request.getServiceId()){
            SalonService service = serviceRepository.getServiceById(id);
            serviceSet.add(service);
        }
        Slot slot = slotRepository.findSlotBySlotid(request.getSlotId());
        if(slot == null){
            throw new AppException(ErrorCode.SLOT_NOT_FOUND);
        }
        SalonBranch salonBranch = salonBranchRepository.findSalonBranchBySalonId(request.getSalonId());
        if(salonBranch == null){
            throw new AppException(ErrorCode.SALON_NOT_FOUND);
        }
        StylistSchedule stylistSchedule = stylistScheduleRepository.getScheduleId(request.getStylistId(), request.getBookingDate());
        if(stylistSchedule == null){
            throw new AppException(ErrorCode.STYLIST_UNAVAILABLE);
        }
        Booking booking = new Booking();
        booking.setServices(serviceSet);
        booking.setBookingDay(request.getBookingDate());
        booking.setStatus(BookingStatus.PENDING);
        booking.setAccount(account);
        booking.setSlot(slot);
        booking.setSalonBranch(salonBranch);
        booking.setStylistSchedule(stylistSchedule);
        Booking newBooking =  bookingRepository.save(booking);
        for(SalonService service : serviceSet){
            bookingRepository.updateBookingDetail(service.getPrice(),newBooking.getBookingId(),service.getServiceId());
        }
        return request;
    }


    public List<BookingResponse> getBookingByPhoneNumber(LocalDate date, String phone){
        Account account  = accountRepository.findByPhone(phone);
        List<Booking> bookings = bookingRepository.findByBookingDayAndAccountAndStatus(date,account,BookingStatus.PENDING);
        List<BookingResponse> responses = new ArrayList<>();
        Set<Long> serviceId = new HashSet<>();
        for(Booking booking : bookings){
            for(SalonService service : booking.getServices()){
                serviceId.add(service.getServiceId());
            }
            BookingResponse bookingResponse = new BookingResponse();
            bookingResponse.setStatus(booking.getStatus());
            bookingResponse.setId(booking.getBookingId());
            bookingResponse.setSalonName(booking.getSalonBranch().getAddress());
            bookingResponse.setServiceId(serviceId);
            bookingResponse.setDate(booking.getBookingDay());
            bookingResponse.setTime(booking.getSlot().getSlottime());
            bookingResponse.setCustomerName(booking.getAccount().getFullname());
            if(booking.getVoucher() != null){
                bookingResponse.setVoucherCode(booking.getVoucher().getCode());
            }
            bookingResponse.setStylistName(booking.getStylistSchedule().getAccount().getFullname());
            bookingResponse.setCustomerId(booking.getAccount().getAccountid());
            bookingResponse.setCustomerPhone(booking.getAccount().getPhone());
            responses.add(bookingResponse);
        }
        return responses;
    }


    public StaffCreateCustomerRequest staffCreateCustomer(StaffCreateCustomerRequest request){
        Account account = accountRepository.findByPhone(request.getPhone());
        if(account != null){
            throw new AppException(ErrorCode.ACCOUNT_EXIST);
        }
        Account newAccount = new Account();
        newAccount.setPhone(request.getPhone());
        newAccount.setFullname(request.getFullName());
        newAccount.setUsername(request.getPhone());
        newAccount.setPassword(passwordEncoder.encode(request.getPhone()));
        newAccount.setRole(Role.CUSTOMER);
        accountRepository.save(newAccount);
        return request;

    }
}
