package com.marblestore.marble_store_backend.reposetory;

import com.marblestore.marble_store_backend.Model.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    
    long countByStatus(String status);
    
    long countByInquiryDateAfter(LocalDateTime date);
    
    List<Inquiry> findTop5ByOrderByInquiryDateDesc();
    
    @Query("SELECT i.status as name, COUNT(i) as value FROM Inquiry i GROUP BY i.status")
    List<Object[]> countInquiriesByStatus();
}
