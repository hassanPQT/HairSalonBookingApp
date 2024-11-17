
package com.example.hairSalonBooking.config;


import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.service.TokenService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import java.io.IOException;
import java.util.List;

@Component
@CrossOrigin("http://localhost:3000/")
public class Filter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;
    @Autowired
    @Qualifier("handlerExceptionResolver")
    HandlerExceptionResolver resolver;// tra ve loi

    private final List<String> AUTH_PERMISSION = List.of(
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/api/login",
            "/api/login-gg",
            "/api/register",
            "/api/verifyEmail/{email}",
            "/api/verifyOtp/{email}/{otp}",
            "/api/changePassword/{email}",
            "/api/Pay/{bookingId}",
            "/api/payment/response",
            "/api/checkout",
            "/api/service/newest",
            "/api/stylist/stylists/feedback-revenue",
            "/api/service/{serviceId}"
    );

    public boolean checkIsPublic(String uri){
        // uri : /api/login
        // neu gap nhung api trong list o tren => cho phep truy cap => true
        AntPathMatcher antPathMatcher = new AntPathMatcher();
        // con neu ko thi phan quyen, check token = > false
        // anyMatch: tim thang match voi uri truyen vao trong list
        return AUTH_PERMISSION.stream().anyMatch(pattern -> antPathMatcher.match(pattern,uri));

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // kiem tra trc khi cho phep truy cap vao controller
        //filterChain.doFilter(request,response);
        // check api ng dung yeu cau co phai la public api ko
        boolean isPublicApi = checkIsPublic(request.getRequestURI());
        if(isPublicApi){
            filterChain.doFilter(request,response);
        }else{
            String token = getToken(request);
            if(token == null){
                // ko dc phep truy cap
                resolver.resolveException(request,response,null,new RuntimeException("Empty token"));
                return;
            }

            // check token => lay thong tin account tu token
            Account account;
            try {
                account =  tokenService.verifyToken(token);
            }catch (ExpiredJwtException e){
                // token het han
                resolver.resolveException(request,response,null,new RuntimeException("Expired token"));

                return;
            }catch (MalformedJwtException malformedJwtException){
                // token sai
                resolver.resolveException(request,response,null,new RuntimeException("Wrong token"));
                return;
            }

            // token dung
            // cho phep truy cap

            // luu lai thong tin account cho lop sau dung`
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    account,
                    token,
                    account.getAuthorities()
            );
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request,response);
        }


    }

    public String getToken(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if(authHeader == null){
            return null;
        }
        return authHeader.substring(7);
        // Bearer mmmmkmkfmkgmfkgmk
    }
}
