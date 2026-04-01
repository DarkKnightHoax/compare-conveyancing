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

## Favicon & Logo (Mar 2026)
- [x] Generate new CC house+key logo in navy and gold
- [x] Create favicon.ico, apple-touch-icon.png, favicon-192.png, favicon-512.png
- [x] Wire favicon into index.html head tags
- [x] Replace Scale icon in all page navbars with new CC logo image

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

## Email, Phone & Landing Pages (Mar 2026)
- [x] Update phone number to 03301289488 across all pages
- [x] Wire Contact Us form to send notifyOwner notification on submission
- [x] Update registered address in server routers.ts emailQuote notification
- [x] Research top 3 competitors (reallymoving.com, conveyancingindex.co.uk, compareconveyancingquotes.co.uk)
- [x] Build SEO landing page 1: First Time Buyer Conveyancing (/first-time-buyer-conveyancing)
- [x] Build SEO landing page 2: Remortgage Conveyancing (/remortgage-conveyancing)
- [x] Build SEO landing page 3: Compare Conveyancing Fees Online (/compare-conveyancing-fees)
- [x] Register 3 new landing page routes in App.tsx
- [x] Improve wizard outer card container: gradient navy bg + gold border + deep shadow glow

## Internal Linking & Lender Filtering (Mar 2026)
- [x] Add landing page links to homepage footer Services column (4-column layout)
- [x] Add "Explore Our Services" block in BlogArticle.tsx linking to 3 landing pages
- [x] firm_lender_panels table already exists in drizzle schema (4 columns)
- [x] DB migration already applied (363 panel entries live)
- [x] Lender panel filtering already implemented in calculateLiveQuotes in db.ts
- [x] mortgageLender already passed from wizard sessionStorage to results query
- [x] Results page shows lender panel filter badge when mortgageLender is set

## Email Notifications to info@ (Mar 2026)
- [x] Install Resend SDK and store API key as secret
- [x] Create branded email helper (server/email.ts) with HTML templates for all 4 notification types
- [x] Send email to info@comparetheconveyancingmarket.co.uk on new lead (quote submitted)
- [x] Send email to info@comparetheconveyancingmarket.co.uk on new callback request
- [x] Send email to info@comparetheconveyancingmarket.co.uk on new instruct request
- [x] Send email to info@comparetheconveyancingmarket.co.uk on new contact form submission
- [x] Vitest test confirms Resend API key valid and email delivery working

## SEO Fixes (Mar 2026)
- [x] /get-quote: Add H1 heading (sr-only, crawlable by Google)
- [x] /get-quote: Add H2 heading (sr-only, crawlable by Google)

## GA4 Conversion Tracking (Mar 2026)
- [x] Create shared gtag analytics helper (client/src/lib/analytics.ts)
- [x] Event 1: fire "contact_form_submit" + "ads_conversion_SUBMIT_LEAD_FORM_1" when Contact Us form submitted
- [x] Event 2: fire "email_quote_request" + "ads_conversion_SUBMIT_LEAD_FORM_1" when "Email Me the Quote" clicked
- [x] Event 3: fire "instruct_directly" + "ads_conversion_SUBMIT_LEAD_FORM_1" when "Instruct Directly" clicked

## Bug Fixes (Mar 2026)
- [x] Results page not showing law firms — fixed (TiDB SSL connection issue)

## Critical Bug Fix (Mar 2026)
- [x] Fix TiDB Cloud database connection: added SSL (rejectUnauthorized: false), connection pool, and 15s connectTimeout to prevent hanging queries and results page showing 0 firms

## Landing Page Replacement (Mar 2026)
- [x] Replace /remortgage-conveyancing landing page with /sale-and-purchase-conveyancing (moving home / Sale & Purchase)
- [x] Update App.tsx route from remortgage-conveyancing to sale-and-purchase-conveyancing
- [x] Update Home.tsx footer Services links
- [x] Update BlogArticle.tsx "Explore Our Services" block
- [x] Delete RemortgageConveyancing.tsx (kept as dead file — no routes point to it)

