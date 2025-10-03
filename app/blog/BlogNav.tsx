'use client'

import { useEffect, useState, useRef } from 'react';

interface BlogNavProps {
  featuredCategories: { slug: string; title: string }[];
}

export default function BlogNav({ featuredCategories }: BlogNavProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('featured-posts');
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we should make it sticky
      if (sentinelRef.current) {
        const rect = sentinelRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }

      // Determine active section
      const sections = [
        'featured-posts',
        ...featuredCategories.map(c => `category-${c.slug}`),
        'all-posts'
      ];

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Small delay to ensure DOM is ready
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [featuredCategories]);

  // Track nav height
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      {/* Sentinel div to detect when nav should become sticky */}
      <div ref={sentinelRef} className="h-0" />
      
      {/* Navigation that becomes sticky */}
      <div 
        ref={navRef}
        className={`transition-all duration-300 bg-[#141414] border-b border-gray-800 ${
          isSticky 
            ? 'fixed top-0 left-0 right-0 z-40 shadow-md shadow-black/5' 
            : 'relative'
        }`}
      >
        <div className={isSticky ? 'max-w-6xl mx-auto px-4 md:px-8' : ''}>
          <div className="flex items-center gap-4 flex-wrap py-4">
            <a
              href="#featured-posts"
              className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                activeSection === 'featured-posts'
                  ? 'text-gray-100 bg-white/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              Latest
            </a>
            {featuredCategories.map((category) => (
              <a
                key={category.slug}
                href={`#category-${category.slug}`}
                className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                  activeSection === `category-${category.slug}`
                    ? 'text-gray-100 bg-white/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {category.title}
              </a>
            ))}
            <a
              href="#all-posts"
              className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                activeSection === 'all-posts'
                  ? 'text-gray-100 bg-white/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              All Posts
            </a>
          </div>
        </div>
      </div>
      
      {/* Placeholder to maintain layout when nav becomes fixed */}
      {isSticky && <div style={{ height: navHeight || 58 }} />}
    </>
  );
}
