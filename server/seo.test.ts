import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("SEO foundation", () => {
  it("exposes crawlable static metadata for the canonical domain", () => {
    const html = readProjectFile("client/index.html");

    expect(html).toContain('name="robots" content="index, follow, max-image-preview:large"');
    expect(html).toContain('rel="canonical" href="https://www.comparetheconveyancingmarket.co.uk/"');
    expect(html).toContain('property="og:url" content="https://www.comparetheconveyancingmarket.co.uk/"');
    expect(html).toContain('name="twitter:image"');
  });

  it("points crawlers to the live sitemap and protects private routes", () => {
    const robots = readProjectFile("client/public/robots.txt");

    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain("Disallow: /api/");
    expect(robots).toContain("Sitemap: https://www.comparetheconveyancingmarket.co.uk/sitemap.xml");
  });

  it("lists the improved landing pages in the sitemap with current lastmod dates", () => {
    const sitemap = readProjectFile("client/public/sitemap.xml");

    for (const path of [
      "/",
      "/first-time-buyer-conveyancing",
      "/sale-and-purchase-conveyancing",
      "/compare-conveyancing-fees",
    ]) {
      expect(sitemap).toContain(`https://www.comparetheconveyancingmarket.co.uk${path}`);
    }

    expect(sitemap).toContain("<lastmod>2026-08-11</lastmod>");
  });
});
