/*
 * MAJORLEAGUE — STOCK CONTROL
 * This is the only file that needs editing for routine stock changes.
 *
 * To add an item, copy the product template in README.md into the products
 * array, then fill in its details. To mark an item unavailable, set
 * available:false. To remove it from the shop, remove its entry.
 *
 * Image paths are relative to the website root, e.g. assets/products/item.webp
 */
const STORE = {
  currency: "£",
  categories: [
    { id: "flower", name: "FLOWER", image: "assets/categories/IMG_8675-v20261011.webp" },
    { id: "extracts", name: "EXTRACTS", image: "assets/categories/IMG_8682-v20261011.jpeg" },
    { id: "edibles", name: "EDIBLES", image: "assets/categories/IMG_8683-v20261011.jpeg" },
    { id: "accessories", name: "ACCESSORIES", image: "assets/categories/IMG_8684-v20261011.jpeg" },
    { id: "special-offers", name: "SPECIAL OFFERS", image: "assets/categories/IMG_8685-v20261011.jpeg" }
  ],
  products: [
    // Add real products here. Keep each id unique.
    // Required fields: id, category, name, price, image, available
  ]
};
