package com.marblestore.marble_store_backend.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    private String subtitle;

    @Column(nullable = false)
    private String image;

    private String link;

    private Boolean active = true;
}
