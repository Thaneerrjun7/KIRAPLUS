import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pins the workspace root explicitly -- Turbopack (default dev bundler as
  // of Next 16) otherwise walks up looking for a lockfile and can pick up an
  // unrelated one outside this repo.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
};

export default nextConfig;
