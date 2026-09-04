package com.marblestore.marble_store_backend.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.marblestore.marble_store_backend.Model.Admin;
import com.marblestore.marble_store_backend.Model.AdminStatus;
import com.marblestore.marble_store_backend.dto.ChangePasswordRequest;
import com.marblestore.marble_store_backend.reposetory.AdminRepository;
import com.marblestore.marble_store_backend.security.JwtService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController authController;

    @Test
    void changePasswordUpdatesStoredPassword() {
        Admin admin = new Admin();
        admin.setId(42L);
        admin.setFullName("Admin User");
        admin.setEmail("admin@example.com");
        admin.setStatus(AdminStatus.ACTIVE);

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("old-password");
        request.setNewPassword("new-password");
        request.setConfirmPassword("new-password");

        Authentication authentication = new UsernamePasswordAuthenticationToken("admin@example.com", "password");
        SecurityContextHolder.getContext().setAuthentication(authentication);

        when(adminRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(admin));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(passwordEncoder.encode("new-password")).thenReturn("hashed-password");

        ResponseEntity<String> response = authController.changePassword(request);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("hashed-password", admin.getPassword());
        verify(adminRepository).save(admin);
    }
}
