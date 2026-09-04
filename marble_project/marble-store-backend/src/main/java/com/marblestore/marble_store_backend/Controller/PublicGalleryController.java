package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Gallery;
import com.marblestore.marble_store_backend.Services.gallery.GalleryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class PublicGalleryController {

    private final GalleryService service;

    public PublicGalleryController(GalleryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Gallery>> getActiveGalleryImages() {
        return ResponseEntity.ok(service.getActive());
    }
}
