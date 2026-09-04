package com.marblestore.marble_store_backend.reposetory;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marblestore.marble_store_backend.Model.Admin;

public interface AdminRepository
        extends JpaRepository<Admin, Long> {

    Optional<Admin>
    findByEmailIgnoreCase(String email);

    boolean
    existsByEmailIgnoreCase(String email);

    boolean
    existsByEmail(String email);

}