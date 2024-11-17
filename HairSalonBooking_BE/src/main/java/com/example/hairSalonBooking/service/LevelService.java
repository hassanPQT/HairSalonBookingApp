package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Level;
import com.example.hairSalonBooking.model.response.LevelResponse;
import com.example.hairSalonBooking.repository.LevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LevelService {

    @Autowired
    private LevelRepository levelRepository;

    public List<LevelResponse> getAllLevel(){
        List<Level> levels = levelRepository.findAll();
        List<LevelResponse> levelResponses = new ArrayList<>();
        for(Level level : levels){
            LevelResponse levelResponse = new LevelResponse();
            levelResponse.setId(level.getLevelid());
            levelResponse.setName(level.getLevelname());
            levelResponses.add(levelResponse);
        }
        return levelResponses;
    }
}
