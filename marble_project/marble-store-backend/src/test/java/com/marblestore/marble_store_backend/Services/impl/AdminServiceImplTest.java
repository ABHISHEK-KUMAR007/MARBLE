package com.marblestore.marble_store_backend.Services.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.marblestore.marble_store_backend.Model.Admin;
import com.marblestore.marble_store_backend.dto.AdminRequest;
import com.marblestore.marble_store_backend.dto.AdminResponse;
import com.marblestore.marble_store_backend.reposetory.AdminRepository;

class AdminServiceImplTest {

    @Test
    void createAdminShouldPersistRequestedRole() {
        AdminRepository repository = mock(AdminRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(repository.existsByEmailIgnoreCase(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded-password");
        when(repository.save(any(Admin.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AdminServiceImpl service = new AdminServiceImpl(repository, passwordEncoder);

        AdminRequest request = new AdminRequest();
        request.setFullName("Root Admin");
        request.setEmail("root@example.com");
        request.setPassword("password123");
        request.setRole("ROOT_ADMIN");

        AdminResponse response = service.createAdmin(request);

        assertEquals("ROOT_ADMIN", response.getRole());
    }
}
