package com.example.hairSalonBooking.model.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UpdateSalonRequest {
    String address;
    String hotline;
    boolean isDelete = false;
}
