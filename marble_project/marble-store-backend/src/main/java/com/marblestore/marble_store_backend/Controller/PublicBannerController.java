package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Banner;
import com.marblestore.marble_store_backend.Services.banner.BannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
public class PublicBannerController {

    private final BannerService service;

    public PublicBannerController(BannerService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Banner>> getActiveBanners() {
        return ResponseEntity.ok(service.getActive());
    }
}
