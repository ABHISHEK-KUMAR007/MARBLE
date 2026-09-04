package com.marblestore.marble_store_backend.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String avatar;

    @Column(nullable = true)
    private String password;

    @Column(nullable = false)
    private String role = "SUB_ADMIN";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdminStatus status;

    private LocalDateTime lastLogin;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Admin() {
    }

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();

        if (role == null || role.isBlank()) {
            role = "SUB_ADMIN";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(
            String fullName) {

        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(
            String phone) {

        this.phone = phone;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(
            String avatar) {

        this.avatar = avatar;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password) {

        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(
            String role) {

        this.role = role;
    }

    public AdminStatus getStatus() {
        return status;
    }

    public void setStatus(
            AdminStatus status) {

        this.status = status;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(
            LocalDateTime lastLogin) {

        this.lastLogin = lastLogin;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}