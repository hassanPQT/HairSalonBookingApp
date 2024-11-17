package com.example.hairSalonBooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Level {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long levelid;
    String levelname;
    double salary;
    @OneToMany(mappedBy = "level")
    @JsonIgnore
    Set<Account> accounts;
    @OneToMany(mappedBy = "level")
    @JsonIgnore
    Set<Kpi> kpis;
}