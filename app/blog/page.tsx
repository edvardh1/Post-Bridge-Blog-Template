import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, ChevronRight } from 'lucide-react';
import { LightweightClient } from 'lightweight-client';
import BlogNav from './BlogNav';

async function getPosts(page: number, limit: number = 10) {
  const key = process.env.LIGHTWEIGHT_API_KEY || process.env.NEXT_PUBLIC_LIGHTWEIGHT_API_KEY || 'a8c58738-7b98-4597-b20a-0bb1c2fe5772';
  const client = new LightweightClient(key);
  return client.getPosts(page, limit);
}

// Hardcoded categories - no need for API call since we know them
const ALL_CATEGORIES = [
  { slug: 'seo', title: 'SEO' },
  { slug: 'guides', title: 'Guides' },
  { slug: 'tutorials', title: 'Tutorials' },
  { slug: 'updates', title: 'Updates' }
];

// Categories to feature with their own sections
const FEATURED_CATEGORIES = [
  { slug: 'seo', title: 'SEO Tips' },
  { slug: 'guides', title: 'Guides' }
];

export default async function Blog({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page || '0');
  
  // Fetch all data server-side
  const { articles: allArticles, total } = await getPosts(0, 20);
  const posts = allArticles || [];
 
  
  // Prepare featured posts (first 2)
  const featuredPosts = posts.slice(0, 2);
  
  // Prepare category posts
  const categoryPosts: Record<string, any[]> = {};
  for (const category of FEATURED_CATEGORIES) {
    categoryPosts[category.slug] = posts
      .filter((post: any) => post.category?.slug === category.slug)
      .slice(0, 3);
  }
  
  // Get posts for "All Posts" section based on current page
  const { articles: allPostsSection } = currentPage > 0 
    ? await getPosts(currentPage, 9)
    : { articles: posts.slice(0, 9) };
    
  const totalPages = Math.ceil(total / 9);
  
  

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent h-96"></div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-12">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl lg:text-6xl font-light text-white mb-4">
                Blog
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                Explore the latest in content management, digital experiences, and industry trends.
              </p>
            </div>
          </div>

          {/* Browse by Category - Links to category pages */}
          <div className="">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Browse by category</p>
            <div className="flex items-center gap-3 flex-wrap">
              {ALL_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="px-3 py-1.5 text-xs font-medium transition-all text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-full border border-gray-800 hover:border-gray-700"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Navigation - Sticky on Scroll */}
          <div className="pt-6">

          <BlogNav featuredCategories={FEATURED_CATEGORIES} />
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
            {/* Latest Posts Section - 2 Featured Cards */}
            <div id="featured-posts" className="mb-14 scroll-mt-20">
              <div className="flex items-center justify-between mb-6 ">
                <h2 className="text-2xl font-light text-gray-100">Latest Posts</h2>
                <a
                  href="#all-posts"
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-brand transition-colors"
                >
                  View more
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((article: any, index: number) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="group relative"
                  >
                    <article className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-brand/10">
                      {/* Image Section */}
                      <div className="relative h-56 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.headline}
                            fill
                            className="object-cover opacity-90 transition-opacity duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            priority={index === 0}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-gray-600 text-sm">No image available</div>
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        {article.category && (
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-sm text-gray-300 text-xs font-medium rounded-full border border-gray-700">
                              {article.category.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        {/* Title */}
                        <h3 className="text-xl font-semibold text-gray-100 group-hover:text-brand transition-colors duration-200 line-clamp-2 mb-3">
                          {article.headline}
                        </h3>

                        {/* Description */}
                        {article.metaDescription && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {article.metaDescription}
                          </p>
                        )}

                        {/* Meta Information */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Author */}
                            {article.author && (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand to-brand/60 flex items-center justify-center">
                                  <User className="w-3 h-3 text-black" />
                                </div>
                                <span className="text-xs text-gray-400">
                                  {article.author.name}
                                </span>
                              </div>
                            )}
                            
                            {/* Date */}
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {new Date(
                                article.publishedAt || article.createdAt
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          </div>

                          {/* Read Time */}
                          {article.readingTime && (
                            <span className="text-xs text-gray-500">
                              {article.readingTime} min read
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Sections */}
            {FEATURED_CATEGORIES.map((category) => {
              const posts = categoryPosts[category.slug] || [];
              if (posts.length === 0) return null;

              return (
                <div key={category.slug} id={`category-${category.slug}`} className="mb-14 scroll-mt-20">
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-light text-gray-100">{category.title}</h2>
                    <Link
                      href={`/blog/category/${category.slug}`}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-brand transition-colors"
                    >
                      View more
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* 3 Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((article: any) => (
                      <Link
                        key={article.id}
                        href={`/blog/${article.slug}`}
                        className="group relative"
                      >
                        <article className="h-full bg-gradient-to-br from-gray-900/30 to-gray-900/20 rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-brand/5">
                          {/* Image Section */}
                          <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={article.headline}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-gray-700 text-xs">No image</div>
                              </div>
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="p-5">
                            {/* Title */}
                            <h3 className="text-lg font-medium text-gray-100 group-hover:text-brand transition-colors duration-200 line-clamp-2 mb-2">
                              {article.headline}
                            </h3>

                            {/* Description */}
                            {article.metaDescription && (
                              <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                {article.metaDescription}
                              </p>
                            )}

                            {/* Meta Information */}
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              {/* Author */}
                              {article.author && (
                                <span className="truncate">
                                  {article.author.name}
                                </span>
                              )}
                              
                              {/* Date */}
                              <span>
                                {new Date(
                                  article.publishedAt || article.createdAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* All Posts Section */}
            <div id="all-posts" className="mt-24 pt-12 border-t border-gray-800 scroll-mt-20">
              <h2 className="text-2xl font-light text-gray-100 mb-8">All Posts</h2>
              
              {/* Posts Grid - 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {allPostsSection.map((article: any) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="group relative"
                  >
                    <article className="h-full bg-gradient-to-br from-gray-900/30 to-gray-900/20 rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-brand/5">
                      {/* Image Section */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.headline}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-gray-700 text-xs">No image</div>
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        {article.category && (
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-2 py-1 bg-black/60 backdrop-blur-sm text-gray-300 text-xs font-medium rounded-full border border-gray-700">
                              {article.category.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-5">
                        {/* Title */}
                        <h3 className="text-lg font-medium text-gray-100 group-hover:text-brand transition-colors duration-200 line-clamp-2 mb-2">
                          {article.headline}
                        </h3>

                        {/* Description */}
                        {article.metaDescription && (
                          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                            {article.metaDescription}
                          </p>
                        )}

                        {/* Meta Information */}
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          {/* Author */}
                          {article.author && (
                            <span className="truncate">
                              {article.author.name}
                            </span>
                          )}
                          
                          {/* Date */}
                          <span>
                            {new Date(
                              article.publishedAt || article.createdAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-2 min-h-[40px]">
                    {currentPage > 0 ? (
                      <Link
                        href={`/blog?page=${currentPage - 1}`}
                        className="inline-flex items-center px-3 py-2 bg-transparent border border-gray-700 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 rounded-md transition-all"
                      >
                        ← Previous
                      </Link>
                    ) : (
                      <span className="inline-flex items-center px-3 py-2 bg-transparent border border-gray-700 text-sm text-gray-600 opacity-30 rounded-md cursor-not-allowed">
                        ← Previous
                      </span>
                    )}
                    
                    <div className="flex items-center gap-1 px-4">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i;
                        return (
                          <Link
                            key={pageNum}
                            href={`/blog?page=${pageNum}`}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                              currentPage === pageNum 
                                ? 'bg-brand text-black' 
                                : 'text-gray-400 hover:bg-white/5'
                            }`}
                          >
                            {pageNum + 1}
                          </Link>
                        );
                      })}
                      {totalPages > 5 && (
                        <>
                          <span className="text-gray-600 px-2">...</span>
                          <Link
                            href={`/blog?page=${totalPages - 1}`}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                              currentPage === totalPages - 1 
                                ? 'bg-brand text-black' 
                                : 'text-gray-400 hover:bg-white/5'
                            }`}
                          >
                            {totalPages}
                          </Link>
                        </>
                      )}
                    </div>

                    {currentPage < totalPages - 1 ? (
                      <Link
                        href={`/blog?page=${currentPage + 1}`}
                        className="inline-flex items-center px-3 py-2 bg-transparent border border-gray-700 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 rounded-md transition-all"
                      >
                        Next →
                      </Link>
                    ) : (
                      <span className="inline-flex items-center px-3 py-2 bg-transparent border border-gray-700 text-sm text-gray-600 opacity-30 rounded-md cursor-not-allowed">
                        Next →
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
      </div>
    </div>
  );
}
