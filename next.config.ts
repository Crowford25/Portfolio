import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/Portfolio" : "",
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default config;