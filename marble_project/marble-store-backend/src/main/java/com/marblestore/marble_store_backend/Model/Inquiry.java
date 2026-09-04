package com.marblestore.marble_store_backend.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inquiries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String city;

    private String interestedProduct;

    @Column(nullable = false, length = 2000)
    private String message;

    private String status = "Pending"; // Pending, Contacted, In Progress, Completed, Rejected

    private LocalDateTime inquiryDate;

    @PrePersist
    protected void onCreate() {
        inquiryDate = LocalDateTime.now();
    }
}
