package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Gallery;
import com.marblestore.marble_store_backend.Services.gallery.GalleryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/gallery")
public class AdminGalleryController {

    private final GalleryService service;

    public AdminGalleryController(GalleryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Gallery>> getAll() { return ResponseEntity.ok(service.getAll()); }
    
    @GetMapping("/{id}")
    public ResponseEntity<Gallery> getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
    
    @PostMapping
    public ResponseEntity<Gallery> create(@RequestBody Gallery gallery) { return ResponseEntity.ok(service.create(gallery)); }
    
    @PutMapping("/{id}")
    public ResponseEntity<Gallery> update(@PathVariable Long id, @RequestBody Gallery gallery) { return ResponseEntity.ok(service.update(id, gallery)); }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
