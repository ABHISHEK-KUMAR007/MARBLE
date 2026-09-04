package com.marblestore.marble_store_backend.Services.testimonial;

import com.marblestore.marble_store_backend.Model.Testimonial;
import java.util.List;

public interface TestimonialService {
    Testimonial createTestimonial(Testimonial testimonial);
    List<Testimonial> getAllTestimonials();
    Testimonial getTestimonialById(Long id);
    Testimonial updateTestimonial(Long id, Testimonial testimonial);
    void deleteTestimonial(Long id);
}
