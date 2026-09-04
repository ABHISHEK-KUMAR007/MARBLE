package com.marblestore.marble_store_backend.Controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import java.util.Locale;

import com.marblestore.marble_store_backend.Model.Admin;
import com.marblestore.marble_store_backend.dto.ChangePasswordRequest;
import com.marblestore.marble_store_backend.dto.LoginRequest;
import com.marblestore.marble_store_backend.dto.LoginResponse;
import com.marblestore.marble_store_backend.reposetory.AdminRepository;
import com.marblestore.marble_store_backend.security.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            AdminRepository adminRepository,
            JwtService jwtService,
            UserDetailsService userDetailsService,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Admin admin = adminRepository.findByEmailIgnoreCase(request.getEmail()).orElseThrow();
        UserDetails userDetails = userDetailsService.loadUserByUsername(admin.getEmail());
        String token = jwtService.generateToken(userDetails);

        String normalizedRole = normalizeRole(admin.getRole());
        LoginResponse response = new LoginResponse(token, admin.getEmail(), normalizedRole, admin.getId(),
                admin.getFullName(), admin.getAvatar());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Authentication required");
        }

        Admin admin = adminRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authentication.getName(), request.getCurrentPassword()));

        admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
        adminRepository.save(admin);

        return ResponseEntity.ok("Password changed successfully.");
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "SUB_ADMIN";
        }
        String normalized = role.trim().toUpperCase(Locale.ROOT);
        return "SUPER_ADMIN".equals(normalized) ? "SUPER_ADMIN" : "SUB_ADMIN";
    }
}