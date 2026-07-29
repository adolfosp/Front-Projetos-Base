import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    catalogo: {
      stale: 60,
      revalidate: 300,
      expire: 3600,
    },
    configuracoes: {
      stale: 300,
      revalidate: 3600,
      expire: 86400,
    },
  },
};

export default nextConfig;
