# Search2Get catalog data

Search2Get V4 loads its storefront catalog from the public **DummyJSON Products API**.

## Why this source

The project needs structured ecommerce data rather than decorative stock photography. DummyJSON exposes product-oriented fields that the UI can use directly, including:

- product title and description
- category and brand
- product thumbnails and multiple product images
- price and discount percentage
- rating
- stock / availability status
- shipping information
- return policy

The active catalog requests these apparel / fashion categories:

```text
mens-shirts
mens-shoes
mens-watches
tops
womens-dresses
womens-shoes
womens-bags
womens-jewellery
womens-watches
sunglasses
```

Base API: `https://dummyjson.com`

Product documentation: `https://dummyjson.com/docs/products`

## Client-side normalization

`store.js` converts API records into Search2Get's internal product model. It:

1. groups API categories into **Women**, **Men**, and **Accessories** storefront segments;
2. converts source prices into an INR demo display using a fixed presentation multiplier;
3. derives an original-price display from the API discount percentage;
4. assigns suitable demo size options for apparel, footwear and one-size accessories;
5. keeps API ratings, stock, images, shipping and return information;
6. uses the same normalized product object everywhere: homepage merchandising, catalog, search, quick view, wishlist, cart and checkout.

> The INR values are presentation values for this portfolio storefront. Search2Get is not a merchant and does not sell or fulfill these products.

## Reliability behavior

The UI shows loading skeletons while catalog requests are running. If the API is unavailable, Search2Get switches to a small built-in fallback edit. Product image failures are replaced with an inline Search2Get placeholder rather than leaving broken image elements.

## Third-party content

Product names, product metadata and product imagery returned by DummyJSON belong to their respective source/dataset context. The Search2Get code and original interface design are licensed separately under this repository's MIT license.
