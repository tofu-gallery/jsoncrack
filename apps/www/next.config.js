// Modified by Tofu for the Tofu app gallery; TOFU.md at the repository root lists every change.
// - No `output: "export"`: `next build` makes a standard Next.js app, which `next start` and
//   Tofu's Next.js hosting serve. Upstream exports a static site to `out/` instead.
// - `nextjs-google-analytics` resolves to `shims/nextjs-google-analytics.ts`, a no-op, so a copy
//   ships no Google Analytics code. `transpilePackages` makes the server bundle take the same
//   alias; without it Next.js loads the real package on the server.
const path = require("path");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  transpilePackages: ["nextjs-google-analytics"],
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    resolveAlias: {
      fs: {
        browser: "./shims/empty.ts",
      },
      "nextjs-google-analytics": "./shims/nextjs-google-analytics.ts",
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false };
    config.resolve.alias = {
      ...config.resolve.alias,
      "nextjs-google-analytics$": path.join(__dirname, "shims/nextjs-google-analytics.ts"),
    };
    config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    config.experiments = { asyncWebAssembly: true, layers: true };

    if (!isServer) {
      config.output.environment = { ...config.output.environment, asyncFunction: true };
    }

    return config;
  },
};

const configExport = () => {
  if (process.env.ANALYZE === "true") return withBundleAnalyzer(config);
  return config;
};

module.exports = configExport();
