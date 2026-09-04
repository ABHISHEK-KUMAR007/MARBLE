package com.marblestore.marble_store_backend.dto;

public class LoginResponse {

    private String token;
    private String email;
    private String role;
    private Long id;
    private String fullName;
    private String avatar;

    public LoginResponse(
            String token,
            String email,
            String role,
            Long id,
            String fullName,
            String avatar) {

        this.token = token;
        this.email = email;
        this.role = role;
        this.id = id;
        this.fullName = fullName;
        this.avatar = avatar;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getAvatar() {
        return avatar;
    }
}