package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Testimonial;
import com.marblestore.marble_store_backend.Services.testimonial.TestimonialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
public class PublicTestimonialController {

    private final TestimonialService testimonialService;

    public PublicTestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    @GetMapping
    public ResponseEntity<List<Testimonial>> getAllTestimonials() {
        return ResponseEntity.ok(testimonialService.getAllTestimonials());
    }
}
