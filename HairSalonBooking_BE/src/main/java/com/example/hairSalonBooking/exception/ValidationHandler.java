package com.example.hairSalonBooking.exception;

import com.example.hairSalonBooking.model.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice // đánh dấu đây là 1 class để bắt lỗi
public class ValidationHandler {

    // Canh bắt lỗi cho mình
    //MethodArgumentNotValidExeption => lỗi do thư viện gây ra

    // nếu gặp lỗi hàm này sẽ => run
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity   handlerValidation(MethodArgumentNotValidException exception) {
//
//        String message ="";
//
//        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
//            //công tin nhắn vào lỗi
//            message += fieldError.getDefaultMessage()+"\n";
//        }
//        // trả về cho người dùng biết
//        return new ResponseEntity(message, HttpStatus.BAD_REQUEST);
//        // dù in ra vẫn báo lỗi 400 vì nó vẫn chưa hoàn thiện
//
//    }
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> handleRuntimeException(Exception exception) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(999);
        apiResponse.setMessage(exception.getMessage());
        return  ResponseEntity.badRequest().body(apiResponse);
    }
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse > handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(exception.getMessage());
        return  ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handleEntity(MethodArgumentNotValidException exception){
        String enumkey = exception.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.valueOf(enumkey);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return  ResponseEntity.badRequest().body(apiResponse);
    }


}
