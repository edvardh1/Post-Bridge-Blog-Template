'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { LightweightClient } from 'lightweight-client';
import { useParams } from 'next/navigation';

async function getCategoryPosts(slug: string, page: number) {
  const key = process.env.NEXT_PUBLIC_LIGHTWEIGHT_API_KEY;
  const client = new LightweightClient(key || '');
  return client.getCategoryPosts(slug, page, 9);
}

// Hardcoded categories - consistent with main blog page
const ALL_CATEGORIES = [
  { slug: 'facebook', title: 'Facebook' },
  { slug: 'instagram', title: 'Instagram' },
  { slug: 'linkedin', title: 'Linkedin' },
  { slug: 'misc.', title: 'Misc.' },
  { slug: 'tiktok', title: 'TikTok' },
  { slug: 'twitter/x', title: 'Twitter/X' },
  { slug: 'youtube', title: 'Youtube' },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Find current category info from hardcoded list
  const currentCategory = ALL_CATEGORIES.find((cat) => cat.slug === slug);

  useEffect(() => {
    const loadData = async () => {
      // Keep previous posts visible during transition
      setIsTransitioning(true);
      setLoading(posts.length === 0); // Only show loading skeleton if no posts yet
      try {
        const postsData = await getCategoryPosts(slug, page);
        setPosts(postsData.articles || []);
        setTotal(postsData.total || 0);
      } catch (error) {
        console.error('Failed to load category data:', error);
      } finally {
        setLoading(false);
        setIsTransitioning(false);
      }
    };
    loadData();
  }, [page, slug]);

  const totalPages = Math.ceil(total / 9);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 h-96"></div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-12">
          {/* Back to Blog */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="mb-12">
            <h1 className="text-5xl lg:text-5xl font-semibold text-gray-700 mb-4">
              {currentCategory?.title || slug}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              Explore articles in {currentCategory?.title || slug}
            </p>
          </div>

          {/* Browse by Category */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Browse by category</p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/blog"
                className="text-gray-600 bg-gray-200 px-3 py-1.5 text-sm font-medium transition-all rounded-full"
              >
                All
              </Link>
              {ALL_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className={`px-3 py-1.5 text-sm font-medium transition-all rounded-full  ${
                    category.slug === slug 
                      ? 'text-gray-900 bg-green-300 ' 
                      : 'text-gray-600 bg-gray-200 '
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20" style={{ minHeight: '600px' }}>
        <div className="border-t border-gray-200 gap-6 mb-6"></div>
        
        {loading ? (
          // Skeleton loading state that maintains layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-full rounded-xl border border-gray-400/50 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-100"></div>
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-3"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-20"></div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-gray-400 mb-4">No posts found in this category</div>
            <Link 
              href="/blog"
              className="px-3 py-2 bg-transparent border border-gray-700 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 rounded-md transition-all"
            >
              Back to All Posts
            </Link>
          </div>
        ) : (
          <>
            {/* Posts Grid - 3 columns matching blog page */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
              {posts.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group relative"
                >
                  <article className="h-full rounded-xl border border-gray-400/50 overflow-hidden hover:border-gray-400 transition-all duration-300 hover:shadow-xl hover:shadow-brand/5">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      {article.image ? (
                        <Image
                          src={article.image}
                          alt={article.headline}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <div className="text-gray-700 text-xs">No image</div>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      {article.category && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-block px-2 py-1 bg-black/60 backdrop-blur-sm text-gray-300 text-xs font-medium rounded-full border border-gray-700">
                            {article.category.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-brand transition-colors duration-200 line-clamp-2 mb-2">
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
                        {/* Author with image */}
                        {article.author && article.author.image && (
                          <span>
                            <Image
                              src={article.author.image}
                              alt={article.author.name}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          </span>
                        )}
                        {article.author && (
                          <span className="">
                            {article.author.name}
                          </span>
                        )}
                        
                        {/* Date */}
                        <span className="">
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
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="inline-flex items-center px-3 py-2 bg-transparent border border-gray-700 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex items-center gap-1 px-4">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                            page === pageNum 
                              ? 'bg-brand text-black' 
                              : 'text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-600 px-2">...</span>
                        <button
                          onClick={() => setPage(totalPages - 1)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                            page === totalPages - 1 
                              ? 'bg-brand text-black' 
                              : 'text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="inline-flex items-center px-3 py-2 bg-transparent border border-gray-700 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}