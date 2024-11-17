package com.example.hairSalonBooking.controller;

import com.example.hairSalonBooking.entity.Booking;
import com.example.hairSalonBooking.entity.Slot;



import com.example.hairSalonBooking.model.request.AssignNewStylistForBooking;

import com.example.hairSalonBooking.model.request.BookingRequest;
import com.example.hairSalonBooking.model.request.BookingSlots;
import com.example.hairSalonBooking.model.request.BookingStylits;
import com.example.hairSalonBooking.model.response.*;
import com.example.hairSalonBooking.service.BookingService;
import com.example.hairSalonBooking.service.HairSalonServiceService;
import com.example.hairSalonBooking.service.StylistService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000/")
//@CrossOrigin("https://f-salon.vercel.app/")
@SecurityRequirement(name = "api")
public class BookingController {
    @Autowired
    private StylistService stylistService;
    @Autowired
    private HairSalonServiceService hairSalonServiceService;
    @Autowired
    private BookingService bookingService;
    @PostMapping("/booking/stylists")
    public ApiResponse<Set<StylistForBooking>> getListService(@RequestBody BookingStylits bookingStylits){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.getStylistForBooking(bookingStylits));
        return apiResponse;
    }
    @PostMapping("/booking/slots")
    public ApiResponse<List<Slot>> getListSlots(@RequestBody BookingSlots bookingSlots){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.getListSlot(bookingSlots));
        return apiResponse;
    }
    @PostMapping("/booking/slots/{bookingId}")
    public ApiResponse<List<Slot>> getSlotsUpdateByCustomer(@RequestBody BookingSlots bookingSlots,
                                                            @PathVariable long bookingId){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.getSlotsUpdateByCustomer(bookingSlots,bookingId));
        return apiResponse;
    }

    @PostMapping("/booking")
    public ApiResponse<Booking> createBooking(@RequestBody BookingRequest request){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.createNewBooking(request));
        return apiResponse;
    }


    @GetMapping("/booking/{bookingId}")
    public ApiResponse<BookingResponse> getBookingById(@PathVariable long bookingId){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.getBookingById(bookingId));
        return apiResponse;
    }

    @PutMapping("/booking/{bookingId}")
    public ApiResponse<Booking> updateBooking(@PathVariable long bookingId,@RequestBody BookingRequest request){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.updateBooking(bookingId,request));
        return apiResponse;
    }
    @DeleteMapping("/booking/{bookingId}")
    public ApiResponse deleteBooking(@PathVariable Long bookingId){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.deleteBooking(bookingId));
        return apiResponse;
    }
    // lay ra theo trang thai
    @GetMapping("/customer/{accountId}/pending")
    public ApiResponse<List<Booking>> getPendingBookings(@PathVariable Long accountId){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.getBookingByStatusPendingByCustomer(accountId));
        return apiResponse;
    }

    @GetMapping("/customer/{accountId}/completed")
    public ApiResponse<List<Booking>> getCompleteBookings(@PathVariable Long accountId){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.getBookingByStatusCompletedByCustomer(accountId));
        return apiResponse;
    }
    // controller checkin
    @PutMapping("/{bookingId}/checkin")
    public ApiResponse<String> checkIn(@PathVariable Long bookingId) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.checkIn(bookingId));
        return apiResponse;
    }

    @PutMapping("/checkout")
    public ApiResponse<String> checkOut(@RequestParam(required = false) String transactionId,
                                        @RequestParam(required = false) Long bookingId) {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.checkout(transactionId, bookingId));  // Truyền cả hai tham số
        return apiResponse;
    }
    @PostMapping("/{bookingId}/finish")
    public ApiResponse<PaymentResponse> finishBooking(@PathVariable Long bookingId) {
        ApiResponse apiResponse = new ApiResponse<>();
        PaymentResponse paymentResponse = bookingService.finishedService(bookingId);
        apiResponse.setResult(paymentResponse);
        return apiResponse;
    }

    @GetMapping("/bookings/stylist/{date}/{accountId}")
    public ApiResponse<List<BookingResponse>> getTodayBookingsForStylist(@PathVariable Long accountId, @PathVariable String date) {
        ApiResponse apiResponse = new ApiResponse<>();
        LocalDate localDate = LocalDate.parse(date); // chắc rằng form đúng yyyy-mm-dd
        apiResponse.setResult(stylistService.getBookingsForStylistOnDate(accountId, localDate));
        return apiResponse;
    }


    @PostMapping("/booking/stylists/update")
    public ApiResponse<Set<StylistForBooking>> getListService(@RequestBody AssignNewStylistForBooking bookingStylits){
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.getStylistWhenUpdateBookingByManager(bookingStylits));
        return apiResponse;
    }



    @PutMapping("/update/service/{bookingId}")
    public ApiResponse<BookingRequest> updateService(@PathVariable Long bookingId, @RequestBody BookingRequest request) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.updateBookingWithService(bookingId, request.getServiceId()));
        return apiResponse;
    }

    @GetMapping("/booking/total-money/day/month/{month}/salon/{salonId}")
    public ApiResponse<List<TotalMoneyByBookingDay>> totalMoneyByBookingDay(@PathVariable int month, @PathVariable long salonId ) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.totalMoneyByBookingDayInMonth(month,salonId));
        return apiResponse;
    }

    @GetMapping("/booking/total-money/month/{month}/salon/{salonId}")
    public ApiResponse<TotalMoneyByBookingDay> totalMoneyBySalonInMonth(@PathVariable int month, @PathVariable long salonId ) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.totalMoneyBySalonInMonth(month,salonId));
        return apiResponse;
    }

    @GetMapping("/booking/status/{bookingId}")
    public ApiResponse<String> checkBookingStatus(@PathVariable long bookingId) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.checkBookingStatus(bookingId));
        return apiResponse;
    }

    @GetMapping("/booking/count/completed/{yearAndMonth}")
    public  ApiResponse<Long> countAllBookingsComplete(@PathVariable String yearAndMonth){
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setResult(bookingService.countAllBookingsCompleted(yearAndMonth));
        return apiResponse;
    }
}
