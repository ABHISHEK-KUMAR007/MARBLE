package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Services.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileDownloadUri = fileStorageService.storeFile(file);

            Map<String, String> response = new HashMap<>();
            response.put("url", fileDownloadUri);
            
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Could not store file " + file.getOriginalFilename() + ". Please try again!");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
