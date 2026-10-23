# Unit-price-tracker — Version 9 (clean dashboard edition)

## Install on GitHub Pages
1. Download and extract the ZIP.
2. Open your existing public GitHub repository named `Unit-price-tracker`.
3. Upload the 11 files **inside** this folder to the **root** of the repository (where `index.html` is), replacing the old files, and commit.
4. Under Settings → Pages, use Deploy from a branch, `main`, `/ (root)`.
5. Browse to `https://colel0910.github.io/Unit-price-tracker/`. If the old version appears, reload or open `?v=9` at the end of the URL.

## What changed
- Redesigned home dashboard with list totals, budget summary, selected stores, and quick actions.
- Organized desktop sidebar and compact mobile navigation with a More sheet.
- Updated cards, buttons, spacing, typography, mobile layout, and contrast.
- All earlier functionality retained: barcode camera scanning, manual barcode lookup, Open Food Facts name lookup, crowdsourced Open Prices reports, store and size comparisons, Costco demo catalog, user-entered prices, shopping list, trip comparison, budget, price history, coupons, receipt review, shared list snapshots, favorites, restock reminders, backup and restore.
- Same localStorage keys as V8 for backward compatibility; install at the same GitHub Pages URL and browser to preserve saved data. Export a backup before upgrading for extra safety.

## Important limitations
- DEMO store prices are illustrative. Open Prices is community-submitted historical data, not a live retailer feed. Price and inventory availability should be verified with retailers.
- Camera scanning needs HTTPS and camera permission. Some barcode scanning libraries load from a public CDN and need internet access.
- Family list sharing is snapshot based, not real-time synchronization.
- Receipt text extraction availability depends on browser and network; review it before saving.
