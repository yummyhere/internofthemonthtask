# FRONTEND_DESIGN.md — Vegist Organic Grocery Design Specification

## 1. Executive Summary & Design Vision
**Vegist** is an organic grocery e-commerce platform built to combine the tactile abundance of a premier farmers' market with the efficiency, clarity, and precision of modern digital commerce.

The defining visual concept is **"Farm-Fresh Editorial Abundance"**:
- **Tactile produce focus:** Every product card and banner highlights the natural color, texture, and origin of seasonal harvest.
- **Restraint and Purpose:** No gratuitous neon gradients, glassmorphism, or floaty animations. Clean, organic borders, grounding off-whites, and structured typography provide effortless shopping flow.
- **Trust-first cues:** Organic certification stamps, freshness badges ("Harvested within 24h"), origin transparency, and crystal-clear unit pricing (e.g. `Rs. 240 / kg`).

---

## 2. Design Tokens & Color Palette

The color system is rooted in natural chlorophyll, soil tones, and clean marketplace surfaces:

| Token Name | Hex Code | Purpose & Application |
|---|---|---|
| **Vegist Green** | `#62ab00` | Signature brand accent, primary CTA buttons, active states, cart badges |
| **Deep Leaf** | `#203a27` | Headings, hero headers, dark navigation bars, footer, contrast text |
| **Fresh White** | `#ffffff` | Card surfaces, modal backgrounds, input fields, header canvas |
| **Mist Gray** | `#f5f7f2` | Primary background, subtle page sections, alternating table rows |
| **Ink Soil** | `#222822` | Body text, high-legibility product names, technical specifications |
| **Muted Sage** | `#dfe8d8` | Soft badge backgrounds, subtle borders, divider lines |
| **Ripe Amber** | `#d97706` | Sale badges, seasonal harvest highlights, review star highlights |

### Functional Accents
- **Success / In Stock:** `#16a34a` (Emerald Green)
- **Warning / Low Stock:** `#ea580c` (Warm Orange)
- **Error / Out of Stock:** `#dc2626` (Ruby Red)
- **Border Default:** `#e2e8df` (Organic Stone Gray)

---

## 3. Deliberate Typography Scale

We utilize Google Fonts **Outfit** for editorial titles and prominent brand headlines, paired with **Inter** for readable product descriptions, tabular numbers, and user inputs.

```
Font Pair:
• Headings / Brand: 'Outfit', -apple-system, sans-serif (Weights: 600, 700, 800)
• Body / UI / Prices: 'Inter', system-ui, sans-serif (Weights: 400, 500, 600)
```

### Type Hierarchy:
- **Hero Display:** 48px / 1.15 line-height, bold (desktop: 56px), Outfit
- **Section Heading (H1/H2):** 30px / 1.25 line-height, semi-bold, Outfit
- **Subheading (H3/H4):** 20px / 1.35 line-height, semi-bold, Outfit
- **Product Title:** 15px / 1.3 line-height, medium weight (500), Inter
- **Price Primary:** 18px / 1.2 line-height, bold (700), Inter (Tabular numbers)
- **Price Unit (e.g. / kg):** 12px / 1.2 line-height, regular (400), text-stone-500
- **Body Regular:** 14px / 1.5 line-height, text-stone-700, Inter
- **Caption / Badges:** 11px / 1.2 line-height, uppercase tracking-wide, bold (700)

---

## 4. Layout & Alignment Strategy

1. **Top Utility Bar:** 36px height, `bg-deep-leaf text-white`, displays free shipping threshold meter, contact phone, and store location notice.
2. **Main Header:** Sticky with gentle backdrop blur (`bg-white/95 border-b border-stone-200`), containing:
   - Distinctive Vegist leaf logo
   - Global search input with instant autocomplete suggestions
   - Category quick-nav pills
   - Wishlist counter, User account dropdown, and Cart drawer trigger with live item count and subtotal
3. **Responsive Grid System:**
   - Desktop: 12-column grid with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
   - Product Grid: 4 columns on desktop (`grid-cols-4`), 3 on tablet (`grid-cols-3`), 2 on mobile (`grid-cols-2`)
   - Product Details: 2 columns (`lg:grid-cols-12`) with 7-column gallery and 5-column sticky purchase summary
4. **Slide-Out Cart Drawer:** Right-docked, 420px width on desktop, 100% on mobile. Features real-time price tally, free delivery progress bar, and instant checkout link.
5. **Multi-Step Checkout Layout:** 60/40 split with delivery and payment forms on the left, sticky order summary and itemized recalculation on the right.

---

## 5. Compact ASCII Wireframes

