import { mkdir, writeFile } from "node:fs/promises";
import { callDataApi } from "../server/_core/dataApi.ts";

const domain = "www.comparetheconveyancingmarket.co.uk";
const period = { start_date: "2026-07", end_date: "2026-07", main_domain_only: "false" };

const [trafficSources, globalRank] = await Promise.all([
  callDataApi("Similarweb/get_traffic_sources_desktop", {
    pathParams: { domain },
    query: { country: "world", granularity: "monthly", ...period },
  }),
  callDataApi("Similarweb/get_global_rank", {
    pathParams: { domain },
    query: period,
  }),
]);

await mkdir("analysis", { recursive: true });
await writeFile(
  "analysis/seo-current-audit.json",
  JSON.stringify(
    {
      domain,
      period: "2026-07",
      endpoints: ["Similarweb/get_traffic_sources_desktop", "Similarweb/get_global_rank"],
      trafficSources,
      globalRank,
    },
    null,
    2,
  ),
);

console.log("Saved low-credit SEO audit to analysis/seo-current-audit.json");
