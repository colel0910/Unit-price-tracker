# Unit-price-tracker V4

Static, GitHub Pages-ready progressive web app. Upload **all six files** in this directory directly to the repository root, including `v4.js`. In GitHub > Settings > Pages select Deploy from branch / `main` / `(root)`.

## What is new
- Receipt image capture and **optional** Tesseract OCR loaded only after tapping Recognize text. Review and manually save each extracted product, price, quantity and store. The image is not uploaded by the app; the OCR library and language data are downloaded from a third-party CDN.
- Price history observations from manually entered price listings and reviewed receipt entries, with a normalized unit-price SVG line chart.
- User-defined shopping budget with running estimated remaining-cart total.
- Family list snapshot links and downloadable list files. **Not live collaborative syncing**. Shared links contain list contents in URL fragment: anyone with the link can read them.
- Manually recorded coupons and weekly ads with dates and user-provided links; **no live coupon data**.
- Multi-store optimizer tries combinations of up to four stores with a configurable flat additional-stop cost. Calculates lowest package checkout cost, not best unit-value total or real routing.

## Preserved
Product search, camera barcode scanning where supported, Open Food Facts identification, store-specific filters, multiple package sizes and unit-price comparisons, store-by-store list planner, check-offs, price entry, and JSON backup/restore. Existing localStorage list and prices are reused.

## Important
Demo prices are illustrations only. No retailer live feeds, authenticated accounts, shared real-time family updates, genuine maps/travel distances or automated coupon application. OCR requires internet and browser compatibility. Keep original receipts to verify details. Browser data is device-specific: export regular backups.

## Store-specific products / Costco
Added Costco to the sample listings, with Kirkland Signature brand identification, and store-brand examples for Walmart, Target, Aldi, and ShopRite. Every listing now shows **store, product name, brand, category, package quantity/unit, price and unit price**. Search supports brands and categories. Custom price-entry form supports brand and category. These example prices are **illustrations**, not verified retailer prices or guarantees that a particular store stocks an item. Similar generic product types may have different brands or quality; unit-price winners compare category-level products, not necessarily identical SKUs.


## Version 5: detailed product descriptions
- Adds precise example product descriptors (brand, type, form, fat level, protein descriptor, flavor, dietary notes, pack size). These example product identities and prices are **illustrative**, not confirmed store SKUs or nutrition facts.
- Search by descriptors and filter by product type, fat level and protein label.
- Manage Prices supports entering detailed descriptions for your own store listings; check the product packaging before making nutrition claims.
- Existing local storage keys, shopping lists, backup imports, receipts and Version 4 tools retained.
