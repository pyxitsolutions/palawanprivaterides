import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { getSortedBlogPosts } from '../utils/blogHelpers';

const PREVIEW_COUNT = 3;

export function BlogPreview() {
  const navigate = useNavigate();
  const posts = getSortedBlogPosts().slice(0, PREVIEW_COUNT);

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-2">Travel blog</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Guides & Tips for Palawan</h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              Routes, seasons, tours, and local advice — plan your trip before you book.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all shrink-0"
          >
            <BookOpen size={18} />
            View all articles
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <img
                src={post.featuredImage}
                alt={post.title}
                loading="lazy"
                className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#e8a020]/10 text-[#e8a020] text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-black text-gray-900 mb-2 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
