package com.example.hairSalonBooking.entity;

import com.example.hairSalonBooking.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
//@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Account implements UserDetails {
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getUsername() {
        return this.username; // Muon cho nguoi dung dang nhap bang cai gi thi this cai do
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long accountid;
    @Column(unique = true)
    @NotBlank(message = "Code can not be blank!")
    String username;
    @Size(min = 6, message = "Password must be at least 6 character!")
    String password;
    @Column(unique = true)
    @Email(message = "Invalid email")
    String email;
    String fullname;
    LocalDate dob;
    String gender;
    @Pattern(regexp = "(84|0[3|5|7|8|9])+(\\d{8})\\b")
    @Column(unique = true)
    String phone;
    String image;

    //    @JsonIgnore // ẩn delete status không cho người dùng nhập
    boolean isDeleted = false;
    @Enumerated(EnumType.STRING)
    Role role;
    @ManyToOne
    @JoinColumn(name = "salon_id")
    SalonBranch salonBranch;

    @ManyToOne
    @JoinColumn(name = "level_id")
    Level level;

    @OneToMany(mappedBy = "account")
    @JsonIgnore
    Set<Feedback> feedbacks;



    @ManyToMany
    @JoinTable(name = "specific_skill",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @JsonIgnore
    Set<Skill> skills;

    @OneToMany(mappedBy = "account")
    @JsonIgnore
    Set<StylistSchedule> stylistSchedules;

    @OneToMany(mappedBy = "account")
    @JsonIgnore
    Set<Booking> bookings;

    @OneToMany(mappedBy = "account")
    @JsonIgnore
    Set<SalaryRecord> salaryRecords;

    @OneToMany(mappedBy = "fromAccount")
    Set<Transactions> transactionsForm;
    @OneToMany(mappedBy = "toAccount")
    Set<Transactions> transactionsTo;

    int balance;
}