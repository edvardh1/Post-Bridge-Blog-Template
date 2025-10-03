import { type Metadata } from 'next';
import Link from 'next/link';
import { LightweightClient } from 'lightweight-client';

async function getPosts(slug: string, page: number) {
  const key = process.env.LIGHTWEIGHT_API_KEY;
  if (!key) throw Error('LIGHTWEIGHT_API_KEY environment variable must be set. You can use the DEMO key a8c58738-7b98-4597-b20a-0bb1c2fe5772 for testing - please set it in the root .env.local file.');

  const client = new LightweightClient(key);
  return client.getTagPosts(slug, page, 10);
}

function deslugify(str: string) {
  if (!str) return '';
  return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export const fetchCache = 'force-no-store';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = `${deslugify(slug)} - Lightweight Blog`;
  return {
    title,
    metadataBase: new URL('https://lightweight.so'),
    alternates: {
      canonical: `/blog/tag/${slug}`,
    },
    openGraph: {
      type: 'article',
      title,
      // description: '',
      // images: [],
      url: `https://lightweight.so/blog/tag/${slug}`,
    },
    twitter: {
      title,
      // description: '',
      // card: 'summary_large_image',
      // images: [],
    },
  };
}

export default async function Tag({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page: number }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const pageNumber = Math.max((page || 0) - 1, 0);
  const { total, articles } = await getPosts(slug, pageNumber);
  const posts = articles || [];
  const lastPage = Math.ceil(total / 10);

  console.log(articles);
  console.log(slug);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 lg:py-24">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
          Tag: {deslugify(slug)}
        </h1>
        <p className="text-md lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore articles tagged with {deslugify(slug)}. Discover insights, tips, and strategies to help you succeed.
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
        <span className="text-gray-700 font-medium">{deslugify(slug)}</span>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((article: any) => (
            <li key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.headline}
                    className="w-full h-full object-cover "
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-400 text-sm">No image</div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Category */}
                {article.category && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {article.category.title}
                    </span>
                  </div>
                )}

                {/* Title */}
                <Link
                  href={`/blog/${article.slug}`}
                  className="block mb-3 group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {article.headline}
                  </h3>
                </Link>

                {/* Date */}
                <div className="text-sm text-gray-500">
                  {new Date(
                    article.publishedAt || article.createdAt
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {lastPage > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex mt-12 items-center justify-center text-sm text-slate-300">
              <a
                className={`border rounded-md px-2 py-1 w-[90px] text-center ${pageNumber ? '' : 'pointer-events-none opacity-30'}`}
                href={pageNumber ? `/blog/tag/${slug}?page=${pageNumber}` : '#'}
              >
                ← Prev
              </a>
              <div className="px-6 font-bold">
                {pageNumber + 1} / {lastPage}
              </div>
              <a
                className={`border rounded-md px-2 py-1 w-[90px] text-center ${
                  pageNumber >= lastPage - 1 ? 'pointer-events-none opacity-30' : ''
                }`}
                href={pageNumber >= lastPage - 1 ? '#' : `/blog/tag/${slug}?page=${pageNumber + 2}`}
              >
                Next →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}