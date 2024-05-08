/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "s3.us-west-2.amazonaws.com",
        protocol: "https",
      },
      {
        hostname: "t3.ftcdn.net",
        protocol: "https",
      },
      {
        hostname: "storage.googleapis.com",
        protocol: "https",
      },
      {
        hostname: "images.playground.com",
        protocol: "https",
      },
      {
        hostname: "res.cloudinary.com",
        protocol: "http",
      },
      {
        hostname: "drive.google.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
