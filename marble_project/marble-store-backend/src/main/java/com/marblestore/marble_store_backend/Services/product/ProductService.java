package com.marblestore.marble_store_backend.Services.product;

import com.marblestore.marble_store_backend.Model.Product;

import java.util.List;

public interface ProductService {

    // Add a new product
    Product createProduct(Product product);

    // Get all products
    List<Product> getAllProducts();

    // Get a single product by ID
    Product getProductById(Long id);

    List<Product> searchProductsByName(String name);

    // Update complete product details
    Product updateProduct(Long id, Product product);

    // Update only the product price
    Product updateProductPrice(Long id, Long newPrice);

    // Delete a product
    void deleteProduct(Long id);

    List<Product> getFeaturedProducts();

    List<Product> getPopularProducts();

    List<Product> getLatestProducts();

    List<Product> getProductsByCategory(String category);
}