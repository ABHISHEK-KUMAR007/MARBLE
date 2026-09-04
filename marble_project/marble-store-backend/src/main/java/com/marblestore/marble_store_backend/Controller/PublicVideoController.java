package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Video;
import com.marblestore.marble_store_backend.Services.video.VideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class PublicVideoController {

    private final VideoService service;

    public PublicVideoController(VideoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Video>> getActiveVideos() {
        return ResponseEntity.ok(service.getActive());
    }
}
