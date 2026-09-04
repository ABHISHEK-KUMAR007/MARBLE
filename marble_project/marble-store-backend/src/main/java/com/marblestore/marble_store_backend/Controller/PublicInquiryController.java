package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Inquiry;
import com.marblestore.marble_store_backend.Services.inquiry.InquiryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inquiries")
public class PublicInquiryController {

    private final InquiryService service;

    public PublicInquiryController(InquiryService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Inquiry> submitInquiry(@RequestBody Inquiry inquiry) {
        return ResponseEntity.ok(service.create(inquiry));
    }
}
