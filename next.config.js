import withMDX from "@next/mdx";

// MDX support for both .mdx and .md files
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/maps/api/staticmap**',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  // Add any additional Next.js config options here
  // experimental: { appDir: true }, // Uncomment if you use app directory
};

export default withMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // rehypePlugins: [],
    // remarkPlugins: [],
    // Add your MDX plugin options if needed
  }
})(nextConfig);