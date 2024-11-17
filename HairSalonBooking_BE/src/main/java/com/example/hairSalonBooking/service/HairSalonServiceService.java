package com.example.hairSalonBooking.service;

import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.entity.Collections;
import com.example.hairSalonBooking.entity.SalonService;
import com.example.hairSalonBooking.entity.Skill;
import com.example.hairSalonBooking.model.request.CreateServiceRequest;
import com.example.hairSalonBooking.model.request.BookingStylits;
import com.example.hairSalonBooking.model.request.SearchServiceNameRequest;
import com.example.hairSalonBooking.model.request.ServiceUpdateRequest;
import com.example.hairSalonBooking.model.response.SalonResponse;
import com.example.hairSalonBooking.model.response.ServicePageResponse;
import com.example.hairSalonBooking.model.response.ServiceResponse;
import com.example.hairSalonBooking.model.response.StylistForBooking;
import com.example.hairSalonBooking.repository.AccountRepository;
import com.example.hairSalonBooking.repository.CollectionsRepository;
import com.example.hairSalonBooking.repository.ServiceRepository;
import com.example.hairSalonBooking.repository.SkillRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HairSalonServiceService {
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    private ImagesService imagesService;
    @Autowired
    private SkillRepository skillRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private CollectionsRepository collectionsRepository;
    public ServiceResponse createService(CreateServiceRequest createServiceRequest) {

        //SalonService salonService = modelMapper.map(createServiceRequest, SalonService.class);
        SalonService salonService = new SalonService();
        salonService.setPrice(createServiceRequest.getPrice());
        salonService.setDuration(createServiceRequest.getDuration());
        salonService.setDescription(createServiceRequest.getDescription());
        salonService.setImage(createServiceRequest.getImage());
        salonService.setServiceName(createServiceRequest.getServiceName());
        Skill skill = skillRepository.findSkillBySkillId(createServiceRequest.getSkillId());
        salonService.setSkill(skill);
        SalonService newService =  serviceRepository.save(salonService);
        Set<Collections> collections = new HashSet<>();
        for(String collectionsImage : createServiceRequest.getCollectionsImage()){
            Collections collections1 = new Collections();
            collections1.setService(newService);
            collections1.setCollectionImage(collectionsImage);
            collections.add(collections1);
        }
        collectionsRepository.saveAll(collections);
        ServiceResponse response = new ServiceResponse();
        response.setId(salonService.getServiceId());
        response.setServiceName(salonService.getServiceName());
        response.setDescription(salonService.getDescription());
        response.setPrice(salonService.getPrice());
        response.setDuration(salonService.getDuration());
        response.setImage(salonService.getImage());
        response.setSkillName(salonService.getSkill().getSkillName());
        return response;

    }
    public List<ServiceResponse> getAllServicesActive(){
        List<SalonService> services = serviceRepository.findByIsDeleteFalse();
        List<ServiceResponse> responses = new ArrayList<>();
        for(SalonService service : services){
            ServiceResponse serviceResponse = new ServiceResponse();
            serviceResponse.setId(service.getServiceId());
            serviceResponse.setServiceName(service.getServiceName());
            serviceResponse.setPrice(service.getPrice());
            serviceResponse.setImage(service.getImage());
            serviceResponse.setDuration(service.getDuration());
            serviceResponse.setDescription(service.getDescription());
            responses.add(serviceResponse);
        }
        return responses;
    }
    public List<ServiceResponse> searchServiceByName(SearchServiceNameRequest serviceName) {
        List<SalonService> services = serviceRepository.findByServiceNameContainingAndIsDeleteFalse(serviceName.getName());
        List<ServiceResponse> responses = new ArrayList<>();
        for(SalonService service : services){
            ServiceResponse response = new ServiceResponse();
            response.setId(service.getServiceId());
            response.setServiceName(service.getServiceName());
            response.setDescription(service.getDescription());
            response.setPrice(service.getPrice());
            response.setImage(service.getImage());
            response.setDuration(service.getDuration());
            responses.add(response);
        }
        return responses;
    }
    public ServiceResponse searchServiceId(long serviceId) {
        Optional<SalonService> salonService = serviceRepository.findByServiceId(serviceId);
        Set<String> collectionsImage = collectionsRepository.getCollectionsImage(salonService.get().getServiceId());
        ServiceResponse response = new ServiceResponse();
        response.setServiceName(salonService.get().getServiceName());
        response.setDescription(salonService.get().getDescription());
        response.setId(salonService.get().getServiceId());
        response.setDuration(salonService.get().getDuration());
        response.setImage(salonService.get().getImage());
        response.setPrice(salonService.get().getPrice());
        response.setCollectionsImage(collectionsImage);
        response.setSkillName(salonService.get().getSkill().getSkillName());
        response.setDelete(salonService.get().isDelete());
        return response;
    }
    public String deleteService(long serviceId) {
        SalonService salonService = serviceRepository.getServiceById(serviceId);
        salonService.setDelete(true);
        serviceRepository.save(salonService);
        return "Delete successfully";
    }
    public String activeService(long serviceId) {
        SalonService salonService = serviceRepository.getServiceById(serviceId);
        salonService.setDelete(false);
        serviceRepository.save(salonService);
        return "Active successfully";
    }
    public ServiceResponse updateService(long ServiceId, ServiceUpdateRequest request){
        SalonService service = serviceRepository.findByServiceId(ServiceId)
                .orElseThrow(() -> new RuntimeException("Service with ID '" + ServiceId + "' not found"));
        collectionsRepository.deleteCollectionsService(service.getServiceId());
        for(String collectionImage : request.getCollectionsImage()){
            Collections collections = new Collections();
            collections.setCollectionImage(collectionImage);
            collections.setService(service);
            collectionsRepository.save(collections);
        }
        service.setServiceName(request.getServiceName());
        service.setPrice(request.getPrice());
        service.setDescription(request.getDescription());
        service.setDuration(request.getDuration());
        service.setImage(request.getImage());
        service.setDelete(request.isDelelte());

        return modelMapper.map(serviceRepository.save(service), ServiceResponse.class);
    }


    public ServicePageResponse getAllServicePage(int page, int size) {
        Page<SalonService> servicePage = serviceRepository.findAll(PageRequest.of(page, size));

        Page<ServiceResponse> servicePageResponse = servicePage.map(service ->
                ServiceResponse.builder()
                        .id(service.getServiceId())
                        .serviceName(service.getServiceName())
                        .price(service.getPrice())
                        .description(service.getDescription())
                        .duration(service.getDuration())
                        .image(service.getImage())
                        .skillName(service.getSkill().getSkillName())
                        .isDelete(service.isDelete())
                        .build()
        );
        ServicePageResponse servicePageResponseResult = new ServicePageResponse();
        servicePageResponseResult.setPageNumber(servicePageResponse.getNumber());
        servicePageResponseResult.setTotalPages(servicePageResponse.getTotalPages());
        servicePageResponseResult.setTotalElements(servicePageResponse.getTotalElements());
        servicePageResponseResult.setContent(servicePageResponse.getContent());

        return servicePageResponseResult;
    }
    public ServicePageResponse getAllActiveServicePage(int page, int size) {
        Page<SalonService> servicePage = serviceRepository.findByIsDeleteFalse(PageRequest.of(page, size));

        Page<ServiceResponse> servicePageResponse = servicePage.map(service ->
                ServiceResponse.builder()
                        .id(service.getServiceId())
                        .serviceName(service.getServiceName())
                        .price(service.getPrice())
                        .description(service.getDescription())
                        .duration(service.getDuration())
                        .image(service.getImage())
                        .skillName(service.getSkill().getSkillName())
                        .isDelete(service.isDelete())
                        .build()
        );
        ServicePageResponse servicePageResponseResult = new ServicePageResponse();
        servicePageResponseResult.setPageNumber(servicePageResponse.getNumber());
        servicePageResponseResult.setTotalPages(servicePageResponse.getTotalPages());
        servicePageResponseResult.setTotalElements(servicePageResponse.getTotalElements());
        servicePageResponseResult.setContent(servicePageResponse.getContent());

        return servicePageResponseResult;
    }

    public List<ServiceResponse> getAllServices() {
        // Lấy tất cả dịch vụ từ cơ sở dữ liệu
        List<SalonService> services = serviceRepository.findAll();

        // Chuyển đổi từng đối tượng SalonService thành ServiceResponse
        List<ServiceResponse> responses = services.stream().map(service -> {
            ServiceResponse serviceResponse = new ServiceResponse();
            serviceResponse.setId(service.getServiceId());
            serviceResponse.setServiceName(service.getServiceName());
            serviceResponse.setPrice(service.getPrice());
            serviceResponse.setImage(service.getImage());
            serviceResponse.setDuration(service.getDuration());
            serviceResponse.setDescription(service.getDescription());
            return serviceResponse;
        }).collect(Collectors.toList());

        return responses;
    }
    public List<ServiceResponse> getNewestService() {
        // Lấy tất cả dịch vụ từ cơ sở dữ liệu
        List<SalonService> services = serviceRepository.getTopNewestServices(6);

        List<ServiceResponse> responses = new ArrayList<>();
        for(SalonService service : services){
            ServiceResponse serviceResponse = new ServiceResponse();
            serviceResponse.setId(service.getServiceId());
            serviceResponse.setServiceName(service.getServiceName());
            serviceResponse.setDescription(service.getDescription());
            serviceResponse.setImage(service.getImage());
            serviceResponse.setPrice(service.getPrice());
            serviceResponse.setDuration(service.getDuration());
            serviceResponse.setSkillName(service.getSkill().getSkillName());
            responses.add(serviceResponse);
        }


        return responses;
    }

    public Long countAllServices(){
        return serviceRepository.countAllServices();
    }
}