package com.example.hairSalonBooking.model.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class VNPay {
    String vnp_Amount;
    String vnp_BankCode;
    String vnp_ResponseCode;
    String vnp_TxnRef;

}
