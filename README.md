# Unit-price-tracker Version 6

Deploy to GitHub Pages repository `Unit-price-tracker`. Upload ALL six files in this directory to the repository root. `index.html` must be at the root. Settings → Pages → Deploy from branch `main`, folder `/ (root)`.

## New in Version 6
- Favorite products and saved searches.
- Two-package comparison using compatible base units (weight, volume, count).
- Restock reminders shown inside the app, with one-click add to list.
- Standalone shelf-price calculator for comparing two sizes.

## Preserved
Version 5 search, detailed product categories, Costco, barcode scanner where supported, store-by-store planner, size comparisons, price entry, budgets, charts, receipt tool, coupon collection, trip estimator, family snapshot sharing, backup and restore.

## Limitations
The supplied catalog includes DEMO prices; they are not live retailer offers. Favorites and reminders are local to each browser and don't sync across devices. Restock reminders don't send push notifications. Receipt recognition uses an external OCR script when requested and requires checking the results. Family lists share snapshots rather than syncing automatically.

Local storage keys from previous versions are retained to avoid losing existing saved data when updating the same site URL/browser. Export backups before any upgrade.


## V7: Free Open Prices reports
New Community prices tab: enter an 8–14 digit barcode or scan in Find deals; it queries public Open Prices reported observations and displays the date, store, city, USD price, and source link. Data is crowdsourced and historical, NOT live Walmart/Costco/etc pricing. US-dollar entries only, no assumption of store availability. No API key required; availability depends on API connectivity and CORS support. Local cached lookup reports are saved in your browser, refreshed on demand. Old records remain dated. Prices are not automatically merged into user saved-price inventory.

Upload all eight files to the root of the Unit-price-tracker GitHub Pages repository. Existing browser local storage is preserved. Attribution: Open Prices / Open Food Facts (ODbL), https://prices.openfoodfacts.org.
