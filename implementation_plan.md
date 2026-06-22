# Plan: Redesign Best-Seller Catalog Cards & Optimize Performance

## Goal
Redesign the product card layout in the best-seller catalog (`DigitalCatalog.tsx`) to be cleaner and more premium. Optimize performance by limiting the display to only the top 4 items and reducing layout/rendering overhead (e.g., removing heavy Framer Motion layout props/continuous animations) to prevent frame drops.

## User Review Required
We will:
1. Limit the products displayed in `DigitalCatalog.tsx` to the first 4 items from `products`.
2. Refactor card design to use a cleaner, modern neo-brutalist aesthetic with lightweight CSS hover transitions instead of heavy Framer Motion layout/transform recalculations.
3. Remove continuous JS-driven animations on page scroll/viewport checks if they contribute to layout thrashing.

## Proposed Changes

### [Digital Catalog Component]

#### [MODIFY] [DigitalCatalog.tsx](file:///f:/1.PROJECT/Madfat-Digital-Store/src/components/DigitalCatalog.tsx)
- Slice the `products` list to keep only the first 4 products: `const displayedProducts = products.slice(0, 4);`
- Redesign the card structure:
  - Simplify wrapper layout. Use CSS-based transition classes instead of Framer Motion layout transitions (`layout` prop on `motion.div` causes layout recalculation for all siblings).
  - Use simple CSS-based animations or GPU-accelerated Tailwind transitions for hover states (`hover:translate-x-1 hover:translate-y-1 hover:shadow-none` style or neat lift effects).
  - Refine typographic sizing, spacing, badges, and icon layouts to be modern, crisp, and high-performance.
  - Simplify badge styling (HOT, BEST) and optimize standard Tailwind classes.
  - Remove unnecessary doodle animations or replace them with lightweight CSS animations.

## Verification Plan

### Manual Verification
- Check the UI layout in the browser.
- Verify that only 4 items are rendered.
- Ensure the animation on hover is smooth and there are no frame drops when scrolling or hovering over items.
