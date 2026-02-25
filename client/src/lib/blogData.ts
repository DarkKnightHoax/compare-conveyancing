/**
 * Blog article data for Compare the Conveyancing Market
 * Each article is fully written, SEO-optimised, and includes metadata
 */

export interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  readTime: string;
  publishDate: string;
  excerpt: string;
  sections: Array<{ heading: string; body: string }>;
  relatedSlugs: string[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "how-much-does-conveyancing-cost",
    title: "How Much Does Conveyancing Cost in 2025?",
    metaTitle: "How Much Does Conveyancing Cost in 2025? | Compare the Conveyancing Market",
    metaDescription: "A complete breakdown of conveyancing costs in 2025 — legal fees, disbursements, SDLT, and Land Registry fees for buyers, sellers, and remortgages.",
    category: "Costs & Fees",
    readTime: "6 min read",
    publishDate: "12 February 2025",
    excerpt: "Conveyancing costs can feel opaque, but they follow a clear structure. This guide breaks down every fee you should expect to pay — and how to make sure you are not overpaying.",
    sections: [
      {
        heading: "What Does Conveyancing Cost in 2025?",
        body: "The total cost of conveyancing is made up of two distinct elements: legal fees charged by your solicitor or licensed conveyancer, and disbursements — third-party costs paid on your behalf. For a typical freehold purchase at £300,000, you can expect to pay between £1,500 and £2,500 in total, including all disbursements and VAT, but excluding Stamp Duty Land Tax (SDLT).",
      },
      {
        heading: "Legal Fees",
        body: "Legal fees are the amount your conveyancer charges for their professional time. For a straightforward freehold purchase, these typically range from £800 to £1,500 including VAT. Leasehold properties attract higher fees — usually an additional £150 to £350 — because of the extra work involved in reviewing the lease and dealing with the freeholder. New build properties also carry a premium, often £200 to £500 more, due to the additional complexity of off-plan contracts and developer enquiries.",
      },
      {
        heading: "Disbursements: What Are They and How Much Do They Cost?",
        body: "Disbursements are fixed third-party costs that your conveyancer pays on your behalf. The main disbursements for a property purchase are: Local Authority Search (£100–£300 depending on the local council), Drainage and Water Search (£30–£80), Environmental Search (£30–£60), Land Registry title register copies (£6–£12), and an electronic bank transfer fee (around £30). In total, disbursements for a standard purchase typically add £300 to £600 to your bill.",
      },
      {
        heading: "Land Registry Fees",
        body: "When you buy a property, your solicitor must register your ownership at HM Land Registry. The registration fee is set by the government and is based on the purchase price. For a property costing £300,000, the Land Registry fee is £150 for a first registration and £135 for a subsequent transfer. For properties over £500,000, the fee rises to £295. These fees are paid as disbursements.",
      },
      {
        heading: "Stamp Duty Land Tax (SDLT)",
        body: "SDLT is the largest additional cost for most buyers. As of 2025, first-time buyers pay no SDLT on the first £425,000 of a purchase price, then 5% on the portion between £425,001 and £625,000. For non-first-time buyers, the nil-rate threshold is £250,000, with 5% payable on the portion between £250,001 and £925,000. Second home buyers and buy-to-let investors pay an additional 3% surcharge on the full purchase price. Our quote tool automatically calculates your SDLT liability.",
      },
      {
        heading: "Sale Conveyancing Costs",
        body: "If you are selling a property, your conveyancing costs are generally lower than for a purchase because there are fewer disbursements. Legal fees for a sale typically range from £600 to £1,200 including VAT. The main disbursements are the Land Registry title register copy (£6), electronic transfer fee (around £30), and any redemption fee if you have a mortgage to redeem (usually £20–£50).",
      },
      {
        heading: "Remortgage Conveyancing Costs",
        body: "Remortgage conveyancing is the simplest and cheapest type of transaction. Legal fees typically range from £300 to £700 including VAT. Many lenders offer a free legal service for straightforward remortgages, though using your own solicitor gives you independent advice. The main disbursements are Land Registry search fees (around £6) and the registration fee for the new charge (£20–£910 depending on the mortgage value).",
      },
      {
        heading: "How to Get the Best Conveyancing Price",
        body: "The most effective way to ensure you are getting a fair price is to compare quotes from multiple regulated firms. Our free comparison tool generates instant, itemised quotes from SRA and CLC regulated conveyancers, so you can see exactly what you will pay before you commit. The prices on our platform are exclusive rates negotiated for clients who instruct through us — they are not available if you approach firms directly.",
      },
    ],
    relatedSlugs: ["what-is-conveyancing", "first-time-buyer-conveyancing-guide"],
  },
  {
    slug: "what-is-conveyancing",
    title: "What Is Conveyancing and How Does It Work?",
    metaTitle: "What Is Conveyancing? A Complete Guide | Compare the Conveyancing Market",
    metaDescription: "Understand exactly what conveyancing is, who does it, and what happens at each stage — from instructing a solicitor to receiving the keys on completion day.",
    category: "Conveyancing Basics",
    readTime: "7 min read",
    publishDate: "5 February 2025",
    excerpt: "Conveyancing is the legal backbone of every property transaction. This guide explains exactly what it involves, who does it, and what to expect at each stage of the process.",
    sections: [
      {
        heading: "What Is Conveyancing?",
        body: "Conveyancing is the legal process of transferring ownership of a property from one person to another. It encompasses all the legal and administrative work required to ensure that a property sale or purchase is valid, binding, and properly recorded. The process is handled by a licensed conveyancer or solicitor, who acts on your behalf throughout the transaction.",
      },
      {
        heading: "Who Can Do Conveyancing?",
        body: "In England and Wales, conveyancing must be carried out by a regulated legal professional. There are two types: solicitors, who are regulated by the Solicitors Regulation Authority (SRA) and can handle all types of legal work; and licensed conveyancers, who are specialists in property law regulated by the Council for Licensed Conveyancers (CLC). Both are equally qualified to handle residential conveyancing. All firms on the Compare the Conveyancing Market panel are regulated by either the SRA or CLC.",
      },
      {
        heading: "Stage 1: Instructing Your Conveyancer",
        body: "The process begins when you instruct a conveyancer — ideally as soon as your offer is accepted (for a purchase) or as soon as you decide to sell. Your conveyancer will send you a client care letter setting out their terms of engagement and fees, and will ask you to verify your identity under anti-money laundering regulations. They will also ask you to complete a property information form (TA6) and fittings and contents form (TA10) if you are selling.",
      },
      {
        heading: "Stage 2: Searches and Enquiries",
        body: "Your conveyancer will order a set of property searches from various authorities to uncover any issues that might affect the property. The standard searches are the Local Authority Search (planning history, road adoptions, enforcement notices), Drainage and Water Search (public sewers, water supply), and Environmental Search (flood risk, contaminated land). They will also review the title register and raise enquiries with the seller's solicitor about anything that needs clarification.",
      },
      {
        heading: "Stage 3: Mortgage Offer and Report on Title",
        body: "Once searches are back and enquiries are resolved, your conveyancer will review your mortgage offer (if applicable) and prepare a report on title — a summary of the legal findings about the property. They will ask you to sign the contract and transfer deed, and will request the deposit funds from you in readiness for exchange.",
      },
      {
        heading: "Stage 4: Exchange of Contracts",
        body: "Exchange of contracts is the pivotal moment in the transaction. Both parties sign identical contracts and they are exchanged between solicitors. At this point, the transaction becomes legally binding — neither party can withdraw without significant financial penalty. A completion date is agreed at exchange, usually 1 to 4 weeks later. You will also pay your deposit (typically 10% of the purchase price) at exchange.",
      },
      {
        heading: "Stage 5: Completion",
        body: "On completion day, your conveyancer transfers the balance of the purchase price to the seller's solicitor. Once the funds are received, the seller's solicitor authorises the release of keys and you can collect them from the estate agent. Your conveyancer will then pay any Stamp Duty Land Tax due to HMRC and register your ownership at HM Land Registry.",
      },
      {
        heading: "How Long Does Conveyancing Take?",
        body: "The average residential conveyancing transaction takes 8 to 12 weeks from the point an offer is accepted to completion. However, this can vary considerably. A straightforward freehold purchase with no chain can complete in as little as 4 to 6 weeks. A complex leasehold purchase in a long chain can take 16 weeks or more. The main causes of delay are slow local authority searches, unresolved enquiries, mortgage offer delays, and chain complications.",
      },
    ],
    relatedSlugs: ["how-much-does-conveyancing-cost", "leasehold-vs-freehold"],
  },
  {
    slug: "first-time-buyer-conveyancing-guide",
    title: "First-Time Buyer Conveyancing: A Complete Guide",
    metaTitle: "First-Time Buyer Conveyancing Guide 2025 | Compare the Conveyancing Market",
    metaDescription: "Everything first-time buyers need to know about conveyancing — from instructing a solicitor and property searches to SDLT relief and getting the keys.",
    category: "First-Time Buyers",
    readTime: "8 min read",
    publishDate: "28 January 2025",
    excerpt: "Buying your first home is one of the most significant financial decisions you will ever make. This guide walks you through every step of the conveyancing process so you know exactly what to expect.",
    sections: [
      {
        heading: "Why Conveyancing Matters for First-Time Buyers",
        body: "As a first-time buyer, the conveyancing process can feel overwhelming — it is full of unfamiliar terminology and involves large sums of money. But understanding what your solicitor is doing and why is one of the best ways to reduce stress and avoid delays. This guide explains every stage of the process in plain English.",
      },
      {
        heading: "When Should You Instruct a Conveyancer?",
        body: "You should instruct a conveyancer as soon as your offer is accepted — or even before, so you are ready to move quickly. The earlier you instruct, the sooner your solicitor can begin the background work. Delays at the start of the process often push back the entire timeline. Use our free comparison tool to get quotes from regulated firms and instruct online in minutes.",
      },
      {
        heading: "Stamp Duty Relief for First-Time Buyers",
        body: "As a first-time buyer in England, you benefit from Stamp Duty Land Tax (SDLT) relief. As of 2025, you pay no SDLT on the first £425,000 of a purchase price, and 5% on the portion between £425,001 and £625,000. If the purchase price exceeds £625,000, you lose the first-time buyer relief entirely and pay standard SDLT rates. Your conveyancer will calculate your SDLT liability and pay it to HMRC on your behalf at completion.",
      },
      {
        heading: "Help to Buy ISA and Lifetime ISA",
        body: "If you have been saving into a Help to Buy ISA or a Lifetime ISA (LISA), your conveyancer will need to claim the government bonus on your behalf. For a Help to Buy ISA, your solicitor requests the bonus from your ISA provider after exchange of contracts and applies it to the purchase price at completion. For a LISA, the process is slightly different — your conveyancer will guide you through the specific steps required.",
      },
      {
        heading: "Understanding Property Searches",
        body: "Property searches are one of the most important parts of the conveyancing process for first-time buyers. The Local Authority Search reveals any planning permissions, enforcement notices, or road schemes that could affect the property. The Drainage and Water Search confirms whether the property is connected to the public sewer and water mains. The Environmental Search checks for flood risk, contaminated land, and ground stability issues. Your conveyancer will order these searches and explain any issues they reveal.",
      },
      {
        heading: "What Is a Mortgage Valuation vs a Survey?",
        body: "Many first-time buyers confuse a mortgage valuation with a property survey. A mortgage valuation is carried out by your lender to confirm the property is worth the amount you are borrowing — it is not a detailed inspection of the property's condition. A survey is an independent inspection of the property carried out on your behalf. For a first-time buyer purchasing an older property, a HomeBuyer Report or full structural survey is strongly recommended.",
      },
      {
        heading: "Exchange and Completion: What to Expect",
        body: "Exchange of contracts is the point at which the transaction becomes legally binding. You will need to pay your deposit — typically 10% of the purchase price — at exchange. Your conveyancer will confirm the completion date, which is usually 1 to 4 weeks after exchange. On completion day, your solicitor transfers the balance of the purchase price and you collect the keys from the estate agent. Congratulations — you are a homeowner.",
      },
      {
        heading: "Common Pitfalls for First-Time Buyers",
        body: "The most common mistakes first-time buyers make in the conveyancing process are: instructing a conveyancer too late, choosing a firm based on price alone without checking their reviews and regulation status, failing to respond promptly to requests for information or documents, and not budgeting for all the costs involved. Using a comparison service like ours helps you find a regulated, well-reviewed firm at a competitive price — giving you the best possible start.",
      },
    ],
    relatedSlugs: ["how-much-does-conveyancing-cost", "what-is-conveyancing"],
  },
  {
    slug: "leasehold-vs-freehold",
    title: "Leasehold vs Freehold: What Every Buyer Needs to Know",
    metaTitle: "Leasehold vs Freehold Property Explained | Compare the Conveyancing Market",
    metaDescription: "Understand the key differences between leasehold and freehold property ownership, the extra costs involved, and what to check before you buy a leasehold property.",
    category: "Property Law",
    readTime: "6 min read",
    publishDate: "20 January 2025",
    excerpt: "Whether a property is freehold or leasehold has significant implications for your ownership rights, ongoing costs, and conveyancing fees. Here is everything you need to know before you buy.",
    sections: [
      {
        heading: "What Is Freehold?",
        body: "When you buy a freehold property, you own the building and the land it stands on outright and indefinitely. There is no landlord, no ground rent, and no service charge. Freehold is the simpler and more desirable form of ownership. Most houses in England and Wales are sold freehold.",
      },
      {
        heading: "What Is Leasehold?",
        body: "When you buy a leasehold property, you own the right to occupy the property for a fixed term — the length of the lease. The land and building are owned by a freeholder (also called the landlord). Leasehold ownership is common for flats and some new-build houses. You will typically pay an annual ground rent to the freeholder and a service charge to cover the maintenance of communal areas and the building.",
      },
      {
        heading: "How Long Should a Lease Be?",
        body: "The length of the remaining lease is one of the most important factors to consider when buying a leasehold property. Mortgage lenders typically require a minimum of 70 to 85 years remaining on the lease at the time of purchase. As a lease falls below 80 years, it becomes significantly harder to sell and more expensive to extend. If you are buying a leasehold property, always check the remaining lease length and factor in the cost of a lease extension if necessary.",
      },
      {
        heading: "Ground Rent and Service Charges",
        body: "Ground rent is an annual payment made by the leaseholder to the freeholder. Following the Leasehold Reform (Ground Rent) Act 2022, ground rents on new residential leases in England and Wales are capped at a 'peppercorn' (effectively zero). However, many existing leases still have ground rents that can escalate over time — your solicitor will review the ground rent provisions carefully. Service charges cover the cost of maintaining communal areas, the building structure, and buildings insurance. These can vary significantly and should be reviewed before you buy.",
      },
      {
        heading: "Leasehold Conveyancing: Extra Costs and Complexity",
        body: "Buying a leasehold property involves more legal work than a freehold purchase. Your conveyancer must review the lease (which can run to hundreds of pages), obtain a management information pack from the freeholder or managing agent (which typically costs £100–£350), and deal with notice of assignment and notice of charge after completion. These additional steps mean leasehold conveyancing typically costs £150 to £350 more than a comparable freehold transaction.",
      },
      {
        heading: "Extending a Lease",
        body: "If the lease on a property you own or are buying is short, you may want to extend it. Under the Leasehold Reform, Housing and Urban Development Act 1993, qualifying leaseholders have the right to extend their lease by 90 years and reduce the ground rent to zero. The cost of a lease extension depends on the property value, the current ground rent, and the number of years remaining. Your solicitor can advise on the likely cost and process.",
      },
      {
        heading: "Leasehold Reform: What Is Changing?",
        body: "The UK government has been reforming leasehold law in recent years. The Leasehold and Freehold Reform Act 2024 introduced significant changes, including making it easier and cheaper for leaseholders to extend their leases, buy their freehold, and take over management of their building. These reforms are being phased in — your conveyancer will advise on how they affect your specific transaction.",
      },
      {
        heading: "Should You Buy Leasehold?",
        body: "Leasehold ownership is not inherently problematic — millions of people own leasehold flats and are perfectly happy with their ownership. The key is to go in with your eyes open. Before you exchange contracts on a leasehold property, make sure you understand the lease length, ground rent, service charges, and the relationship with the freeholder. Your conveyancer will review all of this and flag any concerns before you commit.",
      },
    ],
    relatedSlugs: ["what-is-conveyancing", "how-much-does-conveyancing-cost"],
  },
];
