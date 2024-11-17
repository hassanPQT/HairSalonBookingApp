package com.example.hairSalonBooking.model.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StylistForCreateSchedule {
    long id;
    String fullname;
    String image;
}
