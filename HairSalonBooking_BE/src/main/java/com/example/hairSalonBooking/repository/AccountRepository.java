package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Account;
import com.example.hairSalonBooking.entity.Shift;
import com.example.hairSalonBooking.entity.Slot;
import com.example.hairSalonBooking.enums.Role;
import jakarta.transaction.Transactional;

import org.springframework.cglib.core.Local;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;


public interface AccountRepository extends JpaRepository<Account, Long> {

    // Data JPA
    //ORM  : object realationship mapping

    Account findAccountByUsername(String username);
    Account findAccountByUsernameAndIsDeletedFalse(String username);
    Account findAccountByEmail(String email);
    Account findAccountByAccountid(Long accountid);
    Account findByPhone(String phone);

    List<Account> findByRoleAndIsDeletedFalseAndSalonBranchSalonId(Role role, long salonId);
    @Query("SELECT ac FROM Account ac WHERE ac.role = com.example.hairSalonBooking.enums.Role.STAFF")
    @Transactional
    List<Account> getAccountsByRoleSTAFF();
    @Query("SELECT ac FROM Account ac WHERE ac.role = com.example.hairSalonBooking.enums.Role.BRANCH_MANAGER")
    @Transactional
    List<Account> getAccountsByRoleManager();

    Account findByAccountidAndRole(long id, Role role);
    List<Account> findByRole(Role role);
    @Query(value = "\n" +
            "select ac.* from account ac\n" +
            "where ac.salon_id = ?1 and ac.role = 'STYLIST'",nativeQuery = true)
    List<Account> getStylistsBySalo(long id);

    @Query(value = "select ac.* from account ac\n" +
            "inner join specific_skill ss\n" +
            "on ac.accountid = ss.account_id\n" +
            "inner join stylist_schedule ssch\n" +
            "on ac.accountid = ssch.account_id\n" +
            "where ss.skill_id = ?1 and ac.salon_id = ?2 ",nativeQuery = true)
    Set<Account> getAccountBySkill(long skillId,long salonId);
    List<Account> findByRoleAndIsDeletedFalse(Role role);

    @Query(value = "select distinct a.* from account a\n" +
            "inner join stylist_schedule ss\n" +
            "on a.accountid = ss.account_id\n" +
            "inner join specific_stylist_schedule sssch\n" +
            "on ss.stylist_schedule_id = sssch.stylist_schedule_id\n" +
            "inner join specific_skill ssk\n" +
            "on a.accountid = ssk.account_id\n" +
            "where ss.working_day = ?1 and sssch.shift_id = ?2 and ssk.skill_id = ?3 and a.salon_id = ?4 ;",nativeQuery = true)
    Set<Account> getStylistForBooking(LocalDate date, long shiftId, long skillId, long salonId);

    @Query(value = "DELETE FROM specific_skill WHERE account_id = ?1",nativeQuery = true)
    @Transactional
    @Modifying
    void deleteSpecificSkills(long id);





    Page<Account> findAccountByRole(Role role, Pageable pageable);
    Page<Account> findAccountByRoleAndSalonBranchSalonId(Role role, Pageable pageable, long salonId);
    Account  findTopByRole(Role role);

    @Query("SELECT ac FROM Account ac WHERE ac.role = com.example.hairSalonBooking.enums.Role.STYLIST")
    @Transactional
    List<Account> getAccountsByRoleStylist();

    @Query("SELECT a FROM Account a WHERE a.salonBranch.salonId = :salonId AND a.role = :role")
    List<Account> getAccountsBySalonAndRole(@Param("salonId") Long salonId, @Param("role") Role role);
    @Query("SELECT a FROM Account a JOIN a.salonBranch sb WHERE sb.salonId = :branchId AND a.role = :role")
    List<Account> getStylistsBySalonId(@Param("branchId") Long branchId, @Param("role") Role role);
    @Query("SELECT a FROM Account a WHERE a.accountid = :stylistId AND a.salonBranch.salonId = :salonId AND a.role = :role")
    Optional<Account> findByIdAndSalonIdAndRole(@Param("stylistId") Long stylistId,
                                                @Param("salonId") Long salonId,
                                                @Param("role") Role role);

    @Query(value = "select count(*) from account a where a.salon_id = ?1 and a.role = ?2",nativeQuery = true)
    long totalEmployeeByRoleInSalon(long salonId, String role);

    @Query(value = "select count(*) from account a where a.role = ?1",nativeQuery = true)
    long totalEmployeeByRole(String role);

}

