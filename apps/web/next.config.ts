import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['i.ibb.co', 'www.trickbd.com', 'www.google.com'],
    remotePatterns: [
      {
        hostname: "i.ibb.co",
      },
      {
        hostname: "test.image.com",
        pathname: "/**"
      },
      {
        hostname: "example.com",
        pathname: "/**"
      },
      {
        hostname: "media.com",
        pathname: "/**"
      },
      {
        hostname: "jadesummer.com",
        pathname: "/**"
      } ,
      {
        hostname: "ggbook.s3.amazonaws.com",
        pathname: "/**"
      } 
    ],
  },
};

export default nextConfig;
 