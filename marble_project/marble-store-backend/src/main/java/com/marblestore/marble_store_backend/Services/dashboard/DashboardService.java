package com.marblestore.marble_store_backend.Services.dashboard;

import com.marblestore.marble_store_backend.Model.ActivityLog;
import com.marblestore.marble_store_backend.Model.Inquiry;
import com.marblestore.marble_store_backend.reposetory.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private GalleryRepository galleryRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private InquiryRepository inquiryRepository;
    
    @Autowired
    private ActivityLogRepository activityLogRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalProducts", productRepository.count());
        stats.put("activeProducts", productRepository.count()); // No status field in Product
        stats.put("totalCategories", categoryRepository.count());
        stats.put("totalGalleryImages", galleryRepository.count());
        stats.put("totalVideos", videoRepository.count());
        
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        stats.put("todayInquiries", inquiryRepository.countByInquiryDateAfter(startOfDay));
        stats.put("pendingInquiries", inquiryRepository.countByStatus("Pending"));
        stats.put("completedInquiries", inquiryRepository.countByStatus("Completed"));
        stats.put("websiteVisitors", 0); // Analytics not implemented
        
        return stats;
    }

    public List<Inquiry> getRecentInquiries() {
        return inquiryRepository.findTop5ByOrderByInquiryDateDesc();
    }

    public List<Map<String, Object>> getTopCategories() {
        List<Object[]> results = productRepository.countProductsByCategory();
        List<Map<String, Object>> topCategories = new ArrayList<>();
        
        int limit = Math.min(results.size(), 4);
        for (int i = 0; i < limit; i++) {
            Object[] row = results.get(i);
            String category = (String) row[0];
            Long count = (Long) row[1];
            if (category == null || category.trim().isEmpty()) {
                category = "Uncategorized";
            }
            Map<String, Object> catMap = new HashMap<>();
            catMap.put("title", category);
            catMap.put("count", count);
            catMap.put("trend", "+0%"); // No historical data to calculate trend
            topCategories.add(catMap);
        }
        return topCategories;
    }

    public List<Map<String, Object>> getInquirySummary() {
        List<Object[]> results = inquiryRepository.countInquiriesByStatus();
        List<Map<String, Object>> summary = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0] != null ? row[0] : "Unknown");
            map.put("value", row[1]);
            summary.add(map);
        }
        return summary;
    }

    public List<Map<String, Object>> getCategoryPerformance() {
        List<Object[]> results = productRepository.countProductsByCategory();
        List<Map<String, Object>> perf = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0] != null ? row[0] : "Uncategorized");
            map.put("value", row[1]);
            perf.add(map);
        }
        return perf;
    }

    // public List<Map<String, Object>> getVisitorsTrend() {
    //     // Mocked as empty since we don't have analytics data
    //     return new ArrayList<>();
    // }

    // public List<Map<String, Object>> getProductViewsTrend() {
    //     // Mocked as empty since we don't have analytics data
    //     return new ArrayList<>();
    // }
    
    public List<ActivityLog> getRecentActivityLogs() {
        return activityLogRepository.findTop10ByOrderByCreatedAtDesc();
    }
    

    public void logActivity(String adminUser, String action, String module) {
        ActivityLog log = new ActivityLog();
        log.setAdminUser(adminUser);
        log.setAction(action);
        log.setModule(module);
        activityLogRepository.save(log);
    }
}
