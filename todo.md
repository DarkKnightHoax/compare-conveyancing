# Compare the Conveyancing Market — TODO

## Frontend
- [x] Homepage with animated gold particles and Georgian townhouse hero
- [x] 3-step quote wizard with one-by-one sliding question animations
- [x] All 4 transaction types: Purchase, Sale, Sale & Purchase, Remortgage
- [x] Postcode autocomplete (postcodes.io)
- [x] 47 UK mortgage lenders dropdown
- [x] Contextual help tooltips on wizard questions
- [x] Results page with 5 law firm quote cards
- [x] Sortable results by price / rating
- [x] Full fee breakdown per card (legal fee + supplements + disbursements + VAT)
- [x] SDLT and Land Registry fee auto-calculation
- [x] Exclusive pricing legal popup on results page (bold, larger text)
- [x] "Instruct Directly" modal with payment form on each quote card
- [x] "Request a Callback" modal on each quote card
- [x] How It Works page (fully written)
- [x] Contact Us page (fully written)
- [x] Privacy Policy page (fully written)
- [x] Terms & Conditions page (fully written)
- [x] All navigation and footer links routing correctly

## Backend
- [x] Full-stack upgrade applied (tRPC + Express + MySQL/TiDB)
- [x] Database schema: 5 tables (users, law_firms, leads, callback_requests, instruct_requests)
- [x] Database schema pushed and tables created
- [x] tRPC router: firms (list, listAdmin, create, update, delete)
- [x] tRPC router: leads (create, list, getById, updateStatus, stats)
- [x] tRPC router: callbacks (create, list, updateStatus, pendingCount)
- [x] tRPC router: instruct (create, list, updateStatus)
- [x] Owner notifications on new lead, callback, and instruction
- [x] Admin role protection on all admin procedures

## Admin Panel
- [x] Admin panel at /admin route
- [x] Auth gate: redirects to login if not authenticated
- [x] Role gate: shows "Access Denied" if not admin
- [x] Dashboard tab: stats overview + lead status breakdown chart
- [x] Leads tab: all leads with expandable details + status update buttons
- [x] Callbacks tab: callback queue with status dropdown
- [x] Instructions tab: instruct requests with status dropdown
- [x] Law Firms tab: add/edit/remove firms from panel

## Integration
- [x] Quote wizard wired to leads.create mutation (saves to DB on Step 3 submit)
- [x] Instruct modal wired to instruct.create mutation
- [x] Callback modal wired to callbacks.create mutation
- [x] Admin route registered in App.tsx

## Testing
- [x] Vitest tests: 13 tests passing across 2 test files
- [x] Tests cover: law firms, leads, callbacks, instruct requests, fee engine validation

## Remaining / Future
- [ ] Stripe payment integration for "Instruct Directly" flow (Stripe keys needed)
- [ ] Update Contact Us page with real business phone/email
- [x] SEO meta tags: description, keywords, Open Graph, Twitter Card, robots
- [ ] Custom domain (user to buy GoDaddy domain and point DNS to Manus)
- [ ] Promote owner account to admin role via database

## SEO Improvements
- [x] FAQ page with FAQPage JSON-LD schema
- [x] Blog index page listing all articles
- [x] Blog article: How Much Does Conveyancing Cost in 2025?
- [x] Blog article: What Is Conveyancing and How Does It Work?
- [x] Blog article: First-Time Buyer Conveyancing Guide
- [x] Blog article: Leasehold vs Freehold — What Buyers Need to Know
- [x] JSON-LD structured data on homepage (Service + Organization schema)
- [x] Per-page meta title and description for all routes
- [x] sitemap.xml in client/public
- [x] robots.txt in client/public
- [x] Internal links from FAQ and Blog back to /get-quote
- [x] FAQ and Blog links added to navbar and footer

## Investor Admin Panel
- [x] firmFeeStructures table in drizzle schema (per-firm fee bands, disbursements, margins)
- [x] firmNotes table for investor notes per firm
- [x] DB migration pushed
- [x] tRPC investor router (fee CRUD, firm overview, revenue stats)
- [x] Investor login page at /investor/login (auth guard redirects to OAuth)
- [x] Investor dashboard: revenue overview, firm comparison table
- [x] Fee editor: per-firm legal fee bands by property value
- [x] Disbursements editor: per-firm search fees, SDLT, Land Registry
- [x] Margin/commission settings per firm
- [x] Firm notes section
- [x] Route registered in App.tsx at /investor
- [x] Vitest tests for investor procedures (18 tests passing)

## Unified Admin Panel (standalone login)
- [x] ADMIN_USERNAME and ADMIN_PASSWORD_HASH secrets added
- [x] Standalone admin login tRPC procedure (bcrypt password check, JWT session cookie)
- [x] Admin login page at /admin/login (username + password form)
- [x] Unified /admin panel with all tabs: Overview, Leads, Callbacks, Instructions, Law Firms, Fee Editor, Firm Notes
- [x] Remove separate /investor route
- [x] Admin logout clears session cookie
- [x] Tests for admin auth procedures (19 tests passing)

## Bug Fixes
- [x] Fix admin login redirect loop — root cause: ctx.req.cookies undefined (no cookie-parser), fixed by using parse() from cookie package directly on req.headers.cookie
