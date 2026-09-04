package com.marblestore.marble_store_backend.dto;

import java.time.LocalDateTime;

import com.marblestore.marble_store_backend.Model.AdminStatus;

public class AdminResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String avatar;
    private String role;

    private AdminStatus status;

    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;

    public AdminResponse(
            Long id,
            String fullName,
            String email,
            String phone,
            String avatar,
            String role,
            AdminStatus status,
            LocalDateTime lastLogin,
            LocalDateTime createdAt) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.avatar = avatar;
        this.role = role;
        this.status = status;
        this.lastLogin = lastLogin;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAvatar() {
        return avatar;
    }

    public String getRole() {
        return role;
    }

    public AdminStatus getStatus() {
        return status;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}