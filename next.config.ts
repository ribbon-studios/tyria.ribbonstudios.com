import type { NextConfig } from 'next';

export default {
  images: {
    remotePatterns: [new URL('https://render.guildwars2.com/file/**')],
  },
} satisfies NextConfig;
