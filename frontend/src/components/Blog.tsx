import React from 'react';
import { Link } from 'react-router-dom';
import { SLUG_MAPPING } from '@/utils/localization';

interface Article {
  id: number;
  title: string;
  titleEn?: string;
  slug: string;
  slugEn?: string;
  image: string;
  description: string;
  descriptionEn?: string;
  createdAt: string;
}

interface BlogProps {
  data?: {
    blogTitle?: string;
    blogViewAllText?: string;
  };
  posts?: Article[];
  lang?: 'vi' | 'en';
}

const Blog: React.FC<BlogProps> = ({ data, posts = [], lang = 'vi' }) => {
  const title = data?.blogTitle || (lang === 'en' ? "Knowledge & News" : "Kiến thức & Tin tức");
  const viewAllText = data?.blogViewAllText || (lang === 'en' ? "View all articles" : "Xem tất cả bài viết");
  const articlesSlug = SLUG_MAPPING['bai-viet'][lang];

  return (
    <section id="blog" className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                    {title}
                </h2>
                <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
            </div>
            <Link to={`/${lang}/${articlesSlug}`} className="hidden md:block text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                {viewAllText}
            </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => {
                 const postTitle = lang === 'en' ? (post.titleEn || post.title) : post.title;
                 const postDesc = lang === 'en' ? (post.descriptionEn || post.description) : post.description;
                 const postSlug = lang === 'en' ? (post.slugEn || post.slug) : post.slug;
                 const date = new Date(post.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN', {
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                 });

                 return (
                  <Link key={post.id} to={`/${lang}/${articlesSlug}/${postSlug}`} className="group cursor-pointer block">
                      <div className="rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800 shadow-sm aspect-video">
                          <img 
                              src={post.image || 'https://placehold.co/600x400?text=No+Image'} 
                              alt={postTitle} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                      </div>
                      <div className="text-sm text-slate-500 mb-2">{date}</div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {postTitle}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                          {postDesc}
                      </p>
                  </Link>
                 );
              })}
          </div>
        ) : (
           <div className="text-center text-slate-500 py-10">
             {lang === 'en' ? 'No featured articles available.' : 'Chưa có bài viết nổi bật nào.'}
           </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
