package com.marblestore.marble_store_backend.Services;

import java.util.List;
import java.util.Locale;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import com.marblestore.marble_store_backend.Model.Admin;
import com.marblestore.marble_store_backend.Model.AdminStatus;
import com.marblestore.marble_store_backend.reposetory.AdminRepository;

@Service
public class CustomUserDetailsService
                implements UserDetailsService {

        private final AdminRepository adminRepository;

        public CustomUserDetailsService(
                        AdminRepository adminRepository) {

                this.adminRepository = adminRepository;
        }

        @Override
        public UserDetails loadUserByUsername(
                        String email)
                        throws UsernameNotFoundException {

                Admin admin = adminRepository
                                .findByEmailIgnoreCase(
                                                email)
                                .orElseThrow(
                                                () -> new UsernameNotFoundException(
                                                                "Invalid email or password"));

                if (admin.getStatus() != AdminStatus.ACTIVE) {

                        throw new UsernameNotFoundException(
                                        "Admin account is not active");
                }

                if (admin.getPassword() == null) {

                        throw new UsernameNotFoundException(
                                        "Admin password has not been created");
                }

                String role = normalizeRole(admin.getRole());

                return User.builder()

                                .username(
                                                admin.getEmail())

                                .password(
                                                admin.getPassword())

                                .authorities(
                                                List.of(
                                                                new SimpleGrantedAuthority("ROLE_" + role),
                                                                new SimpleGrantedAuthority(role)))

                                .disabled(false)
                                .accountLocked(false)
                                .accountExpired(false)
                                .credentialsExpired(false)

                                .build();
        }

        private String normalizeRole(String role) {
                if (role == null || role.isBlank()) {
                        return "SUB_ADMIN";
                }

                String normalized = role.trim().toUpperCase(Locale.ROOT);
                return "SUPER_ADMIN".equals(normalized) ? "SUPER_ADMIN" : "SUB_ADMIN";
        }
}