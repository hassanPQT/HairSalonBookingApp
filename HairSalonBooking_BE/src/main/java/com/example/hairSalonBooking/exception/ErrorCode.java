package com.example.hairSalonBooking.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    EXCEPTION(999,"Error"),
    EMAIL_NOT_FOUND(1001,"Email is not correct"),
    INVALID_OTP(1002,"Invalid OTP"),
    PASSWORD_NOT_MATCH(1003,"Password not match"),
    OTP_HAS_EXPIRED(1004,"OTP has expired"),
    PASSWORD_SIZE_INVALID(1005, "password must be at least 6 character"),
    INVALID_EMAIL(1006,"Invalid email"),
    UNCATEGORIZED_EXCEPTION(1007,"Password or Username invalid"),
    ACCOUNT_Not_Found_Exception(1008,"Account not found"),
    INVALID_PHONE(1009,"Invalid phone number"),
    INVALID_KEY (1010, "Invalid message key"),
    USERNAME_EXISTED(1011,"Username already existed"),
    EMAIL_EXISTED(1012,"Email already existed"),
    Phone_EXISTED(1013,"Phone already existed"),
    INVALID_USERNAME(1014,"Username can not be blank"),
    INVALID_DOB(1015,"Date of birth is not valid"),
    INVALID_HOTLINE(1016,"Invalid salon hotline"),
    INVALID_ADDRESS(1017,"Salon address can not be blank"),
    HOTLINE_EXISTED(1018,"Salon hotline already existed"),
    SALON_NOT_FOUND(1019,"Salon not found"),
    INVALID_VOUCHER_QUANTITY(1020,"Voucher quantity must be greater than 0"),
    INVALID_VOUCHER_DISCOUNT(1021,"Voucher discount must be greater than 0"),
    INVALID_VOUCHER_CODE(1022,"Voucher code can not be blank"),
    INVALID_VOUCHER_NAME(1022,"Voucher name can not be blank"),
    DUPLICATE_VOUCHER_CODE(1023,"Voucher code already existed"),
    VOUCHER_NOT_FOUND(1024,"Voucher not found"),
    STYLIST_NOT_FOUND(1025, " Stylist not found"),
    SLOT_NOT_FOUND(1026,"Slot not found"),
    SLOT_ID_EXISTED(1027,"Slot id existed"),
    SERVICE_NO_BLANK(1028, "SalonService name can not be blank"),
    PRICE_NO_BLANK(1029, "Price can not be blank"),
    CAN_NOT_UPLOAD_IMAGE(1030,"Can't not upload image"),

    BOOKING_NOT_FOUND(1031,"Booking not found"),
    VOUCHER_NOT_AVAILABLE(1032,"Voucher not available"),
    INVALID_PAYMENT_AMOUNT(1033,"Invalid payment amount"),

    SERVICES_NOT_FOUND(1034,"Service Not Found"),
    SERVICES_ALREADY_BOOKED(1035,"Service already booked"),
    STYLIST_UNAVAILABLE(1036, "Stylist is unavailable"),

    CUSTOMER_DE_ACTIVE(1037, "Account has been blocked"),
    ACCOUNT_EXIST(1038, "Account already existed"),

    BOOKING_EXIST(1039,"Booking is exist"),
    STYLIST_SCHEDULE_EXIST(1040,"Stylist already have schedule in this day"),
    LEVEL_NOT_FOUND(1041, "Level not found"),
    REVENUE_POSITIVE(1042, "Revenue must greater then 0 "),
    PERFORMANCE_SCORE_POSITIVE(1042, "Performance score must greater then 0 "),
    BONUS_POSITIVE(1042, "Bonus percent must greater then 0 "),
    SLOT_NOT_VALID(1043,"Slot is not valid"),
    SHIFT_NOT_FOUND(1043,"Shift of stylist is not available"),
    STYLIST_ALREADY_BOOKING(1043,"Stylist already booking")
    ;
    int code;
    String message;
}