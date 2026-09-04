package com.marblestore.marble_store_backend.Services;

import java.util.List;

import com.marblestore.marble_store_backend.Model.AdminStatus;
import com.marblestore.marble_store_backend.dto.AdminRequest;
import com.marblestore.marble_store_backend.dto.AdminResponse;

public interface AdminService {

    List<AdminResponse> getAllAdmins();

    AdminResponse getAdminById(Long id);

    AdminResponse createAdmin(AdminRequest request);

    AdminResponse updateAdmin(
            Long id,
            AdminRequest request
    );

    void deleteAdmin(Long id);

    AdminResponse changeStatus(
            Long id,
            AdminStatus status
    );
}