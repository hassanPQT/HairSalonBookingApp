package com.example.hairSalonBooking.model.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class MailBody {
    String to;
    String subject;
    int otp;
}
