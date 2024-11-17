package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.UpdateCustomerRequest;
import com.example.hairSalonBooking.model.response.ProfileResponse;
import com.example.hairSalonBooking.repository.CustomerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class CustomerService {

    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    private ImagesService imagesService;
    public UpdateCustomerRequest updateCustomer(UpdateCustomerRequest request, long AccountId){
        Account account = customerRepository.findAccountByAccountid(AccountId);
        if(account == null){
            throw new AppException(ErrorCode.ACCOUNT_Not_Found_Exception);
        }
        account.setFullname(request.getFullname());
        account.setPhone(request.getPhone());
        account.setDob(request.getDob());
        account.setEmail(request.getEmail());
        account.setImage(request.getImage());
        customerRepository.save(account);
        return request;

    }

    public ProfileResponse getProfile(){
        var context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        Account account =(Account) authentication.getPrincipal();
        ProfileResponse profileResponse = new ProfileResponse();
        profileResponse.setAccountid(account.getAccountid());
        profileResponse.setDob(account.getDob());
        profileResponse.setImage(account.getImage());
        profileResponse.setGender(account.getGender());
        profileResponse.setRole(account.getRole());
        profileResponse.setEmail(account.getEmail());
        profileResponse.setPhone(account.getPhone());
        profileResponse.setFullname(account.getFullname());

        if(account.getSalonBranch() != null){
            profileResponse.setSalonId(account.getSalonBranch().getSalonId());
        }

        return profileResponse;
    }

    public String deActiveUser(long accountId){
        Account account  = customerRepository.findAccountByAccountid(accountId);
        if(account == null){
            throw new AppException(ErrorCode.ACCOUNT_Not_Found_Exception);
        }
        account.setDeleted(true);
        customerRepository.save(account);
        return "Delete successfully";
    }
    public String activeUser(long accountId){
        Account account  = customerRepository.findAccountByAccountid(accountId);
        if(account == null){
            throw new AppException(ErrorCode.ACCOUNT_Not_Found_Exception);
        }
        account.setDeleted(false);
        customerRepository.save(account);
        return "Active successfully";
    }

    public Long countAllCustomers(){
        return customerRepository.countAllCustomers();
    }

    public String getCustomerByPhoneNumber(String phone){
        Account account = customerRepository.findByPhone(phone);
        if(account == null){
            throw new AppException(ErrorCode.ACCOUNT_Not_Found_Exception);
        }
        return account.getFullname();
    }
}
