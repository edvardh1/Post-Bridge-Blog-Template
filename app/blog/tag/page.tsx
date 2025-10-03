import { type Metadata } from 'next';
import Link from 'next/link';

async function getTags() {
  // TODO: Implement getTags when available in LightweightClient
  // For now, return empty array to prevent build errors
  return [];
}

function deslugify(str: string) {
  if (!str) return '';
  return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export const fetchCache = 'force-no-store';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Tags - Lightweight Blog';
  const description = 'Browse all blog tags. Find articles organized by topics and keywords.';
  return {
    title,
    description,
    metadataBase: new URL('https://lightweight.so'),
    alternates: {
      canonical: '/blog/tag',
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: 'https://lightweight.so/blog/tag',
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function Tags() {
  const tags = await getTags();

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 lg:py-24">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
          Blog Tags
        </h1>
        <p className="text-md lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore our content organized by Tags. Find articles, insights, and resources tailored to your interests.
        </p>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-8 text-sm text-gray-500">
        <a href="/" className='text-orange-500 hover:text-orange-600 transition-colors'>Home</a>
        <svg width="12" height="12" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8l-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0z"
          />
        </svg>
        <Link href="/blog/" className='text-orange-500 hover:text-orange-600 transition-colors'>Blog</Link>
        <svg width="12" height="12" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8l-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0z"
          />
        </svg>
        <span className="text-gray-700 font-medium">Tags</span>
      </div>

      {/* Tags Grid */}
      <div className="max-w-7xl mx-auto">
        {tags && tags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-300 transition-all duration-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Tag Icon or Badge */}
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg group-hover:from-green-200 group-hover:to-teal-200 transition-colors">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                    </div>

                    {/* Tag Title */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {deslugify(tag)}
                    </h2>

                    {/* View Link */}
                    <div className="flex items-center justify-end">
                      <span className="text-green-500 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        View articles
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No tags available yet.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for organized content.</p>
          </div>
        )}
      </div>
    </section>
  );
}
