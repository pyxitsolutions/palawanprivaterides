import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../data/blog';

interface BlogRelatedPostsProps {
  posts: BlogPost[];
}

export function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  const navigate = useNavigate();
  if (posts.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-gray-100">
      <h2 className="text-xl font-black text-gray-900 mb-6">Related articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {posts.map((post) => (
          <article
            key={post.slug}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full aspect-[16/10] object-cover"
            />
            <div className="p-4">
              <span className="text-[10px] font-bold text-[#e8a020] uppercase tracking-wider">
                {post.category}
              </span>
              <h3 className="text-sm font-black text-gray-900 mt-1 mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={11} /> {post.readTime}
                <ArrowRight size={12} className="ml-auto text-[#e8a020] opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
