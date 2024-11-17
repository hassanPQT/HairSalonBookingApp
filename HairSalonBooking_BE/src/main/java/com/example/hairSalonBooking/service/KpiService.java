package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Kpi;
import com.example.hairSalonBooking.entity.Level;
import com.example.hairSalonBooking.exception.AppException;
import com.example.hairSalonBooking.exception.ErrorCode;
import com.example.hairSalonBooking.model.request.KpiRequest;
import com.example.hairSalonBooking.model.request.UpdateKpiRequest;
import com.example.hairSalonBooking.model.response.KpiResponse;
import com.example.hairSalonBooking.repository.KpiRepository;
import com.example.hairSalonBooking.repository.LevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class KpiService {
    @Autowired
    private KpiRepository kpiRepository;
    @Autowired
    private LevelRepository levelRepository;
    public List<KpiResponse> getAllKpi(){
        List<Kpi> kpis = kpiRepository.findAll();
        List<KpiResponse> responses = new ArrayList<>();
        for(Kpi kpi : kpis){
            KpiResponse kpiResponse = new KpiResponse();
            kpiResponse.setLevelId(kpi.getLevel().getLevelid());
            kpiResponse.setLevelName(kpi.getLevel().getLevelname());
            kpiResponse.setBonus_percent(kpi.getBonusPercent());
            kpiResponse.setRevenue_from(kpi.getRevenueFrom());
            kpiResponse.setRevenue_to(kpi.getRevenueTo());
            kpiResponse.setPerformance_score(kpi.getPerformanceScore());
            responses.add(kpiResponse);
        }
        return responses;
    }
    public List<KpiResponse> getKpiByLevel(long levelId){
        List<Kpi> kpis = kpiRepository.findByLevelLevelid(levelId);
        List<KpiResponse> responses = new ArrayList<>();
        for(Kpi kpi : kpis){
            KpiResponse kpiResponse = new KpiResponse();
            kpiResponse.setLevelId(kpi.getLevel().getLevelid());
            kpiResponse.setLevelName(kpi.getLevel().getLevelname());
            kpiResponse.setBonus_percent(kpi.getBonusPercent());
            kpiResponse.setRevenue_from(kpi.getRevenueFrom());
            kpiResponse.setRevenue_to(kpi.getRevenueTo());
            kpiResponse.setPerformance_score(kpi.getPerformanceScore());
            responses.add(kpiResponse);
        }
        return responses;
    }
    public List<KpiResponse> updateKpi(UpdateKpiRequest request, long levelId){
        kpiRepository.deleteKpiByLevel(levelId);
        Level level = levelRepository.findLevelByLevelid(levelId);
        List<KpiResponse> responses = new ArrayList<>();
        if(level == null){
            throw new AppException(ErrorCode.LEVEL_NOT_FOUND);
        }
        for(KpiRequest kpiRequest : request.getBonus()){
            Kpi kpi = new Kpi();
            kpi.setLevel(level);
            kpi.setBonusPercent(kpiRequest.getBonus_percent());
            kpi.setRevenueTo(kpiRequest.getRevenue_to());
            kpi.setRevenueFrom(kpiRequest.getRevenue_from());
            kpi.setPerformanceScore(kpiRequest.getPerformance_score());
            kpiRepository.save(kpi);
            KpiResponse kpiResponse = new KpiResponse();
            kpiResponse.setLevelId(level.getLevelid());
            kpiResponse.setLevelName(level.getLevelname());
            kpiResponse.setBonus_percent(kpiRequest.getBonus_percent());
            kpiResponse.setRevenue_to(kpiRequest.getRevenue_to());
            kpiResponse.setRevenue_from(kpiRequest.getRevenue_from());
            kpiResponse.setPerformance_score(kpiRequest.getPerformance_score());
            responses.add(kpiResponse);
        }
        return responses;
    }
}
