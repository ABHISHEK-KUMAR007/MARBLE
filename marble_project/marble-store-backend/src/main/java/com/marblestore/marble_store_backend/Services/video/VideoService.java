package com.marblestore.marble_store_backend.Services.video;

import com.marblestore.marble_store_backend.Model.Video;
import com.marblestore.marble_store_backend.reposetory.VideoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VideoService {
    private final VideoRepository repository;

    public VideoService(VideoRepository repository) {
        this.repository = repository;
    }

    public List<Video> getAll() { return repository.findAll(); }
    public List<Video> getActive() { return repository.findByActiveTrue(); }
    public Video getById(Long id) { return repository.findById(id).orElse(null); }
    public Video create(Video video) { return repository.save(video); }
    public Video update(Long id, Video updated) {
        Video existing = getById(id);
        if (existing != null) {
            existing.setTitle(updated.getTitle());
            existing.setYoutubeUrl(updated.getYoutubeUrl());
            existing.setThumbnail(updated.getThumbnail());
            existing.setActive(updated.getActive());
            return repository.save(existing);
        }
        return null;
    }
    public void delete(Long id) { repository.deleteById(id); }
}
