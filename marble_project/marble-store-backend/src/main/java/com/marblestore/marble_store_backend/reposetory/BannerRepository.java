package com.marblestore.marble_store_backend.reposetory;

import com.marblestore.marble_store_backend.Model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByActiveTrue();
}
