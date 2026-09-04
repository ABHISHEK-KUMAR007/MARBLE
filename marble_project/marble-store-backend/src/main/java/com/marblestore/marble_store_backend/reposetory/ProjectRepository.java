package com.marblestore.marble_store_backend.reposetory;

import com.marblestore.marble_store_backend.Model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByActiveTrue();
}
