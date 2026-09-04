package com.marblestore.marble_store_backend.Services.category;

import com.marblestore.marble_store_backend.Model.Category;
import com.marblestore.marble_store_backend.reposetory.CategoryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    // Constructor Dependency Injection
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // CREATE CATEGORY
    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // GET ALL CATEGORIES
    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // GET CATEGORY BY ID
    @Override
    public Category getCategoryById(Long id) {

        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found with id: " + id
                        )
                );
    }

    // SEARCH CATEGORY BY NAME
    @Override
    public List<Category> searchCategoriesByName(String name) {

        if (name == null || name.trim().isEmpty()) {
            return categoryRepository.findAll();
        }

        return categoryRepository
                .findByNameContainingIgnoreCase(name);
    }

    // UPDATE CATEGORY
    @Override
    public Category updateCategory(
            Long id,
            Category updatedCategory
    ) {

        Category existingCategory = getCategoryById(id);

        existingCategory.setName(
                updatedCategory.getName()
        );

        existingCategory.setDescription(
                updatedCategory.getDescription()
        );

        existingCategory.setImage(
                updatedCategory.getImage()
        );

        return categoryRepository.save(existingCategory);
    }

    // DELETE CATEGORY
    @Override
    public void deleteCategory(Long id) {

        Category category = getCategoryById(id);

        categoryRepository.delete(category);
    }
}