// next/link applies basePath itself; plain image URLs and anchors need this helper.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");

export function withBasePath(path: string): string {
  if (!basePath || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === basePath || path.startsWith(basePath + "/") || path.startsWith(basePath + "?") || path.startsWith(basePath + "#")) return path;
  return basePath + path;
}

export function withoutBasePath(pathname: string): string {
  if (basePath && pathname === basePath) return "/";
  if (basePath && pathname.startsWith(basePath + "/")) return pathname.slice(basePath.length);
  return pathname;
}
