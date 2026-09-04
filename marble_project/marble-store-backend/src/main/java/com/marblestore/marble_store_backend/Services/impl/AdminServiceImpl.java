package com.marblestore.marble_store_backend.Services.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.marblestore.marble_store_backend.Model.Admin;
import com.marblestore.marble_store_backend.Model.AdminStatus;
import com.marblestore.marble_store_backend.Services.AdminService;
import com.marblestore.marble_store_backend.dto.AdminRequest;
import com.marblestore.marble_store_backend.dto.AdminResponse;
import com.marblestore.marble_store_backend.reposetory.AdminRepository;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<AdminResponse> getAllAdmins() {
        return adminRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public AdminResponse getAdminById(Long id) {
        Admin admin = findAdmin(id);
        return mapToResponse(admin);
    }

    @Override
    public AdminResponse createAdmin(AdminRequest request) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();

        if (email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (request.getFullName() == null || request.getFullName().trim().isBlank()) {
            throw new RuntimeException("Full name is required");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }

        if (request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        if (adminRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Email already exists");
        }

        Admin admin = new Admin();
        admin.setFullName(request.getFullName().trim());
        admin.setEmail(email);
        admin.setPhone(request.getPhone());
        admin.setRole(normalizeRole(request.getRole()));
        admin.setStatus(AdminStatus.ACTIVE);
        admin.setPassword(passwordEncoder.encode(request.getPassword()));

        Admin savedAdmin = adminRepository.save(admin);
        return mapToResponse(savedAdmin);
    }

    @Override
    public AdminResponse updateAdmin(Long id, AdminRequest request) {
        Admin admin = findAdmin(id);

        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        if (!email.isBlank()) {
            if (!admin.getEmail().equalsIgnoreCase(email) && adminRepository.existsByEmailIgnoreCase(email)) {
                throw new RuntimeException("Email already exists");
            }
            admin.setEmail(email);
        }

        if (request.getFullName() != null) {
            admin.setFullName(request.getFullName().trim());
        }

        if (request.getPhone() != null) {
            admin.setPhone(request.getPhone());
        }

        if (request.getAvatar() != null) {
            admin.setAvatar(request.getAvatar());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            admin.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            admin.setRole(normalizeRole(request.getRole()));
        }

        Admin updatedAdmin = adminRepository.save(admin);
        return mapToResponse(updatedAdmin);
    }

    @Override
    public void deleteAdmin(Long id) {
        Admin admin = findAdmin(id);

        String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        if (admin.getEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new RuntimeException("You cannot delete your own account.");
        }

        adminRepository.delete(admin);
    }

    @Override
    public AdminResponse changeStatus(Long id, AdminStatus status) {
        Admin admin = findAdmin(id);

        String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        if (admin.getEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new RuntimeException("You cannot change the status of your own account.");
        }

        if (status == null) {
            throw new RuntimeException("Admin status cannot be null");
        }

        admin.setStatus(status);

        Admin updatedAdmin = adminRepository.save(admin);
        return mapToResponse(updatedAdmin);
    }

    private Admin findAdmin(Long id) {
        return adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
    }

    private AdminResponse mapToResponse(Admin admin) {
        return new AdminResponse(
                admin.getId(),
                admin.getFullName(),
                admin.getEmail(),
                admin.getPhone(),
                admin.getAvatar(),
                normalizeRole(admin.getRole()),
                admin.getStatus(),
                admin.getLastLogin(),
                admin.getCreatedAt());
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "SUB_ADMIN";
        }

        String normalized = role.trim().toUpperCase();
        return "SUPER_ADMIN".equals(normalized) ? "SUPER_ADMIN" : "SUB_ADMIN";
    }
}