# MAJORLEAGUE — THE VAULT

A fast, mobile-friendly static storefront hosted on GitHub Pages.

## Routine stock updates

**Edit `stock.js` only for normal stock changes.** The homepage, category pages, basket and checkout read their product data from this file. No HTML or CSS edits should be needed for routine inventory updates.

The easiest workflow is to message the site maintainer with the change, for example:

- **Add:** category, product name, price, image, available/in stock
- **Price change:** product name, old price if known, new price
- **Out of stock:** product name (sets `available: false`)
- **Restock:** product name (sets `available: true`)
- **Remove:** product name (removes it from the public catalogue)

I can apply these updates directly to this repository when asked, commit them, and send back a preview link for checking.

## Product format

Add one object per product inside the `products` array in `stock.js`:

```js
{
  id: "unique-product-id",
  category: "flower",
  name: "Product name",
  price: 25,
  image: "assets/products/product-image.webp",
  available: true
}
```

Rules:
- `id` must be unique and URL/local-storage friendly (lowercase letters, numbers and hyphens).
- `category` must exactly match one of: `flower`, `extracts`, `edibles`, `accessories`, `special-offers`.
- `price` is a number in pounds, without a £ sign.
- `image` is the path to the product image relative to the site root. Upload images into `assets/products/`.
- `available` is `true` for in-stock items and `false` for sold-out items.
- Use accurate, supplied product details; do not guess prices or availability.

When a category has no listed products, the page now shows a simple “NO PRODUCTS AVAILABLE RIGHT NOW” message instead of fake zero-price demo items.

## Image recommendations

Use compressed WebP or JPEG images with consistent framing. Keep filenames simple, lowercase, and hyphenated, for example `blue-hoodie.webp`. Tell me which product each uploaded image belongs to and I can set its path in `stock.js`.

## Preview and publishing

Repository: [MLB1111/Majorleague-vault](https://github.com/MLB1111/Majorleague-vault)

GitHub Pages should be configured to deploy from branch `main`, folder `/(root)`. After each stock update, check the live preview on your phone. If the browser shows an older version, refresh or open the versioned preview link I provide.

## Important checkout note

The basket is front-end functionality. The checkout currently displays a demo confirmation; it does **not** submit real orders. Connect a secure order/fulfilment workflow and suitable payment handling before accepting real customer orders. Do not collect payment-card details in this static site.
