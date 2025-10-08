import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, ChevronRight } from 'lucide-react';
import { LightweightClient } from 'lightweight-client';


async function getPosts(page: number, limit: number = 10) {
  const key = process.env.LIGHTWEIGHT_API_KEY || process.env.NEXT_PUBLIC_LIGHTWEIGHT_API_KEY;
  const client = new LightweightClient(key || '');
  return client.getPosts(page, limit);

  
}

// Hardcoded categories - no need for API call since we know them
const ALL_CATEGORIES = [
  { slug: 'all', title: 'All' },
  { slug: 'facebook', title: 'Facebook' },
  { slug: 'instagram', title: 'Instagram' },
  { slug: 'linkedin', title: 'Linkedin' },
  { slug: 'misc.', title: 'Misc.' },
  { slug: 'tiktok', title: 'TikTok' },
  { slug: 'twitter/x', title: 'Twitter/X' },
  { slug: 'youtube', title: 'Youtube' },
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
  
 
  
  // Get posts for "All Posts" section based on current page
  const { articles: allPostsSection } = currentPage > 0 
    ? await getPosts(currentPage, 9)
    : { articles: posts.slice(0, 9) };
    
  const totalPages = Math.ceil(total / 9);
  
  

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0  h-96"></div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-12">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl lg:text-5xl font-semibold text-gray-700 mb-4">
                The post bridge blog
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              Learn the strategies top creators use to grow their audience, go viral consistently, and turn their content into a thriving source of traffic to their business.
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
                   className={`px-3 py-1.5 text-sm font-medium transition-all rounded-full  ${
                     category.title === 'All' 
                       ? 'text-gray-900 bg-green-300  ' 
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

      {/* Featured Posts */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
            

           <div className='border-t border-gray-200 gap-6 mb-6'></div>

            {/* All Posts Section */}
            <div id="all-posts" className="  scroll-mt-20">
           
              
              {/* Posts Grid - 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {allPostsSection.map((article: any) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="group relative"
                  >
                    <article className="h-full  rounded-xl border border-gray-400/50 overflow-hidden hover:border-gray-400 transition-all duration-300 hover:shadow-xl hover:shadow-brand/5">
                      {/* Image Section */}
                      <div className="relative h-48  overflow-hidden">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.headline}
                            fill
                            className="object-cover "
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
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
                          {/* Author */}
                          {article.author.image && (
                            <span>
                            <Image
                              src={article.author.image}
                              alt={article.author.name}
                              width={20}
                              height={20}
                              className="rounded-full "
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
