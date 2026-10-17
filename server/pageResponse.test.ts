import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pageResponse } from "./_core/pageResponse";

const template = readFileSync(new URL("../client/index.html", import.meta.url), "utf8");
describe("server page responses", () => {
  it("returns noindex 404s for unknown routes rather than a successful homepage", () => {
    for (const path of ["/$", "/missing", "/blog/missing", "/missing.js"]) {
      const result = pageResponse(template, path);
      expect(result.status).toBe(404);
      expect(result.noindex).toBe(true);
      expect(result.html).not.toContain('rel="canonical"');
    }
  });
  it("preserves application routes and keeps private quote pages out of search", () => {
    expect(pageResponse(template, "/get-quote").status).toBe(200);
    const quote = pageResponse(template, "/quote/CCM-2026-00453");
    expect(quote.status).toBe(200);
    expect(quote.noindex).toBe(true);
    expect(quote.html).toContain('name="robots" content="noindex, follow"');
  });
  it("serves canonical and social metadata before JavaScript executes", () => {
    const { html } = pageResponse(template, "/compare-conveyancing-fees");
    expect(html).toContain('<title>Compare Conveyancing Fees Online | Transparent Solicitor Quotes</title>');
    expect(html).toContain('name="twitter:url" content="https://www.comparetheconveyancingmarket.co.uk/compare-conveyancing-fees"');
    expect(html).toContain('rel="canonical" href="https://www.comparetheconveyancingmarket.co.uk/compare-conveyancing-fees"');
  });
  it("recognizes published articles without accepting arbitrary blog slugs", () => {
    expect(pageResponse(template, "/blog/selling-and-buying-at-the-same-time").status).toBe(200);
  });
});
