/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    backend_url:
      process.env.NODE_ENV === "production"
        ? "http://localhost:4000/"
        : "http://localhost:4000/",
      socket_url: process.env.NODE_ENV === "production" 
      ? "http://localhost:4000/" 
      : "http://localhost:4000/",
  },
  images: {
    domains: [''],//use here you domain url for image
  },
};

module.exports = nextConfig

