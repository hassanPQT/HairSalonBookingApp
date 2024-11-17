package com.example.hairSalonBooking.service;


import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.enums.Role;

import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.IntrospectRequest;
import com.example.hairSalonBooking.model.request.RegisterRequest;
import com.example.hairSalonBooking.model.response.*;
import com.example.hairSalonBooking.model.request.LoginRequest;
import com.example.hairSalonBooking.repository.AccountRepository;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.validation.Valid;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import ognl.Token;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.example.hairSalonBooking.model.request.RegisterRequest;
import com.example.hairSalonBooking.model.response.AccountResponse;
import com.example.hairSalonBooking.model.request.LoginRequest;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.response.AuthenticationResponse;
import com.example.hairSalonBooking.repository.AccountRepository;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AuthenticationService implements UserDetailsService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;

//    @NonFinal
//    @Value("${jwt.signer-key}")
//    private String SIGNER_KEY;

    //            "iTx5DOgYrW3LEeEmnd9EG4cI5HxKKlhFUjYoytO3xDDMJN7xtPpgtDhrcTCUOrvk\n";
//    public IntrospectResponse introspect(IntrospectRequest request)
//            throws JOSEException, ParseException {
//        var token = request.getToken();
//        JWSVerifier verifier = new MACVerifier(SIGNER_KEY);
//        SignedJWT signedJWT = SignedJWT.parse(token);
//        //kiem tra toke het han chua
//        Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();
//        var verified = signedJWT.verify(verifier);
//
//        return IntrospectResponse.builder()
//                .valid(verified && expiration.after(new Date()))
//                .build();
//    }

    public AccountResponse register(RegisterRequest registerRequest) {
        if(!registerRequest.getPassword().equals(registerRequest.getConfirmpassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }
        Account account = modelMapper.map(registerRequest, Account.class);
        try {
            String originPassword = account.getPassword(); // goi
            account.setPassword(passwordEncoder.encode(originPassword));// dinh dang
            account.setRole(Role.CUSTOMER);
            Account newAccount = accountRepository.save(account);
            return modelMapper.map(newAccount, AccountResponse.class);
        } catch (Exception e) {
            if (e.getMessage().contains(account.getUsername())) {
                throw new AppException(ErrorCode.USERNAME_EXISTED);
            } else if (e.getMessage().contains(account.getEmail())) {
                throw new AppException(ErrorCode.EMAIL_EXISTED);
            } else {
                throw new AppException(ErrorCode.Phone_EXISTED);
            }
        }
    }


    public AuthenticationResponse login(LoginRequest loginRequest) { // xac minh xem username va password co trong database hay khong
        Account account; // Declare account here to make it accessible later
        try {
            // Authenticate the username and password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Get the authenticated account from the authentication object
            account = (Account) authentication.getPrincipal();

        } catch (Exception e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
        if(account.isDeleted()){
            throw new AppException(ErrorCode.CUSTOMER_DE_ACTIVE);
        }
        AuthenticationResponse response = modelMapper.map(account, AuthenticationResponse.class);
        response.setToken(tokenService.generateToken(account));
        //response.setSuccess(true);

        return response;
    }
    public AuthenticationResponse loginGoogle (String token) {
        try{
            FirebaseToken decodeToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String email = decodeToken.getEmail();
            Account user = accountRepository.findAccountByEmail(email);
            if(user == null) {
                Account user2 = new Account();
                user2.setEmail(email);
                user2.setUsername(decodeToken.getEmail());
                user2.setFullname(decodeToken.getName());
                user2.setImage(decodeToken.getPicture());
                user2.setRole(Role.CUSTOMER);
                user = accountRepository.save(user2);
            }
            if(user.isDeleted()){
                throw new AppException(ErrorCode.CUSTOMER_DE_ACTIVE);
            }
            AuthenticationResponse response = new AuthenticationResponse();
            response.setToken(tokenService.generateToken(user));
            response.setRole(user.getRole());
            return response;
        } catch (FirebaseAuthException e)
        {
            e.printStackTrace();
        }

        return null;
    }
    //tạo token
//    private String generateToken(String username) {
//        // b1: tạo header có thuat toán sử dụng
//        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
//        //b2: body noi dung gui di token có the username, user id
//        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
//                .subject(username)
//                //ten domain
//                .issuer("Fsalon.com")
//                // thoi gian ton tai
//                .issueTime(new Date())
//                .expirationTime(new Date(
//                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
//
//                ))
//                .claim("custumer claim", "Cus")
//                .build();
//        //b3 tao page load
//        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
//        //tạo json web signature
//        //B4 ki generate theo kieu string
//        JWSObject jwsObject = new JWSObject(header, payload);
//        try {
//            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
//            return jwsObject.serialize();
//        } catch (JOSEException e) {
//            log.error("Can't create toke" , e);
//            throw new RuntimeException(e);
//        }
//    }


    public List<AccountResponse> getAllAccount() {
        List<Account> accounts = accountRepository.findAll();

        // Map each Account to AccountResponse and return the list
        return accounts.stream()
                .map(account -> AccountResponse.builder()
                        .AccountId(account.getAccountid()) // Map account ID
                        .username(account.getUsername())   // Map username
                        .phone(account.getPhone())         // Map phone
                        .build())
                .collect(Collectors.toList()); // Collect the results into a list
    }

//    public Page<Account> getAllAccountCustomer(int page, int size) {
//      return accountRepository.findAll(PageRequest.of(page, size));
//    }

    // cái này chia luồng page Customer
    public AccountPageResponse getAllAccountCustomer(int page, int size) {

        Page<Account> accountPage = accountRepository.findAccountByRole(Role.CUSTOMER, PageRequest.of(page, size));
        Page<CusPageResponse> customerPage = accountPage.map(account ->
                new CusPageResponse(
                        account.getAccountid(),
                        account.getEmail(),
                        account.getFullname(),
                        account.getDob(),
                        account.getGender(),
                        account.getPhone(),
                        account.getImage(),
                        account.isDeleted())
        );


        AccountPageResponse customerPageResponse = new AccountPageResponse();
        customerPageResponse.setPageNumber(customerPage.getNumber());
        customerPageResponse.setTotalPages(customerPage.getTotalPages());
        customerPageResponse.setTotalElements(customerPage.getTotalElements());
        customerPageResponse.setContent(customerPage.getContent());

        return customerPageResponse;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findAccountByUsername(username);
    } // Định nghĩa cho mình biet cach lay Username


}




