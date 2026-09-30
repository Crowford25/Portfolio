import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? (isGitHubPages ? "/Portfolio" : "")).replace(/\/+$/, "");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (isGitHubPages ? "https://crowford25.github.io" + basePath + "/" : "http://localhost:3000" + basePath + "/");

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default config;
