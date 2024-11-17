package com.example.hairSalonBooking.model.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data

@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginGG {
    String token;
}
