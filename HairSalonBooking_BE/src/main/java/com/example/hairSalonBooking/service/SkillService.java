package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Skill;
import com.example.hairSalonBooking.model.response.SkillResponse;
import com.example.hairSalonBooking.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    public List<SkillResponse> getAllSkills(){
        List<Skill> skills = skillRepository.findAll();
        List<SkillResponse> responses = new ArrayList<>();
        for(Skill skill : skills){
            SkillResponse skillResponse = new SkillResponse();
            skillResponse.setId(skill.getSkillId());
            skillResponse.setName(skill.getSkillName());
            responses.add(skillResponse);
        }
        return responses;
    }
}
