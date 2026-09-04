package com.marblestore.marble_store_backend.reposetory;

import com.marblestore.marble_store_backend.Model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findTop10ByOrderByCreatedAtDesc();
}
