package com.marblestore.marble_store_backend.reposetory;

import com.marblestore.marble_store_backend.Model.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {
    List<Gallery> findByActiveTrue();
}
