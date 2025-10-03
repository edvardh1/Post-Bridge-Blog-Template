import { type Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LightweightClient } from 'lightweight-client';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Suspense } from 'react';
import ShareButtons from './ShareButtons';
import '../blog.css';

async function getPost(slug: string) {
  const key = process.env.LIGHTWEIGHT_API_KEY || process.env.NEXT_PUBLIC_LIGHTWEIGHT_API_KEY;
  if (!key) throw Error('LIGHTWEIGHT_API_KEY environment variable must be set. You can use the DEMO key a8c58738-7b98-4597-b20a-0bb1c2fe5772 for testing - please set it in the root .env.local file');

  const client = new LightweightClient(key);
  return client.getPost(slug);
}

export const fetchCache = 'force-no-store';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return {};

  const title = post.headline;
  const description = post.metaDescription;
  return {
    title,
    description,
    metadataBase: new URL('https://lightweight.so'),
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      images: [post.image],
      url: `https://lightweight.so/blog/${slug}`,
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
      images: [post.image],
    },
  };
}


export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) return (
    <main className="bg-landing-background min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-brand font-semibold">404 Error</h3>
          <p className="text-gray-100 text-4xl font-semibold sm:text-5xl">
            Page not found
          </p>
          <p className="text-gray-400">
            Sorry, the page you are looking for could not be found or has been
            removed.
          </p>
          <Link
            href="/blog"
            className="text-brand duration-150 hover:opacity-80 font-medium inline-flex items-center gap-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </div>
      </div>
    </main>
  );

  // Calculate reading time if not provided
  const readingTime = post.readingTime || Math.ceil(post.html?.length / 1000) || 5;
  const articleUrl = `https://lightweight.so/blog/${slug}`;

  return (
    <main className="bg-landing-background min-h-screen text-gray-100">
      {/* Header with back button and tags */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between max-w-4xl">
          <Link 
            href="/blog" 
            className="flex pb-4 items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.slice(0, 3).map((tag: any) => (
                <Link
                  key={tag.slug}
                  href={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors"
                >
                  {tag.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-4xl mb-6 leading-tight">
              {post.headline}
            </h1>
            
            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </time>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{readingTime} minute read</span>
              </div>
            </div>

            {/* Authors */}
            {post.author && (
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {post.author.image ? (
                      <Image
                        src={post.author.image}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">
                          {post.author.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-200">{post.author.name}</p>
                    {post.author.title && (
                      <p className="text-sm text-gray-500">{post.author.title}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </header>
      </div>

      {/* Main content area with sidebar */}
      <div className="flex gap-12 max-w-6xl mx-auto px-4">
        {/* Left side - Main Content (Hero + Article) */}
        <div className="flex-1 ">
          {/* Hero Section */}
          

          {/* Hero Image if exists */}
          {post.image && (
            <div className="mb-12">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
                <Image
                  src={post.image}
                  alt={post.headline}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <article>
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-gray-100 prose-headings:font-bold
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10
                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-brand prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-200 prose-strong:font-semibold
                prose-code:text-brand prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:shadow-xl
                prose-blockquote:border-l-brand prose-blockquote:bg-gray-900/50 prose-blockquote:py-1 prose-blockquote:italic
                prose-ul:text-gray-300 prose-li:text-gray-300
                prose-img:rounded-xl prose-img:shadow-2xl article"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            {/* Related Posts */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-gray-100">Related posts</h2>
                <div className="grid gap-4">
                  {post.relatedPosts.map((relatedPost: any) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block p-4 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors"
                    >
                      <h3 className="font-medium text-gray-200 group-hover:text-brand transition-colors">
                        {relatedPost.headline}
                      </h3>
                      {relatedPost.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {relatedPost.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Right side - Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className=" space-y-8">
              {/* On this page navigation */}
              {post.navigationMenu && post.navigationMenu.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-200">On this page</h3>
                  <nav className="space-y-2">
                    {post.navigationMenu.map((item: any, index: number) => (
                      <a
                        key={index}
                        href={`#${item.id}`}
                        className={`block py-2 text-sm hover:text-brand transition-colors ${
                          item.level === 1 ? 'text-gray-300 font-medium' :
                          item.level === 2 ? 'text-gray-400 pl-4' :
                          'text-gray-500 pl-8'
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Share section */}
              <div className="pt-8 border-t border-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Share this article</h3>
                <Suspense fallback={
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-gray-800 animate-pulse" />
                    <div className="w-5 h-5 rounded bg-gray-800 animate-pulse" />
                    <div className="w-5 h-5 rounded bg-gray-800 animate-pulse" />
                  </div>
                }>
                  <ShareButtons url={articleUrl} title={post.headline} />
                </Suspense>
              </div>

              {/* All Tags */}
              {post.tags && post.tags.length > 3 && (
                <div className="pt-8 border-t border-gray-800">
                  <h3 className="text-lg font-semibold mb-4 text-gray-200">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: any) => (
                      <Link
                        key={tag.slug}
                        href={`/blog/tag/${tag.slug}`}
                        className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs hover:bg-gray-700 hover:text-gray-300 transition-colors"
                      >
                        {tag.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </aside>
      </div>

      {/* Bottom spacing */}
      <div className="h-24" />
    </main>
  );
}