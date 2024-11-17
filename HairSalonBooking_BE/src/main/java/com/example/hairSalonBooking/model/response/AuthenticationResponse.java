package com.example.hairSalonBooking.model.response;


import com.example.hairSalonBooking.enums.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    String token;

    Role role;

}