## SEO & PPC Follow-up (Mar 2026)
- [x] 301 redirect: /remortgage-conveyancing → /sale-and-purchase-conveyancing (server-side)
- [x] New blog article: "Selling and Buying at the Same Time: Your Complete Guide" (/blog/selling-and-buying-at-the-same-time)
- [x] Update meta title/description on all 3 landing pages for Google Ads Quality Score (sale-and-purchase, first-time-buyer, compare-fees)

## Search Console, Internal Links & Ads (Mar 2026)
- [x] Add "Learn more about moving home" internal link from sale-and-purchase landing page hero to blog article
- [x] Submit /blog/selling-and-buying-at-the-same-time to Google Search Console (user to complete login step)
- [x] Add Moving Home ad group structured data / keyword meta to sale-and-purchase page (JSON-LD Service schema added)
- [x] Updated sitemap.xml: correct domain (www.comparetheconveyancingmarket.co.uk), all 3 landing pages at priority 0.9, new blog article, removed remortgage URL

## Lead Source Tracking (Mar 2026)
- [x] Add source fields to leads schema (utmSource, utmMedium, utmCampaign, utmContent, utmTerm, referrerUrl, landingPage)
- [x] Capture UTM params + referrer in quote wizard and pass to backend on lead creation
- [x] Display source/UTM data in admin All Leads panel lead cards (Traffic Source section in expanded lead card)

## Bug Fixes (Mar 2026)
- [x] Fix SDLT calculator: £600k standard purchase showing ~£51k instead of ~£20k (root cause: Moving home option incorrectly set isSecondHome:true, triggering +5% surcharge; fixed wizard question)
- [x] Display ALL lead form answers in admin All Leads expanded card (Contact Details, Property Details, Buyer Situation, Quoted Fees & Action, Traffic Source sections)

## Fee & Wizard Fixes (Mar 2026 batch 6)
- [x] Fix dual-selection bug: first two options on "Which best describes your situation?" both select simultaneously (added isMovingHome field to distinguish options 1 & 2)
- [x] Search Pack (Local, Drainage & Environmental) always £399 across all firms (hardcoded in server/db.ts)
- [x] Initial payment on account fixed at £530 for all firms (hardcoded in QuoteResults.tsx InstructModal)
- [x] TQ Law excluded from results when isNewBuild=true or tenure=leasehold (filter in calculateLiveQuotes)

## Quote Reference & Shareable URL (Mar 2026)
- [x] Add referenceNumber field to leads schema (e.g. CCM-2026-00042)
- [x] Build saved quote page at /quote/:ref showing personalised results
- [x] Email customer their reference number + quote link on lead creation
- [x] Email info@comparetheconveyancingmarket.co.uk with reference + lead details + quote link
- [x] Display reference number on results page after quote is generated (summary bar, clickable link)

## Quote Email Fixes (Mar 2026)
- [x] Fix customer quote email not delivering: changed FROM to noreply@comparetheconveyancingmarket.co.uk (requires Resend domain verification — DNS records provided to user)
- [x] Add full fee breakdown table to both emails (customer + info@) via buildFeeBreakdownHtml helper
- [x] Add full fee breakdown to saved quote page at /quote/:ref (FeeBreakdownTable component reads quoteSnapshot)
- [x] Pass quoteSnapshot from QuoteResults to backend via leads.saveSnapshot mutation (fires after quotes.getLive loads)
- [x] Move email sending from leads.create to leads.saveSnapshot so emails include fee breakdown

## Bug Fix (Mar 2026)
- [x] Fix regression: info@comparetheconveyancingmarket.co.uk no longer receives lead notification email when form is submitted — restored sendNewLeadEmail to leads.create so info@ gets notified immediately; saveSnapshot still sends customer email + fee-breakdown update to info@ once quotes load

## Critical Bug Fix (Mar 2026)
- [x] Fix email delivery broken for all recipients — root cause was saveSnapshot useEffect firing before contactDetails was loaded from sessionStorage (email was empty string, backend skipped sending). Fixed by adding contactDetails and answers to dependency array and adding early return guard. Also added proper error logging to all email .catch() calls.

