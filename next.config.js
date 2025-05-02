/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Disable runtime configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Add transpilePackages for Radix UI
  transpilePackages: [
    "@radix-ui/react-progress",
    "@radix-ui/react-dialog",
    "@radix-ui/react-slot",
    "@radix-ui/react-label",
    "@radix-ui/react-toggle",
    "@radix-ui/react-tabs",
    "@radix-ui/react-popover",
    "@radix-ui/react-context-menu",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-toast",
    "@radix-ui/react-aspect-ratio",
    "@radix-ui/react-menubar",
    "@radix-ui/react-select",
    "@radix-ui/react-switch",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-hover-card",
    "@radix-ui/react-slider",
    "@radix-ui/react-sheet",
    "@radix-ui/react-collapsible",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-tooltip",
    "@radix-ui/react-navigation-menu",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-avatar",
    "@radix-ui/react-accordion",
  ],
};

module.exports = nextConfig;
