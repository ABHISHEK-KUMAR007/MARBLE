package com.marblestore.marble_store_backend.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String mediaType;

    @Column(nullable = false, length = 4000)
    private String url;

    private String caption;

    private Integer displayOrder;

    private Boolean active = true;
}
