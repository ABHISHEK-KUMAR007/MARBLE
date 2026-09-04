package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Video;
import com.marblestore.marble_store_backend.Services.video.VideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/videos")
public class AdminVideoController {

    private final VideoService service;

    public AdminVideoController(VideoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Video>> getAll() { return ResponseEntity.ok(service.getAll()); }
    
    @GetMapping("/{id}")
    public ResponseEntity<Video> getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
    
    @PostMapping
    public ResponseEntity<Video> create(@RequestBody Video video) { return ResponseEntity.ok(service.create(video)); }
    
    @PutMapping("/{id}")
    public ResponseEntity<Video> update(@PathVariable Long id, @RequestBody Video video) { return ResponseEntity.ok(service.update(id, video)); }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
