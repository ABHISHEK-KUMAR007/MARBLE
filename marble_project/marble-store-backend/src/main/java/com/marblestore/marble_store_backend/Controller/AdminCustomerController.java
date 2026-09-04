package com.marblestore.marble_store_backend.Controller;

import com.marblestore.marble_store_backend.Model.Customer;
import com.marblestore.marble_store_backend.Services.customer.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;

@RestController
@RequestMapping("/api/admin/customers")
public class AdminCustomerController {

    private final CustomerService service;

    public AdminCustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping("/import")
    public ResponseEntity<String> importCustomers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }
                String[] data = line.split(",");
                if (data.length >= 2) {
                    Customer customer = new Customer();
                    customer.setName(data[0].trim());
                    customer.setEmail(data[1].trim());
                    if (data.length >= 3) customer.setPhone(data[2].trim());
                    if (data.length >= 4) customer.setCity(data[3].trim());
                    service.save(customer);
                }
            }
            return ResponseEntity.ok("Import successful");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to import customers: " + e.getMessage());
        }
    }
}
