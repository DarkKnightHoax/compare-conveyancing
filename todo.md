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

## Live Fee Sync (Admin → Results Page)
- [x] Seed 5 law firms into the database
- [x] Seed fee structures for each firm from existing feeEngine.ts values
- [x] tRPC procedure: calculate live quotes from DB fee structures
- [x] Results page reads live quotes from DB (not static feeEngine.ts)
- [x] Admin fee editor changes reflect immediately on results page

## Firm Details & Fee Updates (Feb 2026)
- [x] Update firm details: PCS Legal (Basildon Essex, est 2010, 4.3), Easy Choice Conveyancing (London, est 2015, 4.5), TQ Law (Leigh, est 2012, 4.7)
- [x] Add Burtons Solicitors (London, est 2004, 4.2) to database with fee structures
- [x] Switch Land Registry fees to "Apply using the portal" column values (£20/£40/£100/£150/£295/£500)
- [x] Replace SDLT calculation engine with accurate April 2025 rates (standard/FTB/additional property) matching stampdutycalculator.org.uk — built into results page automatically
- [x] SDLT engine integrated into server db.ts and client feeEngine.ts — correct stamp duty shown automatically on every quote card
- [x] Correct SDLT rate bands: standard (0/2/5/10/12%), FTB relief (£0-£300k=0%, £300k-£500k=5%, over £500k=full rates), additional property (+5% surcharge on all bands)

## Website Corrections Batch (Feb 2026)
- [x] Remove Remortgage option from homepage and from Step 1 transaction type question
- [x] Mortgage question: change to simple Yes / No (no sub-options)
- [x] Second home question: rephrase to "Are you moving home? or are you purchasing an additional property?" — moving home = 3% surcharge, additional property = 5% surcharge
- [x] Help to Buy ISA question: add "or a Lifetime LISA?" to the question text
- [x] Buyer count question: change to dropdown of numbers 1–15
- [x] Upload firm logos to S3 and store URLs in DB; show logos on results page quote cards
- [x] Add "Email me the quote" as third CTA on results page (client receives quote by email)
- [x] Update business registration: ComparetheConveyancingMarket Ltd, 71-75 Shelton Street, Covent Garden, London WC2H 9JQ — apply to footer and all relevant pages

## Website Corrections Batch 2 (Feb 2026)
- [x] Remove Remortgage from homepage quote type selector
- [x] Remove Remortgage from Step 1 transaction type question in wizard
- [x] Change "Are you using a mortgage to fund the purchase?" to Yes/No buttons only
- [x] Change "Is this a second home or additional property?" to "Are you moving home? / Are you purchasing an additional property?" with correct SDLT rates (moving home 3%, additional property 5%)
- [x] Add "or a Lifetime LISA?" to the Help to Buy ISA question
- [x] Change "How many people are purchasing?" to a dropdown 1-15
- [x] Upload firm logos to S3 CDN and store in database (PCS Legal, TQ Law, Easy Choice, Burtons)
- [x] Show firm logos on results page quote cards
- [x] Add "Email me the quote" as third CTA option on results page (alongside Instruct Directly and Request Callback)
- [x] Update business registration: ComparetheConveyancingMarket Ltd, 71-75 Shelton Street, Covent Garden, London WC2H 9JQ across all footers, Terms, Privacy Policy, and Contact pages

## Fee & Wizard Fixes Batch 3 (Feb 2026)
- [ ] AML check fee: multiply by number of purchasers (buyerCount)
- [ ] Land Registry fee: multiply by number of purchasers (buyerCount)
- [ ] Split "Help to Buy ISA or LISA?" into two separate wizard questions: (1) Are you using a Help to Buy ISA? (2) Are you using a Lifetime ISA (LISA)?
- [ ] Moving home / additional property question: remove "Neither" option and remove the 3%/5% surcharge labels from the answer buttons

## Lender Panel Filtering
- [ ] Add firm_lender_panels table to schema (firmId, lenderName)
- [ ] Seed Burtons Solicitors panel with 27 lenders from David J Foster & Co - London column
- [ ] Seed other 3 firms (PCS Legal, Easy Choice, TQ Law) with full standard lender list
- [ ] Update liveQuotes router to filter firms by chosen mortgage lender
- [ ] Update wizard to pass mortgageLender to results query
- [ ] Results page shows only firms that work with the chosen lender (with explanatory message)

## Fee & Wizard Corrections Batch 4
- [x] Add "Gifted Deposit" question (yes/no) and "How many gifts?" dropdown (0-10); multiply gifted deposit fee by count in results
- [x] Multiply bankruptcy searches by number of purchasers (same as AML)
- [x] Format all fee numbers to 2 decimal places (e.g. £3.00, £349.00, £3,773.00)
- [x] Initial payment on account = search packs + AML fees + £100 file opening fee (auto-calculated total shown)
- [x] Grand total: split into "Legal Fees Total" and "Stamp Duty Land Tax" as separate line items in the black box
- [x] Remove SRA sign/badge from results page

## Wizard Flow Corrections Batch 5
- [x] Sale & Purchase: split tenure into 2 questions (selling freehold/leasehold? + buying freehold/leasehold?)
- [x] Sale & Purchase: split price into 2 questions (sale price? + purchase price?)
- [x] Sale & Purchase: split postcode into 2 questions (sale postcode? + purchase postcode?)
- [x] Sale only: rename price question to "What is the sale price of the property?"
- [x] Sale only: add 2 new questions after mortgage question: "Are you selling via auction?" and "Is a limited company selling?"
- [x] Purchase and Sale & Purchase: add 2 new questions before buyerCount: "Are you purchasing via auction?" and "Is a limited company purchasing?"

## Stripe Payment Integration
- [x] Create server/stripe/products.ts with initial payment on account product definition
- [x] Add Stripe checkout session tRPC procedure (payment.createCheckoutSession)
- [x] Add Stripe webhook handler at /api/stripe/webhook (marks instruct request as paid on checkout.session.completed)
- [x] Update InstructModal to use Stripe Checkout instead of placeholder card form
- [x] Add payment success page at /payment/success
- [x] Add payment cancel page at /payment/cancel
- [x] Register /payment/success and /payment/cancel routes in App.tsx

## UI Fixes (Mar 2026)
- [x] Wizard category cards: improve contrast so they pop out from the dark background
- [x] How It Works page: add full navbar with nav tabs (How It Works, FAQs, Blog, Contact) + always visible
- [x] Privacy Policy page: auto-scroll to top on load
- [x] Terms & Conditions page: auto-scroll to top on load

## Contact Us & Address Fixes (Mar 2026)
- [x] Contact Us page: navbar disappears on scroll — made it fixed/sticky with scroll effect
- [x] Contact Us page: email address overflows the box — added break-words and min-w-0
- [x] Contact Us page: update email to info@comparetheconveyancingmarket.co.uk
- [x] Contact Us page: update registered address to Office 17699, 182-184 High Street North, East Ham, London E6 2JA
- [x] Contact Us page: scroll to top on load (footer link starts from bottom)
- [x] Update registered address on Terms & Conditions page
- [x] Update registered address on Privacy Policy page
- [x] Update registered address in Home.tsx footer
