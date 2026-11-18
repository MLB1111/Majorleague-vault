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
    { id: "33-splitter", name: "🇬🇧 33 SPLITTER", lineage: "Gelato #33 × Atom Splitter", image: "assets/33-splitter.jpg" },
    { id: "tokyo-gas", name: "TOKYO GAS", lineage: "Unconfirmed × Unconfirmed", image: "assets/tokyo-gas.jpg" },
    { id: "perm-x-g41", name: "PERM X G41", lineage: "Perm × Gelato 41", image: "assets/perm-x-g41.jpg" },
    { id: "skittles-x-og", name: "SKITTLES X OG", lineage: "Zkittlez × OG Kush", image: "assets/skittles-x-og.jpg" },
    { id: "bubblegum-gelato", name: "BUBBLEGUM GELATO", lineage: "Indiana Bubblegum × Gelato 45", image: "assets/bubblegum-gelato.jpg" },
    { id: "jet-fuel", name: "JET FUEL", lineage: "Aspen OG × High Country Diesel", image: "assets/jet-fuel.jpg" },
    { id: "white-runtz", name: "WHITE RUNTZ", lineage: "Zkittlez × Gelato", image: "assets/white-runtz.jpg" },
    { id: "smoothies", name: "SMOOTHIES", lineage: "Blueberry × Somango", image: "assets/smoothies.jpg" },
    { id: "toadalatti", name: "TOADALATTI", lineage: "The Toad Gelatti", image: "assets/toadalatti.jpg" }
  ],
  libraries: {
    extracts: [
      { id: "blueberry-zkunk-live-resin", name: "Blueberry Zkunk Live Resin", lineage: "Zkunk × Blucci", image: "https://mlb1111.github.io/Majorleague-vault/assets/blueberry-zkunk-live-resin.jpeg?v=20261023c", label: "EXTRACT PROFILE" },
      { id: "ozark-live-resin", name: "Ozark Live Resin", lineage: "OZ KUSH × JEALOUSY", image: "https://mlb1111.github.io/Majorleague-vault/assets/ozark-live-resin.jpeg.PNG?v=20261030b", label: "EXTRACT PROFILE" },
      { id: "cream-smoothie-live-resin", name: "Cream Smoothie Live Resin", lineage: "GELONADE × C.R.E.A.M", image: "https://mlb1111.github.io/Majorleague-vault/assets/Cream-smoothie-live-resin.jpeg.PNG?v=20261030b", label: "EXTRACT PROFILE" },
      { id: "zangria-live-resin", name: "Zangria Live Resin", lineage: "THIN MINT GSC × ZKITTLEZ", image: "https://mlb1111.github.io/Majorleague-vault/assets/Zangria-live-resin.jpeg.PNG?v=20261030b", label: "EXTRACT PROFILE" }
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
