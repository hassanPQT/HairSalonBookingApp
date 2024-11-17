package com.example.hairSalonBooking.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class ConfigCloudinary {

    @Bean
    public Cloudinary configKey(){
        Map<String,String> config = new HashMap<>();
        config.put("cloud_name", "dblanrvfh");
        config.put("api_key", "927175351471229");
        config.put("api_secret", "kBdY_M4v6jw1OVLeT6jQ4Nt2GHE");
        return new Cloudinary(config);
    }
}
