package com.marblestore.marble_store_backend.Services.project;

import com.marblestore.marble_store_backend.Model.Project;
import com.marblestore.marble_store_backend.reposetory.ProjectRepository;
import com.marblestore.marble_store_backend.Services.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository repository;
    private final FileStorageService fileStorageService;

    public ProjectService(ProjectRepository repository, FileStorageService fileStorageService) {
        this.repository = repository;
        this.fileStorageService = fileStorageService;
    }

    public List<Project> getAll() {
        return repository.findAll();
    }

    public List<Project> getActive() {
        return repository.findByActiveTrue();
    }

    public Project getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Project create(Project project) {
        if (project.getName() == null || project.getName().isBlank()) {
            project.setName(project.getTitle());
        }
        if (project.getActive() == null) {
            project.setActive(true);
        }
        return repository.save(project);
    }

    public Project update(Long id, Project updated) {
        Project existing = getById(id);
        if (existing != null) {
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setName(updated.getName());
            existing.setImage(updated.getImage());
            existing.setCompletionDate(updated.getCompletionDate());
            existing.setActive(updated.getActive());
            if (updated.getImages() != null) {
                existing.setImages(updated.getImages());
            }
            if (updated.getVideos() != null) {
                existing.setVideos(updated.getVideos());
            }
            return repository.save(existing);
        }
        return null;
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
    
    public Project createWithMedia(Project project, List<String> existingImages, List<MultipartFile> newImages,
                                   List<String> existingVideos, List<MultipartFile> newVideos) {
        
        List<String> finalImages = processMedia(existingImages, newImages, 5);
        List<String> finalVideos = processMedia(existingVideos, newVideos, 2);
        
        if (project.getName() == null || project.getName().isBlank()) {
            project.setName(project.getTitle());
        }
        if (project.getActive() == null) {
            project.setActive(true);
        }
        
        // Use first image as primary image if it exists
        if (!finalImages.isEmpty()) {
            project.setImage(finalImages.get(0));
        }

        project.setImages(finalImages);
        project.setVideos(finalVideos);
        return repository.save(project);
    }

    public Project updateWithMedia(Long id, Project updated, List<String> existingImages, List<MultipartFile> newImages,
                                   List<String> existingVideos, List<MultipartFile> newVideos) {
        Project existing = getById(id);
        if (existing != null) {
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setName(updated.getName());
            existing.setCompletionDate(updated.getCompletionDate());
            existing.setActive(updated.getActive());

            List<String> finalImages = processMedia(existingImages, newImages, 5);
            List<String> finalVideos = processMedia(existingVideos, newVideos, 2);
            
            if (!finalImages.isEmpty()) {
                existing.setImage(finalImages.get(0));
            } else {
                existing.setImage(null);
            }

            existing.setImages(finalImages);
            existing.setVideos(finalVideos);
            
            return repository.save(existing);
        }
        return null;
    }
    
    private List<String> processMedia(List<String> existingUrls, List<MultipartFile> newFiles, int maxLimit) {
        List<String> finalUrls = new ArrayList<>();
        if (existingUrls != null) {
            finalUrls.addAll(existingUrls);
        }
        
        if (newFiles != null) {
            for (MultipartFile file : newFiles) {
                if (file != null && !file.isEmpty()) {
                    String url = fileStorageService.storeFile(file);
                    finalUrls.add(url);
                }
            }
        }
        
        if (finalUrls.size() > maxLimit) {
            throw new IllegalArgumentException("Maximum allowed limit is " + maxLimit + " files.");
        }
        
        return finalUrls;
    }
}
