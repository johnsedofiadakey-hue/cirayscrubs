# Ciray storefront frontend

This is the standalone Next.js storefront and staff UI. Firebase and Stripe are in `../../platform/`; this app is a client of Claude's public Firestore documents and callable Functions. The old static concept remains in `../../ui-prototype/`.

## Run locally

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The default runtime is Firebase mode and reads the same catalog and content as the hosted store. The live catalog has five FIGS styles in Black and Navy, with 190 variant records initially set to five units each. Inventory edits in `/admin` call the backend and change Firebase stock. The initial catalog sheet is `../../data/ciray-initial-catalog.csv`. Payment remains disabled until checkout setup and market checks are complete.

For an emulator session, set `NEXT_PUBLIC_CIRAY_MODE=emulator` and run the emulators from `../../platform/`. Fill the Firebase web config in `.env.local` before local development. `NEXT_PUBLIC_ENABLE_TEST_CHECKOUT=true` is a separate test payment switch; enable it only after Stripe test mode and country checks pass.

## Implemented routes

- `/`: content driven home sections, curated product rails and color gallery.
- `/shop`: searchable catalog with department, type, color and size controls.
- `/collections/[handle]`: curated/manual collections, sorting, style chips, merchandising groups, promo cards, color group/fabric/pocket/neckline filters.
- `/pages/[pageId]`: published editorial and policy pages.
- `/product/[handle]`: color, size and length selection mapped to a real variant SKU; add to bag and guarded buy now.
- `/bag`: server quote, quantity changes, country specific checkout guard.
- `/checkout/success`: order status callable.
- `/teams`: inquiry form.
- `/admin`: role checked product, variant, image, stock, visibility and collection editor.

The supplied Ciray stitch-star logo is preserved at `public/brand/ciray-stitch-star-logo.svg`; the header and favicon use a derived mark. The default palette uses its warm brown and cream. On a product page, selecting a scrub color updates the photo and storefront accents using the matching `colors/{id}.hex` value. Light colors are darkened for white button text, and the choice persists for the browser tab.

The navigation document is `content/navigation`; a small demo navigation is the preview fallback. Product cards and collection pages use `catalogIndex/v1`. Local currency estimates use `config/fx` only while rates are fresh, with USD always visible. Stripe decides the payable currency and exact amount on its payment page. See `../../docs/CIRAY-FIREBASE-UI-CONTRACT.md` and `../../docs/CIRAY-FIREBASE-MARKET-MATRIX.md` for the backend contract and launch gates.

## Still required before launch

- Supplier-approved product photography for Ciray's use, Ciray copy, size charts, verified variants and stock, and actual selling prices. The supplied Ciray logo is already integrated.
- Server-rendered page metadata and structured product data for search engines. Collection SEO text renders in-page, but metadata currently uses the site default.
- Complete admin order fulfillment, market settings and homepage/navigation publishing screens. Collection editorial groups, promo image uploads and sibling links currently require backend/admin tooling beyond the basic editor.
- Real Firebase staging configuration, staff claims, App Check and payment test mode integration.
- Country by country shipping, duties, tax, returns and Stripe checkout acceptance. No country is verified for live orders.
- Image optimization and accessibility/performance review with final assets. The current concept photos use regular `<img>` and ESLint flags them for optimization.

## Checks

Run `npm run build` and `npm run lint`. Browser checks at 320, 390 and 1440 px are recorded under `../../tmp/ui-reference/` and use synthetic data only.
