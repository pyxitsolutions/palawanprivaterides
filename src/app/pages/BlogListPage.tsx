import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { blogPosts } from '../data/blog';

export default function BlogListPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Palawan Travel Blog | Tips, Guides & Routes | Palawan Private Rides';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Palawan travel guides, tips, and route information. Everything you need to plan your Palawan trip — El Nido, Port Barton, Puerto Princesa & more.');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#e8a020] text-sm font-bold uppercase tracking-widest mb-3">Palawan Travel Blog</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Travel Guides & Tips</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">Everything you need to plan the perfect Palawan trip — routes, destinations, tours, and local tips.</p>
        </div>
      </div>

      {/* Blog grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
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
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-[#e8a020] group-hover:gap-2 transition-all">
                    Read more <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
