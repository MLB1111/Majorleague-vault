# Majorleague Vault

Majorleague site build.

## Catalogue workflow

The website reads the **Website** tab of a Google Sheet as a published CSV feed. The Google Sheet is maintained with a free Google Apps Script sync:

1. The **Products** tab is populated from `data/products.json` in this repository.
2. The **Stock** tab is managed manually from iPhone. Stock is never overwritten by the GitHub sync.
3. The **Website** tab combines product data + stock + automatic GitHub image URLs.
4. Publish the **Website** tab to the web as CSV and place that URL in `js/config.js`.
5. When ChatGPT receives a new product photo/details, the product metadata can be added to `data/products.json` and the photo can be stored as `assets/products/<ProductID>.webp`.
6. Run the Majorleague sync in Google Sheets (or install an hourly trigger) to refresh the Website feed.

Google Apps Script source: `tools/majorleague-sync.gs`.

GitHub Pages hosts the front end; Google Sheets remains the catalogue/stock source.
