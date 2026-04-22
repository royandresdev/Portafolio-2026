import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/'],
    },
    // Opcional: Descomenta esto si luego creas un sitemap
    // sitemap: 'https://royandres.dev/sitemap.xml',
  }
}
