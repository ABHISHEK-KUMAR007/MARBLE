package com.marblestore.marble_store_backend.Model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String name;

    private String image;

    private String completionDate;

    private Boolean active = true;

    @JsonIgnore
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMedia> media = new ArrayList<>();

    public String getName() {
        return (name != null && !name.isBlank()) ? name : title;
    }

    public List<String> getImages() {
        if (media == null) {
            return new ArrayList<>();
        }

        return media.stream()
                .filter(item -> item != null && "image".equalsIgnoreCase(item.getMediaType())
                        && Boolean.TRUE.equals(item.getActive()))
                .sorted((left, right) -> Integer.compare(
                        left.getDisplayOrder() != null ? left.getDisplayOrder() : 0,
                        right.getDisplayOrder() != null ? right.getDisplayOrder() : 0))
                .map(ProjectMedia::getUrl)
                .collect(Collectors.toList());
    }

    public void setImages(List<String> images) {
        syncMedia("image", images);
    }

    public List<String> getVideos() {
        if (media == null) {
            return new ArrayList<>();
        }

        return media.stream()
                .filter(item -> item != null && "video".equalsIgnoreCase(item.getMediaType())
                        && Boolean.TRUE.equals(item.getActive()))
                .sorted((left, right) -> Integer.compare(
                        left.getDisplayOrder() != null ? left.getDisplayOrder() : 0,
                        right.getDisplayOrder() != null ? right.getDisplayOrder() : 0))
                .map(ProjectMedia::getUrl)
                .collect(Collectors.toList());
    }

    public void setVideos(List<String> videos) {
        syncMedia("video", videos);
    }

    private void syncMedia(String mediaType, List<String> urls) {
        if (media == null) {
            media = new ArrayList<>();
        }

        media.removeIf(item -> item != null && mediaType.equalsIgnoreCase(item.getMediaType()));

        if (urls == null || urls.isEmpty()) {
            return;
        }

        for (int index = 0; index < urls.size(); index++) {
            String url = urls.get(index);
            if (url == null || url.isBlank()) {
                continue;
            }

            ProjectMedia projectMedia = new ProjectMedia();
            projectMedia.setProject(this);
            projectMedia.setMediaType(mediaType);
            projectMedia.setUrl(url);
            projectMedia.setDisplayOrder(index + 1);
            projectMedia.setActive(true);
            media.add(projectMedia);
        }
    }
}
