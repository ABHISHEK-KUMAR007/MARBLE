package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.ActivityLog;
import com.marblestore.marble_store_backend.Model.Inquiry;
import com.marblestore.marble_store_backend.Services.dashboard.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*") // Adjust origin as needed based on project config
public class AdminDashboardController {

    @Autowired
    private DashboardService dashboardService;


    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/recent-inquiries")
    public ResponseEntity<List<Inquiry>> getRecentInquiries() {
        return ResponseEntity.ok(dashboardService.getRecentInquiries());
    }

    @GetMapping("/top-categories")
    public ResponseEntity<List<Map<String, Object>>> getTopCategories() {
        return ResponseEntity.ok(dashboardService.getTopCategories());
    }

    @GetMapping("/inquiry-summary")
    public ResponseEntity<List<Map<String, Object>>> getInquirySummary() {
        return ResponseEntity.ok(dashboardService.getInquirySummary());
    }

    // @GetMapping("/charts")
    // public ResponseEntity<Map<String, Object>> getChartsData() {
    //     Map<String, Object> data = new HashMap<>();
    //     data.put("categoryPerformance", dashboardService.getCategoryPerformance());
    //     data.put("visitorsTrend", dashboardService.getVisitorsTrend());
    //     data.put("productViewsTrend", dashboardService.getProductViewsTrend());
    //     return ResponseEntity.ok(data);
    // }

    @GetMapping("/activity-logs")
    public ResponseEntity<List<ActivityLog>> getActivityLogs() {
        return ResponseEntity.ok(dashboardService.getRecentActivityLogs());
    }
}
