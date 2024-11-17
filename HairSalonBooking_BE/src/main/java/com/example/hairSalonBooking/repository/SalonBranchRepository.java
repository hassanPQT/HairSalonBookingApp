package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.SalonBranch;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SalonBranchRepository extends JpaRepository<SalonBranch,Long> {
    SalonBranch findSalonBranchByHotline(String hotline);
    List<SalonBranch> findSalonBranchsByIsDeleteFalse();
    SalonBranch findSalonBranchBySalonIdAndIsDeleteFalse(long id);
    SalonBranch findSalonBranchBySalonId(long id);
    @Query("select sb from SalonBranch sb where sb.address like %?1%")
    @Transactional
    List<SalonBranch> findSalonBranchByAddress(String address);
    @Query("select sb from SalonBranch sb where sb.address = ?1")
    @Transactional
    SalonBranch findSalonBranchByAddressIsDeleteFalse(String address);

}
