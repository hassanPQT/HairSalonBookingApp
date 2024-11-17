package com.example.hairSalonBooking.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CreateSalonRequest {
    @NotBlank(message = "INVALID_ADDRESS")
    String address;

    @Pattern(regexp = "(84|0[3|5|7|8|9])+(\\d{8})\\b", message = "INVALID_HOTLINE")
    String hotline;

}
