package com.marblestore.marble_store_backend.reposetory;

import com.marblestore.marble_store_backend.Model.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByActiveTrue();
}
