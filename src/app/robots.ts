import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/premium', '/api/'],
    },
    sitemap: 'https://freelance-os-hub-781p.vercel.app/sitemap.xml',
  }
}
