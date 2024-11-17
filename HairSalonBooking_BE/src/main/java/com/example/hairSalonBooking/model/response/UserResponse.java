package com.example.hairSalonBooking.model.response;

import com.example.hairSalonBooking.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserResponse {
    private long id;
    private String name;
    private String username;
    private String email;
    private String image;
    private boolean isDelete;
    private String token;
    private Role role;
}
