package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Inquiry;
import com.marblestore.marble_store_backend.Services.inquiry.InquiryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inquiries")
public class AdminInquiryController {

    private final InquiryService service;

    public AdminInquiryController(InquiryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Inquiry>> getAll() { return ResponseEntity.ok(service.getAll()); }
    
    @GetMapping("/{id}")
    public ResponseEntity<Inquiry> getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Inquiry> updateStatus(@PathVariable Long id, @RequestParam String status) { 
        return ResponseEntity.ok(service.updateStatus(id, status)); 
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
