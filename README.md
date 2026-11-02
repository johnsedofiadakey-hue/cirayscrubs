# Ciray storefront frontend

This is the standalone Next.js storefront and staff UI. Firebase and Stripe are in `../../platform/`; this app is a client of Claude's public Firestore documents and callable Functions. The old static concept remains in `../../ui-prototype/`.

## Run locally

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). `.env.local` currently selects `NEXT_PUBLIC_CIRAY_MODE=demo`: all products, prices, images, collections, four sample markets and exchange rates are synthetic. The bag works locally; payment is disabled. The admin can save demo product details and collections to this browser, while variant upload and publication require Firebase.

For an emulator session, set `NEXT_PUBLIC_CIRAY_MODE=emulator`, fill the Firebase web config in `.env.local`, and run the emulators from `../../platform/`. For a real Firebase project set `NEXT_PUBLIC_CIRAY_MODE=firebase`. No mode silently falls back to demo if Firebase fails. `NEXT_PUBLIC_ENABLE_TEST_CHECKOUT=true` is a separate test payment switch; do not enable it until Stripe test mode and country checks pass.

## Implemented routes

- `/`: content driven home sections, curated product rails and color gallery.
- `/shop`: searchable catalog with department, type, color and size controls.
- `/collections/[handle]`: curated/manual collections, sorting, style chips, merchandising groups, promo cards, color group/fabric/pocket/neckline filters.
- `/pages/[pageId]`: published editorial and policy pages.
- `/product/[handle]`: color, size and length selection mapped to a real variant SKU; add to bag and guarded buy now.
- `/bag`: server quote, quantity changes, country specific checkout guard.
- `/checkout/success`: order status callable.
- `/teams`: inquiry form.
- `/admin`: role checked product, variant, image, publishing and collection editor.

The supplied Ciray stitch-star logo is preserved at `public/brand/ciray-stitch-star-logo.svg`; the header and favicon use a derived mark. The default palette uses its warm brown and cream. On a product page, selecting a scrub color updates the photo and storefront accents using the matching `colors/{id}.hex` value. Light colors are darkened for white button text, and the choice persists for the browser tab.

The navigation document is `content/navigation`; a small demo navigation is the preview fallback. Product cards and collection pages use `catalogIndex/v1`. Local currency estimates use `config/fx` only while rates are fresh, with USD always visible. Stripe decides the payable currency and exact amount on its payment page. See `../../docs/CIRAY-FIREBASE-UI-CONTRACT.md` and `../../docs/CIRAY-FIREBASE-MARKET-MATRIX.md` for the backend contract and launch gates.

## Still required before launch

- Ciray's approved logo, photography, copy, size charts, product variants, stock and actual prices.
- Server-rendered page metadata and structured product data for search engines. Collection SEO text renders in-page, but metadata currently uses the site default.
- Complete admin order fulfillment, market settings and homepage/navigation publishing screens. Collection editorial groups, promo image uploads and sibling links currently require backend/admin tooling beyond the basic editor.
- Real Firebase staging configuration, staff claims, App Check and payment test mode integration.
- Country by country shipping, duties, tax, returns and Stripe checkout acceptance. No country is verified for live orders.
- Image optimization and accessibility/performance review with final assets. The current concept photos use regular `<img>` and ESLint flags them for optimization.

## Checks

Run `npm run build` and `npm run lint`. Browser checks at 320, 390 and 1440 px are recorded under `../../tmp/ui-reference/` and use synthetic data only.
