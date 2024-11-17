package com.example.hairSalonBooking.exception;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppException extends RuntimeException {
    ErrorCode errorCode;
    public AppException(ErrorCode errorCode) {

        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
