# UnitWise PLUS (static progressive web app)

A grocery unit-price comparison and store-by-store planner. No server or build process required.

## Features
- Search product listings; sort by lowest unit price, package price, store, or product.
- Filter by store and show only personally saved (non-demo) prices.
- Barcode scanning in browsers that support `BarcodeDetector` and camera access; Open Food Facts lookup for product names when possible.
- Store planner: quantity, check-off, automatically choose lowest package price per product, override assigned store, and group by store or product.
- Running total and per-store totals; copy shopping list; export/import JSON backup.
- Custom store price entry and removal; localStorage persistence; basic offline caching.

## Publish free on GitHub Pages
Upload the **contents** of the `unitwise` folder to the root of a GitHub repository, then Settings > Pages > Deploy from a branch > main > /(root). Visit the HTTPS Pages URL on a phone and use Add to Home Screen.

## Important limitations
All built-in prices are fake illustrative DEMO data, not retailer offers. Real-time retailer listings, sale prices, inventory, geographic matching and purchase links require properly licensed store feeds/APIs and possibly a backend. Barcode lookup does not automatically obtain retailer prices. For same-named products unit prices are normalized within compatible measurement categories; variants/brand differences can still matter. The shopping planner optimizes each item separately using lowest *package* price, not a guaranteed cheapest overall trip; it does not include taxes, driving costs or memberships. Data is stored only in this browser and is not cloud synchronized. Camera scanner browser support varies.

## New: package-size value comparison
- Compare multiple package sizes of the same product in any compatible weight, volume, or count unit.
- Best-unit-price badges, larger-size per-unit savings, and summary insights.
- Store planner can auto-select the best unit value or the cheapest upfront package price.
- Demo listings include different sizes of pasta, cereal, and eggs.
- Personal price overrides apply to an exact package amount rather than erasing other sizes.
- Price comparisons only work for matching product labels and compatible measurements. No live retailer prices or stock feeds are included.
