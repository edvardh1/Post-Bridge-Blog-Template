import { LightweightClient } from 'lightweight-client';

/**
 * Sitemap Route Handler
 * 
 * IMPORTANT: Set NEXT_PUBLIC_SITE_URL in your .env.local file for production:
 * NEXT_PUBLIC_SITE_URL=https://yourdomain.com
 * 
 * The sitemap automatically includes all blog posts with proper SEO attributes:
 * - loc (URL)
 * - lastmod (last modified date)
 * - changefreq (change frequency)
 * - priority (0.0 to 1.0)
 * 
 * For local development, it defaults to http://localhost:3000/blog
 * 
 * After deployment:
 * 1. Submit your sitemap to Google Search Console
 * 2. Add to robots.txt: Sitemap: https://yourdomain.com/blog/sitemap.xml
 */

// Get base URL from environment variable or use default
// In production, uses NEXT_PUBLIC_SITE_URL
// In development, uses localhost with the current port
const BASE_BLOG_URL = "https://lightweight.so/blog";

// Force dynamic rendering to handle API calls at request time
export const dynamic = 'force-dynamic';

export async function GET() {
  const key = process.env.LIGHTWEIGHT_API_KEY;
  if (!key) {
    // Return valid empty sitemap during build without API key
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    
    return new Response(emptySitemap, {
      status: 200,
      headers: {
        'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
        'content-type': 'application/xml',
      },
    });
  }

  const client = new LightweightClient(key);
  
  // The getSitemap method now returns the complete XML string
  const sitemapXML = await client.getSitemap(BASE_BLOG_URL);
 

  return new Response(sitemapXML, {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
      'content-type': 'application/xml',
    },
  });
}
