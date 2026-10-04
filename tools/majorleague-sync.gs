const MLB_CONFIG = {
  SPREADSHEET_ID: 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE',
  GITHUB_JSON_URL: 'https://raw.githubusercontent.com/MLB1111/Majorleague-vault/main/data/products.json',
  SITE_ASSET_BASE: 'https://mlb1111.github.io/Majorleague-vault/assets/products/',
  SHEET_PRODUCTS: 'Products',
  SHEET_STOCK: 'Stock',
  SHEET_WEBSITE: 'Website'
};

const PRODUCT_HEADERS = ['ProductID','Name','Category','Type','Price','New','Featured','Active'];
const STOCK_HEADERS = ['ProductID','Stock'];
const WEBSITE_HEADERS = ['ProductID','Name','Category','Type','Price','ImageURL','New','Featured','Active','Stock'];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Majorleague')
    .addItem('Sync catalogue from GitHub', 'syncMajorleagueCatalogue')
    .addItem('Rebuild website feed', 'rebuildWebsiteFeed')
    .addToUi();
}

function syncMajorleagueCatalogue() {
  const ss = SpreadsheetApp.openById(MLB_CONFIG.SPREADSHEET_ID);
  const productsSheet = getOrCreateSheet_(ss, MLB_CONFIG.SHEET_PRODUCTS, PRODUCT_HEADERS);
  const stockSheet = getOrCreateSheet_(ss, MLB_CONFIG.SHEET_STOCK, STOCK_HEADERS);
  getOrCreateSheet_(ss, MLB_CONFIG.SHEET_WEBSITE, WEBSITE_HEADERS);

  const response = UrlFetchApp.fetch(MLB_CONFIG.GITHUB_JSON_URL, {
    muteHttpExceptions: true,
    headers: {'Cache-Control': 'no-cache'}
  });
  if (response.getResponseCode() !== 200) {
    throw new Error('Could not read the Majorleague catalogue from GitHub. HTTP ' + response.getResponseCode());
  }

  const products = JSON.parse(response.getContentText());
  if (!Array.isArray(products)) throw new Error('products.json must contain an array.');

  const rows = products.map(p => [
    p.ProductID || '',
    p.Name || '',
    p.Category || '',
    p.Type || '',
    p.Price ?? '',
    p.New === true || p.New === 1 || String(p.New).toLowerCase() === 'true',
    p.Featured === true || p.Featured === 1 || String(p.Featured).toLowerCase() === 'true',
    p.Active === false || String(p.Active).toLowerCase() === 'false' ? false : true
  ]);

  replaceData_(productsSheet, PRODUCT_HEADERS, rows);

  const existingStock = readStock_(stockSheet);
  const productIds = new Set(rows.map(r => String(r[0]).trim()).filter(Boolean));
  const stockRows = Array.from(productIds).map(id => [id, existingStock[id] ?? 0]);
  replaceData_(stockSheet, STOCK_HEADERS, stockRows);

  rebuildWebsiteFeed();
  SpreadsheetApp.getActive().toast('Majorleague catalogue synced.', 'Majorleague', 5);
}

function rebuildWebsiteFeed() {
  const ss = SpreadsheetApp.getActive();
  const productsSheet = getOrCreateSheet_(ss, MLB_CONFIG.SHEET_PRODUCTS, PRODUCT_HEADERS);
  const stockSheet = getOrCreateSheet_(ss, MLB_CONFIG.SHEET_STOCK, STOCK_HEADERS);
  const websiteSheet = getOrCreateSheet_(ss, MLB_CONFIG.SHEET_WEBSITE, WEBSITE_HEADERS);

  const products = readObjects_(productsSheet, PRODUCT_HEADERS);
  const stock = readStock_(stockSheet);

  const rows = products.map(p => {
    const id = String(p.ProductID || '').trim();
    const image = id ? MLB_CONFIG.SITE_ASSET_BASE + encodeURIComponent(id) + '.webp' : '';
    return [
      id,
      p.Name || '',
      p.Category || '',
      p.Type || '',
      p.Price ?? '',
      image,
      p.New === true || String(p.New).toLowerCase() === 'true',
      p.Featured === true || String(p.Featured).toLowerCase() === 'true',
      p.Active === false || String(p.Active).toLowerCase() === 'false' ? false : true,
      stock[id] ?? 0
    ];
  });

  replaceData_(websiteSheet, WEBSITE_HEADERS, rows);
}

function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.getRange(1,1,1,headers.length).setValues([headers]);
  return sheet;
}

function replaceData_(sheet, headers, rows) {
  sheet.clearContents();
  sheet.getRange(1,1,1,headers.length).setValues([headers]);
  if (rows.length) sheet.getRange(2,1,rows.length,headers.length).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

function readObjects_(sheet, headers) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2,1,lastRow-1,headers.length).getValues();
  return values.map(row => Object.fromEntries(headers.map((h,i) => [h,row[i]])));
}

function readStock_(sheet) {
  const result = {};
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return result;
  const values = sheet.getRange(2,1,lastRow-1,2).getValues();
  values.forEach(row => {
    const id = String(row[0] || '').trim();
    if (id) result[id] = Number(row[1]) || 0;
  });
  return result;
}
