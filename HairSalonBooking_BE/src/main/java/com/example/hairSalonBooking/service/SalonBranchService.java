package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.SalonBranch;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.CreateSalonRequest;
import com.example.hairSalonBooking.model.request.UpdateSalonRequest;
import com.example.hairSalonBooking.model.response.SalonResponse;
import com.example.hairSalonBooking.repository.SalonBranchRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SalonBranchService {
    @Autowired
    private SalonBranchRepository salonBranchRepository;
    @Autowired
    private ModelMapper modelMapper;
    public SalonResponse createSalonRequest(CreateSalonRequest request){
        SalonBranch salonBranch = salonBranchRepository.findSalonBranchByHotline(request.getHotline());
        if(salonBranch != null){
            throw new AppException(ErrorCode.HOTLINE_EXISTED);
        }
        SalonBranch newSalon = modelMapper.map(request,SalonBranch.class);
        salonBranchRepository.save(newSalon);
        return modelMapper.map(newSalon,SalonResponse.class);

    }

    public List<SalonResponse> getAllSalons(){ // show het salon o trang admin
        List<SalonBranch> branches = salonBranchRepository.findAll();
        List<SalonResponse> responses = new ArrayList<>();
        for(SalonBranch branch : branches){
            responses.add(modelMapper.map(branch,SalonResponse.class));
        }
        return responses;
    }
    public List<SalonResponse> getAllSalonsActive(){ // show nhung salon dang hoat dong cho customer coi
        List<SalonBranch> branches = salonBranchRepository.findSalonBranchsByIsDeleteFalse();
        List<SalonResponse> responses = new ArrayList<>();
        for(SalonBranch branch : branches){
            responses.add(modelMapper.map(branch,SalonResponse.class));
        }
        return responses;
    }
    public List<SalonResponse> getSalon(String address){ // customer search salon theo dia chi
        List<SalonBranch> branches = salonBranchRepository.findSalonBranchByAddress(address);
        List<SalonResponse> responses = new ArrayList<>();
        for(SalonBranch branch : branches){
            responses.add(modelMapper.map(branch,SalonResponse.class));
        }
        return responses;
    }
    public SalonBranch getSalonByAddress(String address){
        SalonBranch salonBranch = salonBranchRepository.findSalonBranchByAddressIsDeleteFalse(address);
        return salonBranch;
    }

    public SalonResponse updateSalon(UpdateSalonRequest request, long id){
        SalonBranch salonBranch = salonBranchRepository.findSalonBranchBySalonId(id);
        if(salonBranch == null){
            throw new AppException(ErrorCode.SALON_NOT_FOUND);
        }
        salonBranch.setAddress(request.getAddress());
        salonBranch.setHotline(request.getHotline());
        salonBranch.setDelete(request.isDelete());
        salonBranchRepository.save(salonBranch);
        return modelMapper.map(salonBranch,SalonResponse.class);
    }

    public SalonResponse deleteSalon(long id){
        SalonBranch salonBranch = salonBranchRepository.findSalonBranchBySalonId(id);
        if(salonBranch == null){
            throw new AppException(ErrorCode.SALON_NOT_FOUND);
        }
        salonBranch.setDelete(true);
        salonBranchRepository.save(salonBranch);
        return modelMapper.map(salonBranch,SalonResponse.class);
    }

    public SalonResponse activeSalon(long id){
        SalonBranch salonBranch = salonBranchRepository.findSalonBranchBySalonId(id);
        if(salonBranch == null){
            throw new AppException(ErrorCode.SALON_NOT_FOUND);
        }
        salonBranch.setDelete(false);
        salonBranchRepository.save(salonBranch);
        return modelMapper.map(salonBranch,SalonResponse.class);
    }
}