### Homepage Layout
```
+-------------------------------------------------------------------------+
| [Top Bar] Free delivery on orders over Rs. 2,000 | Contact: +92 300 000 |
+-------------------------------------------------------------------------+
| [VEGIST LEAF]  [ Search fresh vegetables, fruits, dairy... ]  [Wish] [Cart(3)]
+-------------------------------------------------------------------------+
| Home  |  Vegetables  |  Fruits  |  Dairy & Eggs  |  Bakery  |  Pantry   |
+-------------------------------------------------------------------------+
| [ HERO BANNER - 65% ]                      | [ SEASONAL PROMO - 35% ]   |
| "Fresh from Earth to Kitchen"             | "Organic Mango Season"     |
| 100% Pesticide-Free, Farm-Picked Daily    | 20% Off Farm Crates        |
| [ Shop Harvest Now -> ]                   | [ Claim Offer ]            |
+-------------------------------------------------------------------------+
| [FEATURED CATEGORIES SHELF]                                             |
| [Veg Icon] Vegetables | [Fruit Icon] Fruits | [Dairy Icon] Dairy & Milk |
+-------------------------------------------------------------------------+
| [CURATED COLLECTIONS: Trending | Best Sellers | On Sale]                |
| +-------------+  +-------------+  +-------------+  +-------------+      |
| | [Img: Apple]|  | [Img: Kale] |  | [Img: Milk] |  | [Img: Eggs] |      |
| | Org Honeycr |  | Fresh Kale  |  | Raw Milk 1L |  | Free-Range  |      |
| | Rs. 380/kg  |  | Rs. 140/bch |  | Rs. 260/btl |  | Rs. 390/doz |      |
| | [+ Add Cart]|  | [+ Add Cart]|  | [+ Add Cart]|  | [+ Add Cart]|      |
| +-------------+  +-------------+  +-------------+  +-------------+      |
+-------------------------------------------------------------------------+
| [WHY CHOOSE VEGIST]                                                     |
| [1] Direct from Local Farms  [2] Harvested <24h  [3] Eco-Friendly Pack  |
+-------------------------------------------------------------------------+
| [FOOTER: Navigation, Policies, Farm Certifications, Copyright]          |
+-------------------------------------------------------------------------+
```

### Primary Shopping & Checkout Flow
```
Catalog Filter List                Product Card                  Cart Drawer
+-----------------------+   +-----------------------+     +-------------------+
| Categories            |   | [Org Badge]    [Wish] |     | Your Cart (2 items|
| [x] Fresh Veggies     |   |                       |     | [Free Ship: 100%] |
| [ ] Juicy Fruits      |   |   [High-Res Produce]  |     |-------------------|
| [ ] Farm Dairy        |   |                       |     | Spinach (1 kg)    |
| Price Range           |   | Fresh Farm Spinach    |     | Rs. 120  [- 2 +]  |
| [Rs. 50] - [Rs. 2500] |   | 1 kg bunch            |     | Tomatoes (2 kg)   |
| [x] Organic Only      |   | Rs. 120   (Rs. 150)   |     | Rs. 360  [- 1 +]  |
| [x] In Stock Only     |   | [ - 1 + ] [Add Cart]  |     |-------------------|
|                       |   +-----------------------+     | Subtotal: Rs. 480 |
| Sort: Price Low->High |                                 | [ Checkout -> ]   |
+-----------------------+                                 +-------------------+
```

---

## 6. Defining Visual Idea
The heart of Vegist is **sensory grocery credibility**:
- Product cards emphasize tactile freshness: crisp borders, clear weight/bundle metrics (e.g. `500g punnet`, `1 kg bundle`, `Dozen`), organic certification flags, and instant quantity steppers right on the card.
- Crisp photography with balanced aspect ratios (`aspect-square` or `aspect-[4/3]`) to prevent layout shifts.
- Honest pricing in Pakistani Rupees (PKR) tailored for farm grocery purchasing.

---

## 7. Critique & Refinement Against Guidelines
- **Eliminated:** Neon buttons, dark mode glass cards, floating gradient blobs, excessive micro-text badges.
- **Adopted:** High-contrast `Deep Leaf` headers, clean `Mist Gray` background, tactile `Vegist Green` buttons with gentle hover states, and structured grid cards with `border border-stone-200/80` and crisp shadows (`shadow-sm` on hover `shadow-md`).
- **Accessibility:** Text contrast exceeds WCAG AA (4.5:1), interactive elements have explicit `:focus-visible` rings in `#62ab00`, screen reader labels for icon buttons, and responsive touch targets >= 44px.
