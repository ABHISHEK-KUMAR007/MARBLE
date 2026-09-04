package com.marblestore.marble_store_backend.Services.product;

import com.marblestore.marble_store_backend.Model.Product;
import com.marblestore.marble_store_backend.reposetory.ProductRepository;



import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    // Constructor Dependency Injection
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // CREATE PRODUCT
    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // GET ALL PRODUCTS
    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // GET PRODUCT BY ID
    @Override
    public Product getProductById(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + id
                        )
                );
    }

    // UPDATE COMPLETE PRODUCT
    @Override
    public Product updateProduct(Long id, Product updatedProduct) {

        Product existingProduct = getProductById(id);

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setOrigin(updatedProduct.getOrigin());
        existingProduct.setFinish(updatedProduct.getFinish());
        existingProduct.setThickness(updatedProduct.getThickness());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setPriceUnit(updatedProduct.getPriceUnit());
        existingProduct.setImage(updatedProduct.getImage());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setFeatured(updatedProduct.getFeatured());
        existingProduct.setIsNew(updatedProduct.getIsNew());
        existingProduct.setPopular(updatedProduct.getPopular());

        return productRepository.save(existingProduct);
    }

    // UPDATE ONLY PRODUCT PRICE
    @Override
    public Product updateProductPrice(Long id, Long newPrice) {

        if (newPrice == null || newPrice < 0) {
            throw new IllegalArgumentException(
                    "Product price cannot be null or negative"
            );
        }

        Product product = getProductById(id);

        product.changePrice(newPrice);

        return productRepository.save(product);
    }

    // DELETE PRODUCT
    @Override
    public void deleteProduct(Long id) {

        Product product = getProductById(id);

        productRepository.delete(product);
    }


    @Override
    public List<Product> searchProductsByName(String name) {

        if (name == null || name.trim().isEmpty()) {
            return productRepository.findAll();
        }

        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue();
    }

    @Override
    public List<Product> getPopularProducts() {
        return productRepository.findByPopularTrue();
    }

    @Override
    public List<Product> getLatestProducts() {
        return productRepository.findByIsNewTrue();
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
}