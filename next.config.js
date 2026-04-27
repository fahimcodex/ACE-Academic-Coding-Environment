/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google profile photos
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
  // Proxy Firebase auth traffic so the browser treats it as a first-party request
  // This physically bypasses third-party cookie blocking on modern browsers (Chrome/Safari)
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination:
          "https://academic-coding-environment.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
