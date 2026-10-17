import { BLOG_ARTICLES } from "../../client/src/lib/blogData";

const publicPaths = new Set([
  "/", "/get-quote", "/results", "/how-it-works", "/contact",
  "/privacy-policy", "/terms", "/admin", "/admin/login", "/faq", "/blog",
  "/payment/success", "/payment/cancel", "/first-time-buyer-conveyancing",
  "/sale-and-purchase-conveyancing", "/compare-conveyancing-fees",
  "/uk-conveyancing-cost-guide", "/seller-conveyancing-checklist",
]);

const metadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Compare the Conveyancing Market | Free Conveyancing Quotes",
    description: "Compare itemised conveyancing quotes from regulated firms for buying or selling in England. Access competitive rates when you instruct through us.",
  },
  "/compare-conveyancing-fees": {
    title: "Compare Conveyancing Fees Online | Transparent Solicitor Quotes",
    description: "Compare transparent conveyancing fees online from SRA & CLC regulated UK solicitors. See itemised legal fees, search packs, and disbursements instantly.",
  },
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]!);
}

/** Preserve app routes, but send an actual 404 for unknown paths. */
export function pageResponse(template: string, pathname: string) {
  pathname = pathname.replace(/\/+$/, "") || "/";
  const article = BLOG_ARTICLES.find(item => pathname === `/blog/${item.slug}`);
  const known = publicPaths.has(pathname) || !!article || /^\/quote\/[^/]+$/.test(pathname);
  const privatePage = /^\/(admin|quote|payment)(\/|$)/.test(pathname) || pathname === "/results";
  let html = template;
  const page = metadata[pathname] || (article && {
    title: article.metaTitle, description: article.metaDescription,
  });
  if (page) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
    const values: Record<string, string> = {
      description: page.description, "og:title": page.title,
      "og:description": page.description, "twitter:title": page.title,
      "twitter:description": page.description,
      "og:url": `https://www.comparetheconveyancingmarket.co.uk${pathname}`,
      "twitter:url": `https://www.comparetheconveyancingmarket.co.uk${pathname}`,
    };
    html = html.replace(/<meta\s+[^>]*>/g, tag => {
      const key = tag.match(/(?:name|property)="([^"]+)"/)?.[1];
      return key && values[key] ? tag.replace(/content="[^"]*"/, `content="${escapeHtml(values[key])}"`) : tag;
    });
  }
  if (known && !privatePage) {
    html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="https://www.comparetheconveyancingmarket.co.uk${escapeHtml(pathname)}" />`);
  } else {
    html = html.replace(/<link rel="canonical"[^>]*>/, "");
    html = html.replace(/name="robots" content="[^"]*"/, 'name="robots" content="noindex, follow"');
  }
  return { html, status: known ? 200 : 404, noindex: !known || privatePage };
}
