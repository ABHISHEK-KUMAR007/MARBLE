package com.marblestore.marble_store_backend.Services.blog;

import com.marblestore.marble_store_backend.Model.BlogPost;
import com.marblestore.marble_store_backend.reposetory.BlogPostRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostRepository blogPostRepository;

    public BlogPostServiceImpl(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    @Override
    public BlogPost createBlogPost(BlogPost blogPost) {
        return blogPostRepository.save(blogPost);
    }

    @Override
    public List<BlogPost> getAllBlogPosts() {
        return blogPostRepository.findAll();
    }

    @Override
    public BlogPost getBlogPostById(Long id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
    }

    @Override
    public BlogPost updateBlogPost(Long id, BlogPost updatedBlogPost) {
        BlogPost existingPost = getBlogPostById(id);
        existingPost.setTitle(updatedBlogPost.getTitle());
        existingPost.setExcerpt(updatedBlogPost.getExcerpt());
        existingPost.setDate(updatedBlogPost.getDate());
        existingPost.setImage(updatedBlogPost.getImage());
        return blogPostRepository.save(existingPost);
    }

    @Override
    public void deleteBlogPost(Long id) {
        BlogPost post = getBlogPostById(id);
        blogPostRepository.delete(post);
    }
}
