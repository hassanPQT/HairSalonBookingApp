package com.example.hairSalonBooking.model.response;

import com.example.hairSalonBooking.entity.Booking;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class PaymentResponse {
     long bookingId;
     LocalDate bookingDate;
     String customerName;
     String stylistName;
     String salonAddress;
     Set<PaymentServiceResponse> services;
     String voucher;
     double totalAmount;

     public PaymentResponse(long bookingId,Set<PaymentServiceResponse> services,
                            double totalAmount, String voucher) {
          this.bookingId = bookingId;
          this.services = services;
          this.totalAmount = totalAmount;
          this.voucher = voucher;
     }
}
