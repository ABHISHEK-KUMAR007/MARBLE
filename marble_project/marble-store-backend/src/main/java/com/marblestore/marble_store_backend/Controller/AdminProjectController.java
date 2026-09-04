package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Project;
import com.marblestore.marble_store_backend.Services.project.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectService service;

    public AdminProjectController(ProjectService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAll() { return ResponseEntity.ok(service.getAll()); }
    
    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
    
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Project> create(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "completionDate", required = false) String completionDate,
            @RequestParam(value = "active", required = false, defaultValue = "true") Boolean active,
            @RequestParam(value = "newImages", required = false) List<org.springframework.web.multipart.MultipartFile> newImages,
            @RequestParam(value = "newVideos", required = false) List<org.springframework.web.multipart.MultipartFile> newVideos) {
        
        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        project.setName(name);
        project.setCompletionDate(completionDate);
        project.setActive(active);
        
        return ResponseEntity.ok(service.createWithMedia(project, null, newImages, null, newVideos));
    }
    
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Project> update(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "completionDate", required = false) String completionDate,
            @RequestParam(value = "active", required = false, defaultValue = "true") Boolean active,
            @RequestParam(value = "existingImages", required = false) List<String> existingImages,
            @RequestParam(value = "existingVideos", required = false) List<String> existingVideos,
            @RequestParam(value = "newImages", required = false) List<org.springframework.web.multipart.MultipartFile> newImages,
            @RequestParam(value = "newVideos", required = false) List<org.springframework.web.multipart.MultipartFile> newVideos) {
        
        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        project.setName(name);
        project.setCompletionDate(completionDate);
        project.setActive(active);

        return ResponseEntity.ok(service.updateWithMedia(id, project, existingImages, newImages, existingVideos, newVideos));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
