package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.CompanyProfile;
import com.marblestore.marble_store_backend.reposetory.CompanyProfileRepository;

import jakarta.transaction.Transactional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/company")
@PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_SUB_ADMIN')")
public class AdminCompanyProfileController {

    private final CompanyProfileRepository repository;

    public AdminCompanyProfileController(
            CompanyProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<CompanyProfile> getProfile() {

        return ResponseEntity.ok(
                repository.findById(1L)
                        .orElseGet(CompanyProfile::new));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<CompanyProfile> updateProfile(
            @RequestBody CompanyProfile request) {

        CompanyProfile profile = repository.findById(1L).orElse(null);

        /*
         * If profile already exists:
         * update the managed entity.
         */
        if (profile != null) {

            profile.setCompanyName(request.getCompanyName());
            profile.setPhone(request.getPhone());
            profile.setAlternatePhone(request.getAlternatePhone());
            profile.setEmail(request.getEmail());
            profile.setAboutCompany(request.getAboutCompany());
            profile.setAddress(request.getAddress());
            profile.setWhatsapp(request.getWhatsapp());
            profile.setGoogleMapsEmbed(request.getGoogleMapsEmbed());
            profile.setFacebook(request.getFacebook());
            profile.setInstagram(request.getInstagram());
            profile.setYoutube(request.getYoutube());
            profile.setLinkedin(request.getLinkedin());
            profile.setBusinessHours(request.getBusinessHours());

            /*
             * profile is already managed by Hibernate
             * because it was loaded inside this transaction.
             *
             * No need to call save().
             */
            return ResponseEntity.ok(profile);
        }

        /*
         * Profile does not exist.
         *
         * Create a NEW entity.
         * DO NOT set id manually because it uses
         * GenerationType.IDENTITY.
         */
        CompanyProfile newProfile = new CompanyProfile();

        newProfile.setCompanyName(request.getCompanyName());
        newProfile.setPhone(request.getPhone());
        newProfile.setAlternatePhone(request.getAlternatePhone());
        newProfile.setEmail(request.getEmail());
        newProfile.setAboutCompany(request.getAboutCompany());
        newProfile.setAddress(request.getAddress());
        newProfile.setWhatsapp(request.getWhatsapp());
        newProfile.setGoogleMapsEmbed(request.getGoogleMapsEmbed());
        newProfile.setFacebook(request.getFacebook());
        newProfile.setInstagram(request.getInstagram());
        newProfile.setYoutube(request.getYoutube());
        newProfile.setLinkedin(request.getLinkedin());
        newProfile.setBusinessHours(request.getBusinessHours());

        CompanyProfile savedProfile = repository.save(newProfile);

        return ResponseEntity.ok(savedProfile);
    }
}