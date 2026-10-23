# Unit-price-tracker Version 8 — Barcode camera scanning

Upload all 9 files to the **root** of your existing GitHub Pages repository `Unit-price-tracker`, replacing older files. Keep the same website URL. The existing saved browser shopping lists and prices remain compatible.

## New: phone camera barcode scanning
- Tap **📷 Scan barcode** on Find deals, allow camera access, and point the rear camera at a UPC/EAN package barcode.
- Uses html5-qrcode 2.3.8 from a public CDN for iPhone Safari and other browsers, with built-in BarcodeDetector fallback where supported. An internet connection is required to load the scanner library unless previously cached.
- Barcode detection triggers the existing Open Prices Community prices lookup and Open Food Facts product information lookup. These report community data, not verified current store prices.
- **Manual barcode field** works without camera support.
- Stop camera button and automatic stop when leaving the tab. Camera requires an HTTPS page and user permission.

## Existing features
Store comparison, Costco, detailed catalog, shopping list, size/unit price comparison, budgets, receipt tools, family snapshots, coupons, price history, favorites, and community price reports are preserved. Demo prices stay labeled demo.

Keep in mind: Open Food Facts product names and Open Prices price observations may be missing. No live retailer feed is included.
