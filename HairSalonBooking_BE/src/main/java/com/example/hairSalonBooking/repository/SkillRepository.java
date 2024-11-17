package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    Skill findSkillBySkillName(String name);
    Skill findSkillBySkillId(long id);
    @Query(value = "select s.* from skill s\n" +
            "inner join specific_skill ss\n" +
            "on s.skill_id = ss.skill_id\n" +
            "where ss.account_id = ?1",nativeQuery = true)
    Set<Skill> getSkillByAccountId(long id);
}
