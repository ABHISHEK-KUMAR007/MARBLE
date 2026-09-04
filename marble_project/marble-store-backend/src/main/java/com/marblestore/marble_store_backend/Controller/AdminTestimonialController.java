package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Testimonial;
import com.marblestore.marble_store_backend.Services.testimonial.TestimonialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/testimonials")
public class AdminTestimonialController {

    private final TestimonialService testimonialService;

    public AdminTestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    @GetMapping
    public ResponseEntity<List<Testimonial>> getAllTestimonials() {
        return ResponseEntity.ok(testimonialService.getAllTestimonials());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Testimonial> getTestimonialById(@PathVariable Long id) {
        return ResponseEntity.ok(testimonialService.getTestimonialById(id));
    }

    @PostMapping
    public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(testimonialService.createTestimonial(testimonial));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Testimonial> updateTestimonial(@PathVariable Long id, @RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(testimonialService.updateTestimonial(id, testimonial));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Long id) {
        testimonialService.deleteTestimonial(id);
        return ResponseEntity.noContent().build();
    }
}
