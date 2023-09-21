/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  i18n: {
    locales: ["en", "ru", "kg"],
    defaultLocale: "ru",
    localeDetection: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  env: {
    RECAPTCHA_PUBLIC_KEY: "6LdZVBwoAAAAAFjhQbUlEdfpyrz5HT9LPQyHhfGr",
  },
};

module.exports = nextConfig;
