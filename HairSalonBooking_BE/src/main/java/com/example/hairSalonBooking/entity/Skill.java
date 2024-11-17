package com.example.hairSalonBooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long skillId;
    String skillName;

    @OneToMany(mappedBy = "skill")
    @JsonIgnore
    List<SalonService> services;

    @ManyToMany(mappedBy = "skills")
    Set<Account> accounts;
}