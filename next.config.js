/** @type {import('next').NextConfig} */

const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();

const withNextEnv = nextEnv();

const nextConfig = withNextEnv({
  reactStrictMode: false,
});

module.exports = nextConfig
