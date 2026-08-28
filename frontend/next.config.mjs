import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export -- this app is pure client-side (no server actions, API
  // routes, middleware, or next/image), so it deploys as plain static files
  // via Cloudflare Pages Direct Upload rather than needing an edge-runtime
  // adapter. Produces frontend/out/. See DEPLOYMENT-CHECKLIST.md (untracked).
  output: "export",
  // Pins the workspace root explicitly -- Turbopack (default dev bundler as
  // of Next 16) otherwise walks up looking for a lockfile and can pick up an
  // unrelated one outside this repo.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
};

export default nextConfig;
