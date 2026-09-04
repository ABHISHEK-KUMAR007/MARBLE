package com.marblestore.marble_store_backend.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String phone;
    private String alternatePhone;
    private String email;
    @Column(length = 2000)
    private String aboutCompany;
    @Column(length = 1000)
    private String address;
    private String whatsapp;
    @Column(length = 1000)
    private String googleMapsEmbed;
    private String facebook;
    private String instagram;
    private String youtube;
    private String linkedin;
    private String businessHours;
}
