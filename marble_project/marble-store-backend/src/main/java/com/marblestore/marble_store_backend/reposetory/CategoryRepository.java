package com.marblestore.marble_store_backend.reposetory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marblestore.marble_store_backend.Model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByNameContainingIgnoreCase(String name);


}