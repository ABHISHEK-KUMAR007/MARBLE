package com.marblestore.marble_store_backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.marblestore.marble_store_backend.Model.AdminStatus;
import com.marblestore.marble_store_backend.Services.AdminService;
import com.marblestore.marble_store_backend.dto.AdminRequest;
import com.marblestore.marble_store_backend.dto.AdminResponse;
import com.marblestore.marble_store_backend.dto.AdminStatusRequest;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
public class AdminController {

        private final AdminService adminService;

        public AdminController(
                        AdminService adminService) {

                this.adminService = adminService;
        }

        @GetMapping
        public ResponseEntity<List<AdminResponse>> getAllAdmins() {

                return ResponseEntity.ok(
                                adminService.getAllAdmins());
        }

        @GetMapping("/{id}")
        public ResponseEntity<AdminResponse> getAdminById(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                adminService.getAdminById(id));
        }

        @PostMapping
        public ResponseEntity<AdminResponse> createAdmin(
                        @RequestBody AdminRequest request) {

                return ResponseEntity.ok(
                                adminService.createAdmin(request));
        }

        @PutMapping("/{id}")
        public ResponseEntity<AdminResponse> updateAdmin(
                        @PathVariable Long id,
                        @RequestBody AdminRequest request) {

                return ResponseEntity.ok(
                                adminService.updateAdmin(
                                                id,
                                                request));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteAdmin(
                        @PathVariable Long id) {

                adminService.deleteAdmin(id);

                return ResponseEntity
                                .noContent()
                                .build();
        }

        @PatchMapping("/{id}/status")
        public ResponseEntity<AdminResponse> changeStatus(
                        @PathVariable Long id,
                        @RequestBody AdminStatusRequest request) {

                AdminStatus status;

                if ("Active".equalsIgnoreCase(
                                request.getStatus())) {

                        status = AdminStatus.ACTIVE;

                } else if ("Inactive".equalsIgnoreCase(
                                request.getStatus())) {

                        status = AdminStatus.INACTIVE;

                } else {

                        throw new RuntimeException(
                                        "Invalid status");
                }

                return ResponseEntity.ok(
                                adminService.changeStatus(
                                                id,
                                                status));
        }

}