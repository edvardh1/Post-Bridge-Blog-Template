'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Clock, User, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LightweightClient } from 'lightweight-client';
import { useParams } from 'next/navigation';

async function getCategoryPosts(slug: string, page: number) {
  const key = process.env.NEXT_PUBLIC_LIGHTWEIGHT_API_KEY || 'a8c58738-7b98-4597-b20a-0bb1c2fe5772';
  const client = new LightweightClient(key);
  return client.getCategoryPosts(slug, page, 10);
}

async function getCategories() {
  const key = process.env.LIGHTWEIGHT_API_KEY || 'a8c58738-7b98-4597-b20a-0bb1c2fe5772';
  const client = new LightweightClient(key);
  return client.getCategories();
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [postsData, categoriesData] = await Promise.all([
          getCategoryPosts(slug, page),
          getCategories()
        ]);
        setPosts(postsData.articles || []);
        setTotal(postsData.total || 0);
        setCategories(categoriesData || []);
        
        // Find current category info
        const category = categoriesData?.find((cat: any) => cat.slug === slug);
        setCurrentCategory(category);
      } catch (error) {
        console.error('Failed to load category data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, slug]);

  const lastPage = Math.ceil(total / 10);

  return (
    <div className="min-h-screen bg-landing-background pt-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent h-96"></div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-12">
          {/* Back to Blog */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="mb-12">
            <h1 className="text-5xl lg:text-6xl font-light text-gray-100 mb-4">
              {currentCategory?.title || slug}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
              Explore articles in {currentCategory?.title || slug}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-800 flex-wrap">
            <Link
              href="/blog"
              className="px-4 py-2 text-sm font-medium transition-all text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg"
            >
              All
            </Link>
            {categories.map((category: any) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                  category.slug === slug 
                    ? 'text-gray-100 bg-white/10' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Loading posts...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-gray-400 mb-4">No posts found in this category</div>
            <Link href="/blog">
              <Button variant="outline" size="sm" className="bg-transparent border-gray-700 text-gray-400 hover:bg-white/5 hover:text-gray-200">
                Back to All Posts
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {posts.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group relative"
                >
                  <article className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-brand/10">
                    {/* Image Section */}
                    <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.headline}
                          className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
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

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="mt-16 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="bg-transparent border-gray-700 text-gray-400 hover:bg-white/5 hover:text-gray-200 disabled:opacity-30"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1 px-4">
                    {[...Array(Math.min(5, lastPage))].map((_, i) => {
                      const pageNum = i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            page === pageNum 
                              ? 'bg-brand text-black' 
                              : 'text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                    {lastPage > 5 && (
                      <>
                        <span className="text-gray-600 px-2">...</span>
                        <button
                          onClick={() => setPage(lastPage - 1)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            page === lastPage - 1 
                              ? 'bg-brand text-black' 
                              : 'text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          {lastPage}
                        </button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(lastPage - 1, page + 1))}
                    disabled={page >= lastPage - 1}
                    className="bg-transparent border-gray-700 text-gray-400 hover:bg-white/5 hover:text-gray-200 disabled:opacity-30"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}