package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.entity.Booking;
import com.example.hairSalonBooking.entity.SalonBranch;
import com.example.hairSalonBooking.entity.SalonService;
import com.example.hairSalonBooking.enums.BookingStatus;
import com.example.hairSalonBooking.enums.Role;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.CreateManagerRequest;
import com.example.hairSalonBooking.model.request.UpdateBookingForStylistBusyRequest;
import com.example.hairSalonBooking.model.request.UpdateManagerRequest;
import com.example.hairSalonBooking.model.response.*;
import com.example.hairSalonBooking.repository.AccountRepository;
import com.example.hairSalonBooking.repository.BookingRepository;
import com.example.hairSalonBooking.repository.SalonBranchRepository;
import com.example.hairSalonBooking.repository.ServiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BranchManagerService {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private SalonBranchRepository salonBranchRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private StylistScheduleService stylistScheduleService;
    public ManagerResponse createManager(CreateManagerRequest request){
        Account account  = modelMapper.map(request,Account.class);
        try {
            SalonBranch salonBranch = salonBranchRepository.findSalonBranchBySalonId(request.getSalonId());
            account.setSalonBranch(salonBranch);
            account.setRole(Role.BRANCH_MANAGER);
            account.setPassword(passwordEncoder.encode(request.getPassword()));
            accountRepository.save(account);
            return modelMapper.map(account,ManagerResponse.class);
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

    public List<ManagerResponse> getAllManagers(){
        List<Account> accounts = accountRepository.findByRoleAndIsDeletedFalse(Role.BRANCH_MANAGER);
        List<ManagerResponse> managerResponses = new ArrayList<>();
        for(Account account : accounts){
            ManagerResponse response = ManagerResponse.builder()
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
            managerResponses.add(response);
        }
        return managerResponses;
    }
    public ManagerResponse getSpecificManager(long accountId){
        Account account = accountRepository.findAccountByAccountid(accountId);
        ManagerResponse response = new ManagerResponse();
        response.setAccountid(account.getAccountid());
        response.setGender(account.getGender());
        response.setDob(account.getDob());
        response.setEmail(account.getEmail());
        response.setPhone(account.getPhone());
        response.setFullName(account.getFullname());
        response.setSalonAddress(account.getSalonBranch().getAddress());
        return response;
    }
    public ManagerResponse updateManager(long id, UpdateManagerRequest request){
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
        ManagerResponse response = ManagerResponse.builder()
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
        return response;
    }

    public ManagerResponse deleteManager(long id){
        Account account = accountRepository.findAccountByAccountid(id);
        if(account == null){
            throw new AppException(ErrorCode.ACCOUNT_Not_Found_Exception);
        }
        account.setDeleted(true);
        accountRepository.save(account);
        ManagerResponse response = ManagerResponse.builder()
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
        return response;
    }
    // cái này để lấy tất cả các booking của stylist theo chi nhánh
    public List<BookingResponse> getAllBookingsForStylistsInBranch(Long branchId, LocalDate date) {
        // Kiểm tra xem chi nhánh có tồn tại không
        SalonBranch branch = salonBranchRepository.findById(branchId)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found"));

        // Lấy tất cả các stylist trong chi nhánh
        List<Account> stylists = accountRepository.getStylistsBySalo(branchId);

        // Lấy danh sách booking của các stylist trong chi nhánh
        List<Booking> bookings = new ArrayList<>();
        for(Account account : stylists){
            List<Booking> list = bookingRepository.findAllByAccountInAndSalonBranch(account.getAccountid(), date);
            bookings.addAll(list);
        }
        List<BookingResponse> responses = new ArrayList<>();
        for(Booking booking : bookings){
            Set<SalonService> services = serviceRepository.getServiceForBooking(booking.getBookingId());
            Set<Long> serviceId = new HashSet<>();
            for(SalonService service : services){
                serviceId.add(service.getServiceId());
            }

            BookingResponse bookingResponse = new BookingResponse();

            bookingResponse.setId(booking.getBookingId());
            bookingResponse.setCustomerId(booking.getAccount().getAccountid());

            bookingResponse.setStylistName(booking.getStylistSchedule().getAccount().getFullname());
            bookingResponse.setTime(booking.getSlot().getSlottime());
            bookingResponse.setDate(booking.getBookingDay());
            bookingResponse.setSalonName(booking.getSalonBranch().getAddress());

            bookingResponse.setServiceId(serviceId);

            bookingResponse.setStatus(booking.getStatus());
            bookingResponse.setCustomerName(booking.getAccount().getFullname());
            if(booking.getVoucher() != null){
                bookingResponse.setVoucherCode(booking.getVoucher().getCode());
            }

            responses.add(bookingResponse);
        }
        return responses;
    }

    public ProfileResponse getProfile(){
        var context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        Account account =(Account) authentication.getPrincipal();
        ProfileResponse profileResponse = new ProfileResponse();
        profileResponse.setAccountid(account.getAccountid());
        profileResponse.setDob(account.getDob());
        profileResponse.setImage(account.getImage());
        profileResponse.setGender(account.getGender());
        profileResponse.setRole(account.getRole());
        profileResponse.setEmail(account.getEmail());
        profileResponse.setPhone(account.getPhone());
        profileResponse.setFullname(account.getFullname());
        if(account.getSalonBranch() != null){
            profileResponse.setSalonId(account.getSalonBranch().getSalonId());
        }
        return profileResponse;
    }
    public BookingPageResponse getAllBookingsForStylistInBranchByPending(int page, int size, Long branchId, LocalDate date) {
        // Check if the branch exists
        SalonBranch branch = salonBranchRepository.findById(branchId)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found"));

        // Get all stylists in the branch
        List<Account> stylists = accountRepository.getStylistsBySalonId(branchId, Role.STYLIST);

        // Retrieve and filter bookings with PENDING status for each stylist in the branch
        List<BookingResponse> bookingResponses = stylists.stream()
                .flatMap(account -> bookingRepository.findAllByAccountInAndSalonBranch(account.getAccountid(), date).stream())
                .filter(booking -> booking.getStatus() == BookingStatus.PENDING)
                .map(booking -> {
                    Set<Long> serviceId = serviceRepository.getServiceIdByBooking(booking.getBookingId());

                    BookingResponse bookingResponse = new BookingResponse();
                    bookingResponse.setId(booking.getBookingId());
                    bookingResponse.setCustomerId(booking.getAccount().getAccountid());
                    bookingResponse.setCustomerPhone(booking.getAccount().getPhone());
                    bookingResponse.setStylistName(booking.getStylistSchedule().getAccount().getFullname());
                    bookingResponse.setTime(booking.getSlot().getSlottime());
                    bookingResponse.setDate(booking.getBookingDay());
                    bookingResponse.setSalonName(booking.getSalonBranch().getAddress());
                    bookingResponse.setServiceId(serviceId);
                    bookingResponse.setStatus(booking.getStatus());
                    bookingResponse.setCustomerName(booking.getAccount().getFullname());

                    if (booking.getVoucher() != null) {
                        bookingResponse.setVoucherCode(booking.getVoucher().getCode());
                    }

                    return bookingResponse;
                })
                .sorted(Comparator.comparing(BookingResponse::getTime))
                .collect(Collectors.toList());

        // Create a Page object for bookings
        int totalBookings = bookingResponses.size();
        int start = Math.min(page * size, totalBookings);
        int end = Math.min(start + size, totalBookings);
        List<BookingResponse> pagedResponses = bookingResponses.subList(start, end);

        // Build the BookingPageResponse
        BookingPageResponse bookingPageResponse = new BookingPageResponse();
        bookingPageResponse.setPageNumber(page);
        bookingPageResponse.setTotalPages((int) Math.ceil((double) totalBookings / size));
        bookingPageResponse.setTotalElements(totalBookings);
        bookingPageResponse.setContent(pagedResponses);

        return bookingPageResponse;
    }
    public BookingPageResponse getAllBookingsForStylistInBranchByComplete(int page, int size, Long branchId, LocalDate date) {
        // Check if the branch exists
        SalonBranch branch = salonBranchRepository.findById(branchId)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found"));

        // Get all stylists in the branch
        List<Account> stylists = accountRepository.getStylistsBySalonId(branchId, Role.STYLIST);

        // Retrieve and filter bookings with PENDING status for each stylist in the branch
        List<BookingResponse> bookingResponses = stylists.stream()
                .flatMap(account -> bookingRepository.findAllByAccountInAndSalonBranch(account.getAccountid(), date).stream())
                .filter(booking -> booking.getStatus() == BookingStatus.COMPLETED)
                .map(booking -> {
                    Set<Long> serviceId = serviceRepository.getServiceIdByBooking(booking.getBookingId());

                    BookingResponse bookingResponse = new BookingResponse();
                    bookingResponse.setId(booking.getBookingId());
                    bookingResponse.setCustomerId(booking.getAccount().getAccountid());
                    bookingResponse.setCustomerPhone(booking.getAccount().getPhone());
                    bookingResponse.setStylistName(booking.getStylistSchedule().getAccount().getFullname());
                    bookingResponse.setTime(booking.getSlot().getSlottime());
                    bookingResponse.setDate(booking.getBookingDay());
                    bookingResponse.setSalonName(booking.getSalonBranch().getAddress());
                    bookingResponse.setServiceId(serviceId);
                    bookingResponse.setStatus(booking.getStatus());
                    bookingResponse.setCustomerName(booking.getAccount().getFullname());

                    if (booking.getVoucher() != null) {
                        bookingResponse.setVoucherCode(booking.getVoucher().getCode());
                    }

                    return bookingResponse;
                })
                .sorted(Comparator.comparing(BookingResponse::getTime))
                .collect(Collectors.toList());

        // Create a Page object for bookings
        int totalBookings = bookingResponses.size();
        int start = Math.min(page * size, totalBookings);
        int end = Math.min(start + size, totalBookings);
        List<BookingResponse> pagedResponses = bookingResponses.subList(start, end);

        // Build the BookingPageResponse
        BookingPageResponse bookingPageResponse = new BookingPageResponse();
        bookingPageResponse.setPageNumber(page);
        bookingPageResponse.setTotalPages((int) Math.ceil((double) totalBookings / size));
        bookingPageResponse.setTotalElements(totalBookings);
        bookingPageResponse.setContent(pagedResponses);

        return bookingPageResponse;
    }
    public BookingPageResponse getAllBookingsForStylistInBranchByInprocess(int page, int size, Long branchId, LocalDate date) {
        // Check if the branch exists
        SalonBranch branch = salonBranchRepository.findById(branchId)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found"));

        // Get all stylists in the branch
        List<Account> stylists = accountRepository.getStylistsBySalonId(branchId, Role.STYLIST);

        // Retrieve and filter bookings with PENDING status for each stylist in the branch
        List<BookingResponse> bookingResponses = stylists.stream()
                .flatMap(account -> bookingRepository.findAllByAccountInAndSalonBranch(account.getAccountid(), date).stream())
                .filter(booking -> booking.getStatus() == BookingStatus.IN_PROGRESS)
                .map(booking -> {
                    Set<Long> serviceId = serviceRepository.getServiceIdByBooking(booking.getBookingId());

                    BookingResponse bookingResponse = new BookingResponse();
                    bookingResponse.setId(booking.getBookingId());
                    bookingResponse.setCustomerId(booking.getAccount().getAccountid());
                    bookingResponse.setCustomerPhone(booking.getAccount().getPhone());
                    bookingResponse.setStylistName(booking.getStylistSchedule().getAccount().getFullname());
                    bookingResponse.setTime(booking.getSlot().getSlottime());
                    bookingResponse.setDate(booking.getBookingDay());
                    bookingResponse.setSalonName(booking.getSalonBranch().getAddress());
                    bookingResponse.setServiceId(serviceId);
                    bookingResponse.setStatus(booking.getStatus());
                    bookingResponse.setCustomerName(booking.getAccount().getFullname());

                    if (booking.getVoucher() != null) {
                        bookingResponse.setVoucherCode(booking.getVoucher().getCode());
                    }

                    return bookingResponse;
                })
                .sorted(Comparator.comparing(BookingResponse::getTime))
                .collect(Collectors.toList());

        // Create a Page object for bookings
        int totalBookings = bookingResponses.size();
        int start = Math.min(page * size, totalBookings);
        int end = Math.min(start + size, totalBookings);
        List<BookingResponse> pagedResponses = bookingResponses.subList(start, end);

        // Build the BookingPageResponse
        BookingPageResponse bookingPageResponse = new BookingPageResponse();
        bookingPageResponse.setPageNumber(page);
        bookingPageResponse.setTotalPages((int) Math.ceil((double) totalBookings / size));
        bookingPageResponse.setTotalElements(totalBookings);
        bookingPageResponse.setContent(pagedResponses);

        return bookingPageResponse;
    }
    public BookingPageResponse getAllBookingsForStylistInBranchByCancel(int page, int size, Long branchId, LocalDate date) {
        // Check if the branch exists
        SalonBranch branch = salonBranchRepository.findById(branchId)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found"));

        // Get all stylists in the branch
        List<Account> stylists = accountRepository.getStylistsBySalonId(branchId, Role.STYLIST);

        // Retrieve and filter bookings with PENDING status for each stylist in the branch
        List<BookingResponse> bookingResponses = stylists.stream()
                .flatMap(account -> bookingRepository.findAllByAccountInAndSalonBranch(account.getAccountid(), date).stream())
                .filter(booking -> booking.getStatus() == BookingStatus.CANCELLED)
                .map(booking -> {
                    Set<Long> serviceId = serviceRepository.getServiceIdByBooking(booking.getBookingId());

                    BookingResponse bookingResponse = new BookingResponse();
                    bookingResponse.setId(booking.getBookingId());
                    bookingResponse.setCustomerId(booking.getAccount().getAccountid());
                    bookingResponse.setCustomerPhone(booking.getAccount().getPhone());
                    bookingResponse.setStylistName(booking.getStylistSchedule().getAccount().getFullname());
                    bookingResponse.setTime(booking.getSlot().getSlottime());
                    bookingResponse.setDate(booking.getBookingDay());
                    bookingResponse.setSalonName(booking.getSalonBranch().getAddress());
                    bookingResponse.setServiceId(serviceId);
                    bookingResponse.setStatus(booking.getStatus());
                    bookingResponse.setCustomerName(booking.getAccount().getFullname());

                    if (booking.getVoucher() != null) {
                        bookingResponse.setVoucherCode(booking.getVoucher().getCode());
                    }

                    return bookingResponse;
                })
                .sorted(Comparator.comparing(BookingResponse::getTime))
                .collect(Collectors.toList());

        // Create a Page object for bookings
        int totalBookings = bookingResponses.size();
        int start = Math.min(page * size, totalBookings);
        int end = Math.min(start + size, totalBookings);
        List<BookingResponse> pagedResponses = bookingResponses.subList(start, end);

        // Build the BookingPageResponse
        BookingPageResponse bookingPageResponse = new BookingPageResponse();
        bookingPageResponse.setPageNumber(page);
        bookingPageResponse.setTotalPages((int) Math.ceil((double) totalBookings / size));
        bookingPageResponse.setTotalElements(totalBookings);
        bookingPageResponse.setContent(pagedResponses);

        return bookingPageResponse;
    }

    public List<ManagerChartCricleResponse> chart(long salonId){
        long totalStylistInSalon = accountRepository.totalEmployeeByRoleInSalon(salonId, Role.STYLIST.name());
        long totalStaffInSalon = accountRepository.totalEmployeeByRoleInSalon(salonId, Role.STAFF.name());
        List<ManagerChartCricleResponse> responses = new ArrayList<>();
        ManagerChartCricleResponse response = new ManagerChartCricleResponse();
        response.setName("stylist");
        response.setValue(Long.toString(totalStylistInSalon));
        responses.add(response);
        ManagerChartCricleResponse response1 = new ManagerChartCricleResponse();
        response1.setName("staff");
        response1.setValue(Long.toString(totalStaffInSalon));
        responses.add(response1);
        return responses;
    }
    public List<ManagerChartCricleResponse> adminChart(){
        long totalStylist = accountRepository.totalEmployeeByRole(Role.STYLIST.name());
        long totalStaff = accountRepository.totalEmployeeByRole(Role.STAFF.name());
        long totalManager = accountRepository.totalEmployeeByRole(Role.BRANCH_MANAGER.name());
        List<ManagerChartCricleResponse> responses = new ArrayList<>();
        ManagerChartCricleResponse response = new ManagerChartCricleResponse();
        response.setName("stylist");
        response.setValue(Long.toString(totalStylist));
        responses.add(response);
        ManagerChartCricleResponse response1 = new ManagerChartCricleResponse();
        response1.setName("staff");
        response1.setValue(Long.toString(totalStaff));
        responses.add(response1);
        ManagerChartCricleResponse response2 = new ManagerChartCricleResponse();
        response2.setName("manager");
        response2.setValue(Long.toString(totalManager));
        responses.add(response2);
        return responses;
    }
    public List<BookingResponse> getBookingsByStylistShiftId(){
        List<BookingResponse> responses = new ArrayList<>();
        List<Booking> list = stylistScheduleService.bookingByShiftNotWorking;
        for(Booking booking : list){
            Set<Long> serviceId = serviceRepository.getServiceIdByBooking(booking.getBookingId());
            BookingResponse bookingResponse = new BookingResponse();
            bookingResponse.setId(booking.getBookingId());
            bookingResponse.setDate(booking.getBookingDay());
            bookingResponse.setTime(booking.getSlot().getSlottime());
            bookingResponse.setStylistName(booking.getStylistSchedule().getAccount().getFullname());
            bookingResponse.setStatus(booking.getStatus());
            bookingResponse.setServiceId(serviceId);
            bookingResponse.setSalonName(booking.getSalonBranch().getAddress());
            bookingResponse.setCustomerId(booking.getAccount().getAccountid());
            bookingResponse.setCustomerName(booking.getAccount().getFullname());
            bookingResponse.setCustomerPhone(booking.getAccount().getPhone());
            if(booking.getVoucher() != null){
                bookingResponse.setVoucherCode(booking.getVoucher().getCode());
            }
            responses.add(bookingResponse);
        }
        return responses;
    }
}
