import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { BLOG_CATEGORIES, getSortedBlogPosts } from '../utils/blogHelpers';
import { setBlogListMeta } from '../utils/blogMeta';
export default function BlogListPage() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState<(typeof BLOG_CATEGORIES)[number]>('All');

  useEffect(() => {
    setBlogListMeta();
  }, []);

  const filtered = useMemo(() => {
    const sorted = getSortedBlogPosts();
    if (categoryFilter === 'All') return sorted;
    return sorted.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-primary pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#e8a020] text-sm font-bold uppercase tracking-widest mb-3">Palawan Travel Blog</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Travel Guides & Tips</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Routes, seasons, tours, and local advice — plan your Palawan trip with confidence.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-10">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#1a3728] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {featured && categoryFilter === 'All' && (
          <article
            onClick={() => navigate(`/blog/${featured.slug}`)}
            className="mb-10 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer group grid md:grid-cols-2 bg-white"
          >
            <img
              src={featured.featuredImage}
              alt={featured.title}
              className="w-full h-full min-h-[220px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="p-8 flex flex-col justify-center">
              <span className="text-xs font-bold text-[#e8a020] uppercase tracking-wider mb-2">Latest</span>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#e8a020]/10 text-[#e8a020] text-xs font-bold px-3 py-1 rounded-full">
                  {featured.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={12} /> {featured.readTime}
                </span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors leading-snug">
                {featured.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
              <span className="flex items-center gap-1 text-sm font-bold text-[#e8a020] group-hover:gap-2 transition-all">
                Read article <ArrowRight size={14} />
              </span>
            </div>
          </article>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(categoryFilter === 'All' ? rest : filtered).map((post) => (
            <article
              key={post.slug}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group bg-white"
            >
              <img
                src={post.featuredImage}
                alt={post.title}
                loading="lazy"
                className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[#e8a020]/10 text-[#e8a020] text-xs font-bold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-[#e8a020] group-hover:gap-2 transition-all">
                    Read more <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-16">No articles in this category yet.</p>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
