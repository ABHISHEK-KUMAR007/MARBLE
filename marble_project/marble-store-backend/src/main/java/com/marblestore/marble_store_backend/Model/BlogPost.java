package com.marblestore.marble_store_backend.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String excerpt;

    private String date;

    private String image;
}