## Email & Fee Breakdown Fixes (Mar 2026)
- [x] Fix customer email not being received — root cause was production running old code; fix deployed via publish. Also fixed saveSnapshot timing bug (contactDetails not loaded from sessionStorage when effect fired).
- [x] Expand fee breakdown in emails and saved quote page to show ALL line items: base legal fee, supplements, VAT, total inc VAT, all disbursements (AML, bankruptcy, search pack, bank transfer, file opening), SDLT, Land Registry, grand total — matching results page exactly

## Outstanding Issues (Mar 2026)
- [x] Customer email fix: root cause was navigate("/results") firing BEFORE onSuccess wrote quoteRef to sessionStorage. Results page mounted with null quoteRef so saveSnapshot never fired. Fixed by moving navigate() inside onSuccess callback.
- [x] All firms confirmed in emails and saved quote page: buildFeeBreakdownHtml iterates all firms with quotes.map(); FeeBreakdownTable in SavedQuote.tsx also iterates all firms. Best Value badge only on first (cheapest) firm.

## UX Fix (Mar 2026)
- [x] Disable submit button immediately on first click, show loading spinner ("Finding Your Quotes..."), prevent duplicate lead creation from multiple clicks via isPending guard in goNext and disabled prop on button

## Fee & Rule Corrections (Mar 2026)
- [x] Remove Search Pack for sale transactions
- [x] Easy Choice: base legal fee sale £1200, purchase £999 (flat rates)
- [x] Burton's: file opening fee sale £550, base legal fee purchase £895, base legal fee sale £1400
- [x] PCS Legal: file opening fee sale £119, base legal fee sale £560
- [x] TQ Law: file opening fee sale £394, base legal fee sale £499
- [x] Mortgage redemption fee (sale, has mortgage on property) fixed at £100
- [x] TQ Law: show for leasehold sales but NOT leasehold purchases (excludeLeaseholdPurchase flag)
- [x] Phone number validation: UK phone number regex (07xxx, 01xxx, +44xxx) — rejects random numbers like 12345678
- [x] Replaced Premier Property Law, Clarity, Meridian with Burton's and TQ Law as active firms

## Bug Fixes (Mar 2026)
- [ ] Search Pack still showing for sale transactions on results page (server-side calculation not updated)
- [ ] File opening fees not updated on results page (server-side calculation not updated)

