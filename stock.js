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
    { id: "flower", name: "FLOWER", image: "assets/category-flower-20261015.jpeg" },
    { id: "extracts", name: "EXTRACTS", image: "assets/category-extracts-20261015.jpeg" },
    { id: "edibles", name: "EDIBLES", image: "assets/category-edibles-20261015.jpeg" },
    { id: "accessories", name: "ACCESSORIES", image: "assets/category-accessories-20261015.jpeg" },
    { id: "special-offers", name: "SPECIAL OFFERS", image: "assets/category-special-offers-20261015.jpeg" }
  ],
  strainLibrary: [
    { id: "chem-lato", name: "Chem-lato", lineage: "Gelato #33 × 707 Chemdawg", image: "assets/chem-lato.jpg" },
    { id: "galactic-runtz", name: "Galactic Runtz", lineage: "Falcon 9 × Runtz", image: "assets/galactic-runtz.jpg" },
    { id: "glitter-bomb", name: "Glitter Bomb", lineage: "GAS #10 × OGKB Headband", image: "assets/glitter-bomb.jpg" },
    { id: "frozen-cherries", name: "Frozen Cherries", lineage: "Lemon Cherry Gelato × Curelato × Runtz", image: "assets/frozen-cherries.jpg" },
    { id: "white-walker-og", name: "White Walker OG", lineage: "SFV OG Kush phenotype", image: "assets/white-walker-og.jpg" },
    { id: "frosted-fruit-cakes", name: "Frosted Fruit Cakes", lineage: "Fruity Pebbles OG × Wedding Cake", image: "assets/frosted-fruit-cakes.jpg" },
  ],
  libraries: {
    extracts: [
      { id: "blueberry-zkunk-live-resin", name: "Blueberry Zkunk Live Resin", lineage: "Zkunk × Blucci", image: "", label: "EXTRACT PROFILE" }
    ],
    edibles: [],
    accessories: [],
    "special-offers": []
  },
  products: [
    // Add real products here. Keep each id unique.
    // Required fields: id, category, name, price, image, available
  ]
};
