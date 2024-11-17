package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Collections;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface CollectionsRepository extends JpaRepository<Collections,Long> {

    @Query(value = "DELETE FROM collections WHERE service_id = ?1;",nativeQuery = true)
    @Modifying
    @Transactional
    void deleteCollectionsService(long serviceId);
    @Query(value = "select c.collection_image from collections c where c.service_id = ?1;",nativeQuery = true)
    Set<String> getCollectionsImage(long serviceId);
}
