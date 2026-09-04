package com.marblestore.marble_store_backend.Services.inquiry;

import com.marblestore.marble_store_backend.Model.Inquiry;
import com.marblestore.marble_store_backend.reposetory.InquiryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InquiryService {
    private final InquiryRepository repository;

    public InquiryService(InquiryRepository repository) {
        this.repository = repository;
    }

    public List<Inquiry> getAll() { return repository.findAll(); }
    public Inquiry getById(Long id) { return repository.findById(id).orElse(null); }
    public Inquiry create(Inquiry inquiry) { return repository.save(inquiry); }
    public Inquiry updateStatus(Long id, String status) {
        Inquiry existing = getById(id);
        if (existing != null) {
            existing.setStatus(status);
            return repository.save(existing);
        }
        return null;
    }
    public void delete(Long id) { repository.deleteById(id); }
}
