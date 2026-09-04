package com.marblestore.marble_store_backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.marblestore.marble_store_backend.Model.Admin;
import com.marblestore.marble_store_backend.Services.impl.AdminServiceImpl;
import com.marblestore.marble_store_backend.dto.AdminRequest;
import com.marblestore.marble_store_backend.dto.AdminResponse;
import com.marblestore.marble_store_backend.reposetory.AdminRepository;

class AdminServiceImplTest {

    @Test
    void createAdminPreservesRequestedRole() {
        AdminRepository adminRepository = mock(AdminRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        when(adminRepository.existsByEmailIgnoreCase("root@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-password");
        when(adminRepository.save(any(Admin.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AdminServiceImpl service = new AdminServiceImpl(adminRepository, passwordEncoder);

        AdminRequest request = new AdminRequest();
        request.setFullName("Root Admin");
        request.setEmail("Root@Example.com");
        request.setPassword("secret123");
        request.setRole("ROOT_ADMIN");

        AdminResponse response = service.createAdmin(request);

        assertEquals("ROOT_ADMIN", response.getRole());
    }
}
