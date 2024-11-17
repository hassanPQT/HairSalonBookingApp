package com.example.hairSalonBooking.model.request;


import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "INVALID_USERNAME")
    String username;

    @Email(message = "INVALID_EMAIL")
    String email;

    String fullname;

    @Pattern(regexp = "(84|0[35789])\\d{8}\\b",message = "INVALID_PHONE")
    String phone;

    @Size(min = 6, message ="PASSWORD_SIZE_INVALID")
    String password;

    String confirmpassword;
}

