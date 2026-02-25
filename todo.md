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
- [ ] SEO meta tags and sitemap.xml
- [ ] Custom domain (user to buy GoDaddy domain and point DNS to Manus)
- [ ] Promote owner account to admin role via database
