package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.CompanyProfile;
import com.marblestore.marble_store_backend.reposetory.CompanyProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PublicCompanyProfileController {

    private final CompanyProfileRepository repository;

    public PublicCompanyProfileController(CompanyProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/company")
    public ResponseEntity<CompanyProfile> getCompanyProfile() {
        CompanyProfile profile = repository.findById(1L).orElseGet(CompanyProfile::new);
        return ResponseEntity.ok(profile);
    }
}
