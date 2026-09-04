package com.marblestore.marble_store_backend.config;

import com.marblestore.marble_store_backend.Model.Admin;
import com.marblestore.marble_store_backend.Model.AdminStatus;
import com.marblestore.marble_store_backend.reposetory.AdminRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdminUser(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String email =
                    "admin@aureostone.com";

            java.util.Optional<Admin> existingAdminOpt = adminRepository.findByEmailIgnoreCase(email);

            if (existingAdminOpt.isEmpty()) {

                Admin admin =
                        new Admin();

                admin.setFullName(
                        "Super Administrator"
                );

                admin.setEmail(email);

                admin.setPassword(
                        passwordEncoder.encode(
                                "Admin@123"
                        )
                );

                admin.setRole("SUPER_ADMIN");

                admin.setStatus(
                        AdminStatus.ACTIVE
                );

                adminRepository.save(admin);
            } else {
                Admin existingAdmin = existingAdminOpt.get();
                if (!"SUPER_ADMIN".equals(existingAdmin.getRole())) {
                    existingAdmin.setRole("SUPER_ADMIN");
                    adminRepository.save(existingAdmin);
                }
            }
        };
    }
}