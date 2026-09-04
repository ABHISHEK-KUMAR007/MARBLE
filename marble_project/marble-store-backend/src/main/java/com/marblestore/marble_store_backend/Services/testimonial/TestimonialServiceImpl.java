package com.marblestore.marble_store_backend.Services.testimonial;

import com.marblestore.marble_store_backend.Model.Testimonial;
import com.marblestore.marble_store_backend.reposetory.TestimonialRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TestimonialServiceImpl implements TestimonialService {

    private final TestimonialRepository testimonialRepository;

    public TestimonialServiceImpl(TestimonialRepository testimonialRepository) {
        this.testimonialRepository = testimonialRepository;
    }

    @Override
    public Testimonial createTestimonial(Testimonial testimonial) {
        return testimonialRepository.save(testimonial);
    }

    @Override
    public List<Testimonial> getAllTestimonials() {
        return testimonialRepository.findAll();
    }

    @Override
    public Testimonial getTestimonialById(Long id) {
        return testimonialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Testimonial not found with id: " + id));
    }

    @Override
    public Testimonial updateTestimonial(Long id, Testimonial updatedTestimonial) {
        Testimonial existingTestimonial = getTestimonialById(id);
        existingTestimonial.setName(updatedTestimonial.getName());
        existingTestimonial.setRole(updatedTestimonial.getRole());
        existingTestimonial.setQuote(updatedTestimonial.getQuote());
        existingTestimonial.setRating(updatedTestimonial.getRating());
        return testimonialRepository.save(existingTestimonial);
    }

    @Override
    public void deleteTestimonial(Long id) {
        Testimonial testimonial = getTestimonialById(id);
        testimonialRepository.delete(testimonial);
    }
}
