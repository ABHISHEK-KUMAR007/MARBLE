package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Project;
import com.marblestore.marble_store_backend.Services.project.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class PublicProjectController {

    private final ProjectService service;

    public PublicProjectController(ProjectService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getActiveProjects() {
        return ResponseEntity.ok(service.getActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = service.getById(id);
        if (project == null || (project.getActive() != null && !project.getActive())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(project);
    }


}
