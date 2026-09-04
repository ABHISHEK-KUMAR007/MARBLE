package com.marblestore.marble_store_backend.Services.gallery;

import com.marblestore.marble_store_backend.Model.Gallery;
import com.marblestore.marble_store_backend.reposetory.GalleryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GalleryService {
    private final GalleryRepository repository;

    public GalleryService(GalleryRepository repository) {
        this.repository = repository;
    }

    public List<Gallery> getAll() { return repository.findAll(); }
    public List<Gallery> getActive() { return repository.findByActiveTrue(); }
    public Gallery getById(Long id) { return repository.findById(id).orElse(null); }
    public Gallery create(Gallery gallery) { return repository.save(gallery); }
    public Gallery update(Long id, Gallery updated) {
        Gallery existing = getById(id);
        if (existing != null) {
            existing.setTitle(updated.getTitle());
            existing.setImage(updated.getImage());
            existing.setCategory(updated.getCategory());
            existing.setActive(updated.getActive());
            return repository.save(existing);
        }
        return null;
    }
    public void delete(Long id) { repository.deleteById(id); }
}
