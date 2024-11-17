package com.example.hairSalonBooking.service;



import com.example.hairSalonBooking.controller.StylistController;

import com.example.hairSalonBooking.entity.*;
import com.example.hairSalonBooking.enums.Role;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.SalaryRecordRequest;
import com.example.hairSalonBooking.model.request.StylistRequest;
import com.example.hairSalonBooking.model.request.UpdateStylistRequest;


import com.example.hairSalonBooking.model.response.AccountResponse;


import com.example.hairSalonBooking.model.response.AccountPageResponse;


import com.example.hairSalonBooking.model.response.BookingResponse;
import com.example.hairSalonBooking.model.response.StylistResponse;

import com.example.hairSalonBooking.model.response.*;

import com.example.hairSalonBooking.repository.*;


import lombok.extern.slf4j.Slf4j;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.PageImpl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import java.util.stream.Collectors;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Slf4j
@Service
public class StylistService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    private SalonBranchRepository salonBranchRepository;

    @Autowired
    private LevelRepository levelRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private KpiRepository kpiRepository;
    @Autowired
    private SkillRepository skillRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private StylistScheduleRepository stylistScheduleRepository;
    @Autowired
    private SalaryRecordRepository salaryRecordRepository;

    public StylistProfileResponse getProfile() {
        var context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        Account account = (Account) authentication.getPrincipal();
        StylistProfileResponse profileResponse = new StylistProfileResponse();
        Set<Skill> skills = skillRepository.getSkillByAccountId(account.getAccountid());
        Set<Long> skillsId = new HashSet<>();
        for (Skill skill : skills) {
            skillsId.add(skill.getSkillId());
        }
        profileResponse.setAccountid(account.getAccountid());
        profileResponse.setRole(account.getRole());
        profileResponse.setGender(account.getGender());
        profileResponse.setFullname(account.getFullname());
        profileResponse.setDob(account.getDob());
        profileResponse.setEmail(account.getEmail());
        profileResponse.setImage(account.getImage());
        profileResponse.setPhone(account.getPhone());
        profileResponse.setSalonId(account.getSalonBranch().getSalonId());
        profileResponse.setSkillId(skillsId);
        profileResponse.setLevelId(account.getLevel().getLevelid());
        return profileResponse;
    }


    public StylistResponse create(StylistRequest stylistRequest) {
        // Chuyển từ StylistRequest sang thực thể Account
        Account stylist = modelMapper.map(stylistRequest, Account.class);
        stylist.setRole(Role.STYLIST);
        try {
            stylist.setPassword(passwordEncoder.encode(stylistRequest.getPassword()));
            SalonBranch salonBranch = salonBranchRepository.findSalonBranchBySalonIdAndIsDeleteFalse(stylistRequest.getSalonId());
            stylist.setSalonBranch(salonBranch);
            Level level = levelRepository.findLevelByLevelid(stylistRequest.getLevelId());
            stylist.setLevel(level);
            stylist.setRole(Role.STYLIST);
            Set<Skill> skills = new HashSet<>();
            Set<String> skillNames = new HashSet<>();
            // Lưu vào database
            for (Long id : stylistRequest.getSkillId()) {
                Skill skill = skillRepository.findSkillBySkillId(id);
                skillNames.add(skill.getSkillName());
                skills.add(skill);
            }
            stylist.setSkills(skills);


            stylist.setImage(stylistRequest.getImage());
            // Lưu vào database
            Account newStylist = accountRepository.save(stylist);
            StylistResponse stylistResponse = new StylistResponse();
            stylistResponse.setUsername(newStylist.getUsername());
            stylistResponse.setAccountid(newStylist.getAccountid());
            stylistResponse.setEmail(newStylist.getEmail());
            stylistResponse.setFullname(newStylist.getFullname());
            stylistResponse.setPhone(newStylist.getPhone());
            stylistResponse.setImage(newStylist.getImage());
            stylistResponse.setDob(newStylist.getDob());
            stylistResponse.setGender(newStylist.getGender());
            stylistResponse.setSalonAddress(newStylist.getSalonBranch().getAddress());
            stylistResponse.setLevelName(newStylist.getLevel().getLevelname());

            stylistResponse.setSkillName(skillNames);


            // Chuyển đổi để trả về response
            return stylistResponse;
        } catch (Exception e) {
            if (e.getMessage().contains(stylist.getUsername())) {
                throw new AppException(ErrorCode.USERNAME_EXISTED);
            } else if (e.getMessage().contains(stylist.getEmail())) {
                throw new AppException(ErrorCode.EMAIL_EXISTED);
            } else {
                throw new AppException(ErrorCode.Phone_EXISTED);
            }
        }
    }

    public List<StylistResponse> getAllStylist() {
        List<Account> stylists = accountRepository.findByRole(Role.STYLIST);

        // Chuyển đổi sang danh sách StylistResponse
        return stylists.stream()
                .map(account -> {
                    StylistResponse stylistResponse = new StylistResponse();

                    // Map basic fields
                    stylistResponse.setUsername(account.getUsername());
                    stylistResponse.setAccountid(account.getAccountid());
                    stylistResponse.setEmail(account.getEmail());
                    stylistResponse.setFullname(account.getFullname());
                    stylistResponse.setPhone(account.getPhone());
                    stylistResponse.setImage(account.getImage());
                    stylistResponse.setDob(account.getDob());
                    stylistResponse.setGender(account.getGender());

                    // Map salon address
                    String salonAddress = (account.getSalonBranch() != null) ? account.getSalonBranch().getAddress() : null;
                    stylistResponse.setSalonAddress(salonAddress);

                    // Map level name
                    String levelName = (account.getLevel() != null) ? account.getLevel().getLevelname() : null;
                    stylistResponse.setLevelName(levelName);

                    // Map skill names
                    Set<String> skillNames = account.getSkills().stream()
                            .map(Skill::getSkillName)
                            .collect(Collectors.toSet());
                    stylistResponse.setSkillName(skillNames);

                    return stylistResponse;
                })
                .collect(Collectors.toList()); // Collect the results into a list
    }


    public StylistResponse getSpecificStylist(long accountId) {
        Account stylist = accountRepository.findByAccountidAndRole(accountId, Role.STYLIST);
        Set<Skill> skills = skillRepository.getSkillByAccountId(accountId);
        Set<String> skillName = new HashSet<>();
        for (Skill skill : skills) {
            skillName.add(skill.getSkillName());
        }
        StylistResponse response = new StylistResponse();
        response.setAccountid(stylist.getAccountid());
        response.setImage(stylist.getImage());
        response.setFullname(stylist.getFullname());
        response.setDob(stylist.getDob());
        response.setEmail(stylist.getEmail());
        response.setPhone(stylist.getPhone());
        response.setGender(stylist.getGender());
        response.setSkillName(skillName);
        response.setSalonAddress(stylist.getSalonBranch().getAddress());
        response.setLevelName(stylist.getLevel().getLevelname());
        return response;
    }

    public StylistPageResponse getAllAccountStylist(int page, int size, long salonId) {

        Page<Account> accountPage = accountRepository.findAccountByRoleAndSalonBranchSalonId(Role.STYLIST, PageRequest.of(page, size), salonId);

        List<StyPageResponse> styPageResponses = new ArrayList<>();
        for (Account account : accountPage) {
            Set<Skill> skills = skillRepository.getSkillByAccountId(account.getAccountid());
            Set<String> skillName = new HashSet<>();
            for (Skill skill : skills) {
                skillName.add(skill.getSkillName());
            }
            StyPageResponse styPageResponse = new StyPageResponse();
            styPageResponse.setAccountid(account.getAccountid());
            styPageResponse.setEmail(account.getEmail());
            styPageResponse.setFullname(account.getFullname());
            styPageResponse.setPhone(account.getPhone());
            styPageResponse.setImage(account.getImage());
            styPageResponse.setDob(account.getDob());
            styPageResponse.setGender(account.getGender());
            styPageResponse.setGetAddress(account.getSalonBranch().getAddress());
            styPageResponse.setLevelName(account.getLevel().getLevelname());
            styPageResponse.setSkillsName(skillName);
            styPageResponses.add(styPageResponse);
        }


        Page<StyPageResponse> stylistPage = new PageImpl<>(styPageResponses, PageRequest.of(page, size), accountPage.getTotalElements());

        // Build and return the StylistPageResponse
        StylistPageResponse stylistPageResponse = new StylistPageResponse();
        stylistPageResponse.setPageNumber(stylistPage.getNumber());
        stylistPageResponse.setTotalPages(stylistPage.getTotalPages());
        stylistPageResponse.setTotalElements(stylistPage.getTotalElements());
        stylistPageResponse.setContent(stylistPage.getContent());

        return stylistPageResponse;
    }


    public List<StylistForCreateSchedule> getStylistsBySalon(long salonId) {
        List<Account> accounts = accountRepository.getStylistsBySalo(salonId);
        List<StylistForCreateSchedule> stylist = new ArrayList<>();
        for (Account account : accounts) {
            StylistForCreateSchedule stylistForCreateSchedule = new StylistForCreateSchedule();
            stylistForCreateSchedule.setId(account.getAccountid());
            stylistForCreateSchedule.setFullname(account.getFullname());
            stylistForCreateSchedule.setImage(account.getImage());
            stylist.add(stylistForCreateSchedule);
        }
        return stylist;
    }


    public List<StylistResponse> getStylistByStatus() {
        List<Account> stylists = accountRepository.findByRoleAndIsDeletedFalse(Role.STYLIST);
        // Chuyển đổi sang danh sách StylistResponse
        return stylists.stream()
                .map(account -> {
                    StylistResponse stylistResponse = new StylistResponse();

                    // Map basic fields
                    stylistResponse.setUsername(account.getUsername());
                    stylistResponse.setAccountid(account.getAccountid());
                    stylistResponse.setEmail(account.getEmail());
                    stylistResponse.setFullname(account.getFullname());
                    stylistResponse.setPhone(account.getPhone());
                    stylistResponse.setImage(account.getImage());
                    stylistResponse.setDob(account.getDob());
                    stylistResponse.setGender(account.getGender());

                    // Map salon address
                    String salonAddress = (account.getSalonBranch() != null) ? account.getSalonBranch().getAddress() : null;
                    stylistResponse.setSalonAddress(salonAddress);

                    // Map level name
                    String levelName = (account.getLevel() != null) ? account.getLevel().getLevelname() : null;
                    stylistResponse.setLevelName(levelName);

                    // Map skill names
                    Set<String> skillNames = account.getSkills().stream()
                            .map(Skill::getSkillName)
                            .collect(Collectors.toSet());
                    stylistResponse.setSkillName(skillNames);

                    return stylistResponse;
                })
                .collect(Collectors.toList()); // Collect the results into a list
    }

    public StylistResponse updateStylist(long accountid, UpdateStylistRequest stylistRequest) {
        //tìm ra thằng stylist cần đc update thông qua ID
        Account updeStylist = accountRepository.findAccountByAccountid(accountid);
        updeStylist.setRole(Role.STYLIST);
        if (updeStylist == null) {
            // Handle the case when the stylist is not found
            throw new AppException(ErrorCode.STYLIST_NOT_FOUND);
        }
        accountRepository.deleteSpecificSkills(accountid);
        SalonBranch salonBranch = salonBranchRepository.findSalonBranchBySalonIdAndIsDeleteFalse(stylistRequest.getSalonId());
        updeStylist.setSalonBranch(salonBranch);
        Level level = levelRepository.findLevelByLevelid(stylistRequest.getLevelId());
        updeStylist.setLevel(level);
        Set<Skill> skills = new HashSet<>();
        Set<String> skillNames = new HashSet<>();
        // Lưu vào database
        for (Long id : stylistRequest.getSkillId()) {
            Skill skill = skillRepository.findSkillBySkillId(id);
            skillNames.add(skill.getSkillName());
            skills.add(skill);
        }
        updeStylist.setSkills(skills);
        //Cập nhập thông tin nó
        updeStylist.setEmail(stylistRequest.getEmail());
        updeStylist.setFullname(stylistRequest.getFullname());
        updeStylist.setPhone(stylistRequest.getPhone());
        updeStylist.setGender(stylistRequest.getGender());
        updeStylist.setImage(stylistRequest.getImage());
        updeStylist.setDeleted(stylistRequest.isDelete());
        updeStylist.setDob(stylistRequest.getDob());
        //Làm xong thì lưu xuống DataBase
        Account updatedStylist = accountRepository.save(updeStylist);
        StylistResponse stylistResponse = new StylistResponse();
        stylistResponse.setUsername(updatedStylist.getUsername());
        stylistResponse.setAccountid(updatedStylist.getAccountid());
        stylistResponse.setEmail(updatedStylist.getEmail());
        stylistResponse.setFullname(updatedStylist.getFullname());
        stylistResponse.setPhone(updatedStylist.getPhone());
        stylistResponse.setImage(updatedStylist.getImage());
        stylistResponse.setDob(updatedStylist.getDob());
        stylistResponse.setGender(updatedStylist.getGender());
        stylistResponse.setSalonAddress(updatedStylist.getSalonBranch().getAddress());
        stylistResponse.setLevelName(updatedStylist.getLevel().getLevelname());
        stylistResponse.setSkillName(skillNames);
        // trả về thôi
        return stylistResponse;
    }

    public StylistResponse deleteStylist(long accountid) {
        // đầu tiên mình tìm thằng cần Delete qua ID
        Account updeStylist = accountRepository.findAccountByAccountid(accountid);
        updeStylist.setRole(Role.STYLIST);
        if (updeStylist == null) {
            // Handle the case when the stylist is not found
            throw new AppException(ErrorCode.STYLIST_NOT_FOUND);
        }
        updeStylist.setDeleted(true);
        Account deleteStylist = accountRepository.save(updeStylist);
        return modelMapper.map(deleteStylist, StylistResponse.class);
    }

    public List<BookingResponse> getBookingsForStylistOnDate(Long stylistId, LocalDate date) {
        // Kiểm tra xem account có phải là Stylist không
        Account stylist = accountRepository.findById(stylistId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        // Kiểm tra Role
        if (stylist.getRole() != Role.STYLIST) {
            throw new IllegalArgumentException("Account is not a Stylist");
        }

        // Lấy danh sách booking từ database
        List<Booking> bookings = bookingRepository.findAllByAccountInAndSalonBranch(stylistId, date);
        // Chuyển đổi lúc trả ra từ Booking sang BookingResponse
        List<BookingResponse> responses = new ArrayList<>();

        for (Booking booking : bookings) {
            //Set<String> serviceNames = serviceRepository.getServiceNameByBooking(booking.getBookingId());
            Set<Long> serviceId = serviceRepository.getServiceIdByBooking(booking.getBookingId());

            BookingResponse bookingResponse = new BookingResponse();
            bookingResponse.setId(booking.getBookingId());
            bookingResponse.setStylistName(booking.getStylistSchedule().getAccount().getFullname());
            bookingResponse.setTime(booking.getSlot().getSlottime());
            bookingResponse.setDate(booking.getBookingDay());
            bookingResponse.setSalonName(booking.getSalonBranch().getAddress());
            bookingResponse.setServiceId(serviceId);
            bookingResponse.setStatus(booking.getStatus());
            bookingResponse.setCustomerId(booking.getAccount().getAccountid());
            bookingResponse.setCustomerName(booking.getAccount().getFullname());
            if (booking.getVoucher() != null) {
                bookingResponse.setVoucherCode(booking.getVoucher().getCode());
            }
            responses.add(bookingResponse);
        }
        return responses;
    }

    public List<StylistServiceResponse> getAllServiceByStylistId(long accountid) {
        // Truy vấn danh sách các đối tượng SalonService
        List<SalonService> services = serviceRepository.getSalonServiceByAccountId(accountid);

        if (services.isEmpty()) {
            // Ném ngoại lệ tùy chỉnh nếu không tìm thấy dịch vụ nào
            throw new AppException(ErrorCode.STYLIST_NOT_FOUND);
        }

        // Chuyển đổi danh sách SalonService thành StylistServiceResponse
        List<StylistServiceResponse> responses = services.stream().map(service -> {
            StylistServiceResponse stylistServiceResponse = new StylistServiceResponse();
            stylistServiceResponse.setServiceId(service.getServiceId());
            stylistServiceResponse.setServiceName(service.getServiceName());
            stylistServiceResponse.setPrice(service.getPrice());
            stylistServiceResponse.setDeleted(false);
            return stylistServiceResponse;
        }).collect(Collectors.toList());

        return responses;
    }

    /*public List<StylistPerformanceResponse> getStylistsWithFeedbackAndRevenue(LocalDate startDate, LocalDate endDate) {
        List<StylistSchedule> stylists = stylistScheduleRepository.findAllStylists();
        return stylists.stream().map(stylist -> {
            // Lấy tất cả các booking của stylist trong khoảng thời gian
            List<Booking> bookings = stylist.getBookings().stream()
                    .filter(booking -> !booking.getBookingDay().isBefore(startDate) && !booking.getBookingDay().isAfter(endDate))
                    .collect(Collectors.toList());

            // Tính tổng tiền kiếm được
            double totalRevenue = bookings.stream()
                    .filter(booking -> booking.getPayment() != null)  // Chỉ tính booking có payment
                    .mapToDouble(booking -> booking.getPayment().getPaymentAmount())
                    .sum();

            // Tính điểm feedback trung bình
            double totalFeedbackScore = bookings.stream()
                    .filter(booking -> booking.getFeedback() != null)  // Chỉ tính booking có feedback
                    .mapToDouble(booking -> booking.getFeedback().getScore())
                    .sum();

            long feedbackCount = bookings.stream()
                    .filter(booking -> booking.getFeedback() != null)
                    .count();

            double avgFeedback = (feedbackCount > 0) ? totalFeedbackScore / feedbackCount : 0.0;
            String yearAndMonth = startDate.getYear() + "-" + startDate.getMonthValue()  + startDate.getMonthValue(); // Ví dụ: "2024-09"
            Kpi kpi = kpiRepository.findByLevelAndYearAndMonth(stylist.getAccount().getLevel(), yearAndMonth);
            // Trả về DTO chứa thông tin stylist và các kết quả tính toán
            if(kpi != null && avgFeedback >= kpi.getPerformanceScore() && totalRevenue >= kpi.getRevenueGenerated()) {
                return new StylistPerformanceResponse(
                        stylist.getStylistScheduleId(),
                        stylist.getAccount().getFullname(),
                        avgFeedback,
                        totalRevenue
                );
            } else {
                return null;
            }
        }).collect(Collectors.toList());

    }*/


    private int countBooking(Long stylistId, String yearAndMonth) {
        // Tách tháng và năm từ yearAndMonth
        String[] parts = yearAndMonth.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);

        // Gọi hàm để lấy danh sách booking
        List<Booking> bookings = bookingRepository.findBookingByStylistIdAndMonthYear(stylistId, month, year);

        int sizeBookings = bookings.size(); // Số lượng booking

        log.info("Total bookings: {}", sizeBookings);
        return sizeBookings;
    }

    public double calculateAverageFeedback(Long stylistId, String yearAndMonth) {
        // Lấy danh sách bookings của stylist theo stylistId

        String[] parts = yearAndMonth.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);

        List<Booking> bookings = bookingRepository.findBookingByStylistIdAndMonthYear(stylistId, month, year);
        // Tính tổng điểm feedback và đếm số lượng feedback
        double totalFeedbackScore = bookings.stream()
                .filter(booking -> booking.getFeedback() != null) // Chỉ tính booking có feedback
                .mapToDouble(booking -> booking.getFeedback().getScore()) // Lấy điểm từ feedback
                .sum(); // Cộng dồn tất cả điểm lại
        long feedbackCount = bookings.stream()
                .filter(booking -> booking.getFeedback() != null) // Chỉ tính booking có feedback
                .count();
        double averageFeedbackScore = feedbackCount > 0 ? totalFeedbackScore / feedbackCount : 0.0;

        // Ghi log thông tin
        log.info("Stylist ID: {}, Total Feedback Score: {}, Average Feedback Score: {}", stylistId, totalFeedbackScore, averageFeedbackScore);

        return averageFeedbackScore;
    }

    public StylistRevenueResponse getStylistRevenue(long stylistId, String yearAndMonth) {
        String[] parts = yearAndMonth.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);
        double bonusPercent = 0 ;
        double totalRevenue = calculateTotalRevenue(stylistId, yearAndMonth);
        int sizeBookings = countBooking(stylistId, yearAndMonth);
        Level stylistLevel = levelRepository.getLevelByStylistId(stylistId);
        Kpi kpi = kpiRepository.getKpiByRevenueStylistLevel(totalRevenue,totalRevenue,stylistLevel.getLevelid());
        // Lấy thông tin về stylist
        Account name = accountRepository.findAccountByAccountid(stylistId);
        if (name == null) { // Kiểm tra nếu stylist không tồn tại
            throw new AppException(ErrorCode.STYLIST_NOT_FOUND);
        }
        if(kpi != null){
            bonusPercent = kpi.getBonusPercent();
        }
        String stylistName = name.getFullname();

        // Tạo đối tượng StylistRevenueResponse
        return StylistRevenueResponse.builder()
                .stylistId(stylistId)
                .stylistName(stylistName)
                .bookingQuantity(sizeBookings) // Đảm bảo bookingQuantity được định nghĩa trong StylistRevenueResponse
                .totalRevenue(totalRevenue)
                .bonusPercent(bonusPercent)
                .build();
    }

    public StylistFeedBackResponse getStylistFeedback(long stylistId, String yearAndMonth) {
        String[] parts = yearAndMonth.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);
        List<Booking> bookings = bookingRepository.findBookingByStylistIdAndMonthYear(stylistId, month, year);
        double totalRevenue = calculateAverageFeedback(stylistId, yearAndMonth);
        Account Name = accountRepository.findAccountByAccountid(stylistId);
        if (Name == null) {
            throw new AppException(ErrorCode.STYLIST_NOT_FOUND);
        }
        String StylistName = Name.getFullname();
