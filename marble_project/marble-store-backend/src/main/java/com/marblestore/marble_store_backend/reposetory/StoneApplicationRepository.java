package com.marblestore.marble_store_backend.reposetory;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marblestore.marble_store_backend.Model.StoneApplication;

public interface StoneApplicationRepository
        extends JpaRepository<StoneApplication, Long> {
}