## Fee Engine & DB Fixes (Mar 2026)
- [x] Search Pack removed from sale transactions (was hardcoded unconditionally in calculateLiveQuotes, now purchase/sale_purchase only)
- [x] File opening fee column added to schema (fileOpeningFee), migrated, and now read in calculateLiveQuotes per firm
- [x] Mortgage Redemption fixed at £100 flat (was £149)
- [x] TQ Law leasehold rule fixed: excludes leasehold PURCHASE only, not leasehold sale
- [x] All firm sale fees and file opening fees updated in DB: Easy Choice sale £1200, PCS Legal sale £560 + £119 file opening, Burton's sale £1400 + £550 file opening, TQ Law sale £499 + £394 file opening
- [x] Purchase base fees updated to flat £999 (Easy Choice, PCS Legal, TQ Law) and £895 (Burton's)
- [x] UK phone number validation in wizard (07xxx, 01xxx, +44xxx — rejects random numbers)

## Bug Fixes Batch (Mar 2026)
- [x] File opening fees now show correctly in Instruct modal (read from firm.disbursements array, not hardcoded)
- [x] Search Pack removed from Instruct modal initial payment for sale transactions (isSale check, dynamic breakdown label)

## Fee Display Fix (Mar 2026)
- [x] File Opening Fee: removed from results page fee breakdown and grand total; passed as separate field (firm.fileOpeningFee) used only in Instruct Directly modal initial payment calculation

## TQ Law & Instruct Form Fixes (Mar 2026)
- [x] TQ Law sale: add leasehold supplement fee to fee breakdown (same as other 3 firms) — already correct in DB (£149)
- [x] TQ Law sale: fix AML fee to £49 (already correct in DB)
- [x] TQ Law sale: fix file opening fee to £175 (already correct in DB)
- [x] TQ Law sale: initial payment on account in Instruct modal should be £224 (£175 file opening + £49 AML) — calculated dynamically
- [x] Instruct Directly form: add Date of Birth field
- [x] Instruct Directly form: add Current Residential Address field
- [x] Instruct Directly form: add Property Address field (tailored label — "property being purchased" vs "property being sold" based on transaction type)
- [x] Instruct Directly form: add note under initial payment "This payment is deducted from the final sum on completion"

## Land Registry Fee Correction (Mar 2026)
- [x] Update Land Registry fees for all purchase/sale_purchase bands across all firms to portal column values: £20 (0-£80k), £40 (£80k-£100k), £100 (£100k-£200k), £150 (£200k-£500k), £295 (£500k-£1m), £500 (£1m+) — already correct via calcLandRegistry function

## LR Fee & Saved Quote Instruct Form (Mar 2026)
- [x] Remove buyer-count multiplier from Land Registry fee (fee is per transaction, not per person)
- [x] Add Instruct Directly modal with full form + Stripe payment to saved quote page (/quote/:ref)

## Sale Initial Payment Fix (Mar 2026)
- [x] Fix: initial payment on account for sale transactions must include file opening fee (not just AML checks) — root cause was fileOpeningFee missing from quote snapshot; now included

## Instruct Modal Total Fix (Mar 2026)
- [x] Instruct modal fee summary: "Total legal fees (inc. VAT)" row renamed to "Grand total" and now shows the full grand total (legal fees + disbursements + SDLT + LR) on both results page and saved quote page

## Multi-Fix Batch (Mar 2026)
- [x] Admin panel: store and display sale price for sale_purchase leads (salePropertyValue column added to schema + displayed in admin)
- [x] Results page + saved quote page: separate purchase fee breakdown and sale fee breakdown for sale_purchase transactions (purchaseBreakdown/saleBreakdown added to fee engine)
- [x] Results page firm card heading: grand total in heading must match the grand total figure (card header now shows grandTotal as the big number)
- [x] Fee editor: non-Burton firms restructured to 8 fine price bands matching LR fee boundaries (0-80k, 80k-100k, 100k-200k, 200k-300k, 300k-500k, 500k-600k, 600k-1m, 1m+)

## File Opening Fee & Layout Fixes (Mar 2026)
- [x] Instruct Directly modal (purchase/sale_purchase): fixed £150 file opening fee shown as separate line above "deducted from final sum" note; initial payment = search + AML + £150 file opening
- [x] File opening fee does NOT appear in full fee breakdown tab on results page
- [x] SavedQuote page: sale/purchase split layout copied from results page (two leg panels + combined grand total)
- [x] Admin fee editor: File Opening Fee editable field added per transaction type for each firm (fileOpeningFee column in DB, accepted in upsertFeeStructure router)

## Instruct Modal & Email Fixes (Mar 2026)
- [x] Instruct Directly modal (sale_purchase): shows separate purchase initial payment (search £399 + AML £49 + file opening £150 = £598) and sale initial payment (AML £49 + file opening £150 = £199), with combined total
- [x] Instruct Directly modal: AML always £49 flat, file opening always £150 flat across all firms and transaction types
- [x] Instruct Directly modal: applicant count dropdown (1–10) added above first name/surname fields
- [x] Quote emails (customer + info@): buildFeeBreakdownHtml updated to show two-leg purchase/sale split layout for sale_purchase transactions, matching results page

## AML Fee Fix (Mar 2026)
- [x] Fix AML fee to flat £49 per person across ALL firms and ALL transaction types (purchase, sale, sale_purchase) — TQ Law had £30 for some bands, now all 16 firm/type combinations show £49

## Admin Instructions Tab - Full Customer Details (Apr 2026)
- [x] Show all Instruct Directly fields in admin Instructions tab: date of birth, current residential address, property address, applicant count, phone, email, firm name, payment amount, payment status, Stripe ID — expandable card layout