//        String stylistName = (stylistId); // Giả sử bạn có phương thức này

        // Tạo đối tượng StylistRevenueResponse

        return StylistFeedBackResponse.builder()
                .stylistId(stylistId)
                .stylistName(StylistName)
                .averageFeedback(totalRevenue)
                .build();
    }

    public List<StylistPerformanceResponse> getStylistsWithFeedbackAndRevenue(String yearAndMonth) {
        List<Account> stylists = accountRepository.getAccountsByRoleStylist();
        List<StylistPerformanceResponse> bestStylists = new ArrayList<>();

        for (Account stylist : stylists) {
            Long stylistId = stylist.getAccountid();
            Long levelId = stylist.getLevel().getLevelid();

            // Tính tổng doanh thu và trung bình feedback
            double totalRevenue = calculateTotalRevenue(stylistId, yearAndMonth);
            double averageFeedback = calculateAverageFeedback(stylistId, yearAndMonth);

            // Lấy KPI cho stylist
            List<Kpi> stylistKpis = kpiRepository.findByStylistIdAndLevel(stylistId, levelId);

            if (stylistKpis != null && !stylistKpis.isEmpty()) {
                // Tìm KPI cao nhất
                Kpi highestKpi = stylistKpis.stream()
                        .max(Comparator.comparing(Kpi::getRevenueFrom))
                        .orElse(null);

                if (highestKpi != null) {
                    double revenueFrom = highestKpi.getRevenueFrom();
                    double performanceScore = highestKpi.getPerformanceScore();

                    // Kiểm tra doanh thu và điểm hiệu suất
                    if (totalRevenue >= revenueFrom && averageFeedback >= performanceScore) {
                        StylistPerformanceResponse response = StylistPerformanceResponse.builder()
                                .stylistId(stylistId)
                                .stylistName(stylist.getFullname())
                                .image(stylist.getImage())
                                .totalRevenue(totalRevenue)
                                .averageFeedback(averageFeedback)
                                .build();

                        bestStylists.add(response);
                    }
                }
            }
        }

        // Sắp xếp danh sách theo doanh thu giảm dần
        return bestStylists.stream()
                .sorted(Comparator.comparing(StylistPerformanceResponse::getTotalRevenue).reversed())
                .collect(Collectors.toList());
    }

    private double calculateTotalRevenue(Long stylistId, String yearAndMonth) {
        String[] parts = yearAndMonth.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);

        List<Booking> bookings = bookingRepository.findBookingByStylistIdAndMonthYear(stylistId, month, year);
        log.info("Bookings for stylist ID {} in month {} of year {}: {}", stylistId, month, year, bookings);
        log.info("Number of bookings for stylist ID {}: {}", stylistId, bookings.size());


        double totalPayment = bookings.stream()
                .filter(booking -> booking.getPayment() != null && booking.getPayment().getPaymentStatus().equals("Completed"))
                .mapToDouble(booking -> booking.getPayment().getPaymentAmount())
                .sum();

        log.info("Total payment: {}", totalPayment);
        return totalPayment;
    }

    private double calculateBonus(double totalPayment, double baseSalary, long levelId) {
        double bonus = 0.0;


        if (levelId == 1) { // Level 1
            if (totalPayment > 3000000 && totalPayment <= 5000000) {
                bonus = baseSalary * 0.10; // 10% bonus
            } else if (totalPayment > 5000000 && totalPayment <= 10000000) {
                bonus = baseSalary * 0.20; // 20% bonus
            } else if (totalPayment > 10000000 && totalPayment <= 15000000) {
                bonus = baseSalary * 0.25; // 25% bonus
            } else if (totalPayment > 15000000) {
                bonus = baseSalary * 0.30; // 30% bonus
            }
        } else if (levelId == 2) { // Level 2
            if (totalPayment > 5000000 && totalPayment <= 10000000) {
                bonus = baseSalary * 0.10; // 10% bonus
            } else if (totalPayment > 10000000 && totalPayment <= 20000000) {
                bonus = baseSalary * 0.20; // 20% bonus
            } else if (totalPayment > 20000000 && totalPayment <= 30000000) {
                bonus = baseSalary * 0.25; // 25% bonus
            } else if (totalPayment > 30000000) {
                bonus = baseSalary * 0.30; // 30% bonus
            }
        }

        log.info("Bonus calculated: {}", bonus);
        return bonus;
    }

    public List<SalaryResponse> calculateTotalSalary(Long salonId, String yearAndMonth) {
        List<Account> stylists = accountRepository.getAccountsBySalonAndRole(salonId, Role.STYLIST);
        List<SalaryResponse> salaryResponses = new ArrayList<>();

        for (Account stylist : stylists) {
            Long stylistId = stylist.getAccountid();
            Long levelId = stylist.getLevel().getLevelid();

            // Calculate total revenue and base salary
            double totalRevenue = calculateTotalRevenue(stylistId, yearAndMonth);
            double baseSalary = stylist.getLevel().getSalary(); // Get the stylist's base salary
            Optional<Double> optionalBonusPercentage = kpiRepository.findBonusPercentageByRevenueAndLevel(levelId, totalRevenue);
            double bonusPercentage = optionalBonusPercentage.orElse(0.0); // mặc định 0%
            double bonus = baseSalary * bonusPercentage;
            double totalSalary = baseSalary + bonus;

            SalaryResponse response = new SalaryResponse();
            response.setStylistId(stylist.getAccountid());
            response.setStylistName(stylist.getFullname());
            response.setMonth(yearAndMonth);
            response.setSalary(baseSalary);
            response.setBonus(bonus);
            response.setTotalSalary(totalSalary);

            salaryResponses.add(response);
        }
        return salaryResponses.stream()
                .sorted(Comparator.comparing(SalaryResponse::getTotalSalary).reversed())
                .collect(Collectors.toList());
    }
    public SalaryResponse calculateTotalSalaryByOneStylist(Long salonId, String yearAndMonth, Long stylistId) {
        // Fetch the specific stylist by stylist ID and salon ID
        Account stylist = accountRepository.findByIdAndSalonIdAndRole(stylistId, salonId, Role.STYLIST)
                .orElseThrow(() -> new AppException(ErrorCode.STYLIST_NOT_FOUND)); // Handle not found

        Long levelId = stylist.getLevel().getLevelid();
        double totalRevenue = calculateTotalRevenue(stylistId, yearAndMonth);
        double baseSalary = stylist.getLevel().getSalary();
        Optional<Double> optionalBonusPercentage = kpiRepository.findBonusPercentageByRevenueAndLevel(levelId, totalRevenue);
        double bonusPercentage = optionalBonusPercentage.orElse(0.0); // Default to 0% if no match
        double bonus = baseSalary * bonusPercentage;
        double totalSalary = baseSalary + bonus;

        SalaryResponse response = new SalaryResponse();
        response.setStylistId(stylist.getAccountid());
        response.setStylistName(stylist.getFullname());
        response.setMonth(yearAndMonth);
        response.setSalary(baseSalary);
        response.setBonus(bonus);
        response.setTotalSalary(totalSalary);

        return response; // Return the SalaryResponse for the specific stylist
    }

    public List<SalaryRecordRequest> saveSalaryRecords(List<SalaryRecordRequest> salaryRecordRequests) {
        List<SalaryRecordRequest> savedRecords = new ArrayList<>();

        for (SalaryRecordRequest request : salaryRecordRequests) {
            Account account = accountRepository.findById(request.getStylistId())
                    .orElseThrow(() -> new AppException(ErrorCode.STYLIST_NOT_FOUND));

            // Check if the account has the Role.STYLIST
            if (!account.getRole().equals(Role.STYLIST)) {
                throw new AppException(ErrorCode.STYLIST_NOT_FOUND);
            }

            SalaryRecord salaryRecord = new SalaryRecord();
            salaryRecord.setBonusSalary(request.getBonusSalary());
            salaryRecord.setMonthAndYear(request.getMonthAndYear());
            salaryRecord.setTotalSalary(request.getTotalSalary());
            salaryRecord.setAccount(account);

            salaryRecordRepository.save(salaryRecord);

            savedRecords.add(request);
        }

        return savedRecords;
    }

    public List<SalaryRecordRequest> getSalaryRecords(Long salonId, String monthAndYear) {
        // Fetch SalaryRecords for the salon
        List<SalaryRecord> salaryRecords = salaryRecordRepository.findSalaryRecordsBySalonIdAndYearMonth(salonId, monthAndYear);

        // Map the SalaryRecords to SalaryRecordRequest
        List<SalaryRecordRequest> responses = salaryRecords.stream()
                .map(record -> {
                    SalaryRecordRequest response = new SalaryRecordRequest();
                    response.setBonusSalary(record.getBonusSalary());
                    response.setTotalSalary(record.getTotalSalary());
                    response.setMonthAndYear(record.getMonthAndYear());
                    response.setStylistId(record.getAccount().getAccountid());
                    return response;
                })
                .collect(Collectors.toList());

        return responses;
    }
}

