package com.example.hairSalonBooking.repository;

import com.example.hairSalonBooking.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LevelRepository extends JpaRepository<Level,Long> {
    Level findLevelByLevelname(String name);

    Level findLevelByLevelid(long id);

    @Query(value = "select l.* from level l \n" +
            "inner join account a\n" +
            "on l.levelid = a.level_id\n" +
            "where a.accountid = ?1",nativeQuery = true)
    Level getLevelByStylistId(long accountId);
}
