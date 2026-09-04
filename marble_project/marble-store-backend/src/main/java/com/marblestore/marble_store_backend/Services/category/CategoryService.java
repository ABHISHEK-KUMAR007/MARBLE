package com.marblestore.marble_store_backend.Services.category;

import com.marblestore.marble_store_backend.Model.Category;

import java.util.List;

public interface CategoryService {

    // Add new category
    Category createCategory(Category category);

    // Get all categories
    List<Category> getAllCategories();

    // Get category by ID
    Category getCategoryById(Long id);

    // Search category by name
    List<Category> searchCategoriesByName(String name);

    // Update category
    Category updateCategory(Long id, Category category);

    void deleteCategory(Long id);
}