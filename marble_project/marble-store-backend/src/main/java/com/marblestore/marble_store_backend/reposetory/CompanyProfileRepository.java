package com.marblestore.marble_store_backend.reposetory;

import com.marblestore.marble_store_backend.Model.CompanyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {
}
