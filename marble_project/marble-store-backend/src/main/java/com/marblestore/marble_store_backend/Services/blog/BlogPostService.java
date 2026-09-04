package com.marblestore.marble_store_backend.Services.blog;

import com.marblestore.marble_store_backend.Model.BlogPost;
import java.util.List;

public interface BlogPostService {
    BlogPost createBlogPost(BlogPost blogPost);
    List<BlogPost> getAllBlogPosts();
    BlogPost getBlogPostById(Long id);
    BlogPost updateBlogPost(Long id, BlogPost blogPost);
    void deleteBlogPost(Long id);
}
