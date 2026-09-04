package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Banner;
import com.marblestore.marble_store_backend.Services.banner.BannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
public class AdminBannerController {

    private final BannerService service;

    public AdminBannerController(BannerService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Banner>> getAll() { return ResponseEntity.ok(service.getAll()); }
    
    @GetMapping("/{id}")
    public ResponseEntity<Banner> getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
    
    @PostMapping
    public ResponseEntity<Banner> create(@RequestBody Banner banner) { return ResponseEntity.ok(service.create(banner)); }
    
    @PutMapping("/{id}")
    public ResponseEntity<Banner> update(@PathVariable Long id, @RequestBody Banner banner) { return ResponseEntity.ok(service.update(id, banner)); }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
