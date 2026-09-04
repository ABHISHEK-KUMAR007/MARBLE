package com.marblestore.marble_store_backend.reposetory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.marblestore.marble_store_backend.Model.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(String name);


    List<Product> findByFeaturedTrue();

    List<Product> findByPopularTrue();

    List<Product> findByIsNewTrue();

    List<Product> findByCategory(String category);

    @Query("SELECT p.category as name, COUNT(p) as value FROM Product p GROUP BY p.category ORDER BY value DESC")
    List<Object[]> countProductsByCategory();
}
