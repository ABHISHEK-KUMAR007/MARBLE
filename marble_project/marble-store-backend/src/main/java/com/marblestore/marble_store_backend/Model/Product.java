package com.marblestore.marble_store_backend.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;

    private String category;

    private String origin;

    private String finish;

    private String thickness;

    @Column(nullable = false)
    private Long price;

    // Example: SQ_FT, SQ_METER, SLAB, PIECE
    private String priceUnit;

    private String image;

    @Column(length = 2000)
    private String description;

    private Boolean featured = false;

    private Boolean isNew = false;

    private Boolean popular = false;

    /**
     * Used to update the product price when the market price changes.
     */
    public void changePrice(Long newPrice) {
        this.price = newPrice;
    }
}