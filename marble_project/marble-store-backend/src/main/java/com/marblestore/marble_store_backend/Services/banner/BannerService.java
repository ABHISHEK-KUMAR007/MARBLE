package com.marblestore.marble_store_backend.Services.banner;

import com.marblestore.marble_store_backend.Model.Banner;
import com.marblestore.marble_store_backend.reposetory.BannerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BannerService {
    private final BannerRepository repository;

    public BannerService(BannerRepository repository) {
        this.repository = repository;
    }

    public List<Banner> getAll() { return repository.findAll(); }
    public List<Banner> getActive() { return repository.findByActiveTrue(); }
    public Banner getById(Long id) { return repository.findById(id).orElse(null); }
    public Banner create(Banner banner) { return repository.save(banner); }
    public Banner update(Long id, Banner updated) {
        Banner existing = getById(id);
        if (existing != null) {
            existing.setTitle(updated.getTitle());
            existing.setSubtitle(updated.getSubtitle());
            existing.setImage(updated.getImage());
            existing.setLink(updated.getLink());
            existing.setActive(updated.getActive());
            return repository.save(existing);
        }
        return null;
    }
    public void delete(Long id) { repository.deleteById(id); }
}
