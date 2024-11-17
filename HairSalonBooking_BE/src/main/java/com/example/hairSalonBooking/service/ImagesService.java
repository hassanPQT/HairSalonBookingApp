package com.example.hairSalonBooking.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImagesService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        String publicValue = generatePublicValue(file.getOriginalFilename());// tao ra publicValue
        log.info("publicValue is: {}", publicValue);
        String extension = getFileName(file.getOriginalFilename())[1];// lay ra dinh dang vd: png,..
        log.info("extension is: {}", extension);
        File fileUpload = convert(file);
        log.info("fileUpload is: {}", fileUpload);
        cloudinary.uploader().upload(fileUpload, ObjectUtils.asMap("public_id", publicValue));
        cleanDisk(fileUpload);
        return  cloudinary.url().generate(StringUtils.join(publicValue, ".", extension));
    }

    public String generatePublicValue(String originalName){
        String fileName = getFileName(originalName)[0];// lay ra ten trc vd: adb.png => adb
        return StringUtils.join(UUID.randomUUID().toString(), "_", fileName);// join voi 1 chuoi bat ki
    }

    private File convert(MultipartFile file) throws IOException {
        //assert file.getOriginalFilename() != null;
        File convFile = new File(StringUtils.join(generatePublicValue(file.getOriginalFilename()),
                getFileName(file.getOriginalFilename())[1]));
        try(InputStream is = file.getInputStream()) {
            Files.copy(is, convFile.toPath());
        }
        return convFile;
    }
    private void cleanDisk(File file){
        try {
            System.out.println("filePath: " + file.toPath());
            Path filePath = file.toPath();
            Files.delete(filePath);
        }catch (IOException e){

        }
    }
    public String[] getFileName(String originalName){
        return originalName.split("\\.");// spilit tai dau .
    }
}
