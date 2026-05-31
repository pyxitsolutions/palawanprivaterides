import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { BlogArticleBody } from '../components/BlogArticleBody';
import { BlogToc } from '../components/BlogToc';
import { BlogRelatedPosts } from '../components/BlogRelatedPosts';
import { BlogStickyCta } from '../components/BlogStickyCta';
import { blogPosts } from '../data/blog';
import { getRelatedPosts, getTocEntries } from '../utils/blogHelpers';
import { getArticleJsonLd, setBlogPostMeta } from '../utils/blogMeta';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);

  const post = blogPosts.find((p) => p.slug === slug);
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;
  const related = post ? getRelatedPosts(post) : [];
  const toc = post ? getTocEntries(post) : [];

  const onScroll = useCallback(() => {
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
  }, []);

  useEffect(() => {
    if (!post) return;
    setBlogPostMeta(post);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blog-article-jsonld';
    script.textContent = JSON.stringify(getArticleJsonLd(post));
    document.head.appendChild(script);

    return () => {
      document.getElementById('blog-article-jsonld')?.remove();
    };
  }, [post]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll, slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Article not found.</p>
        <button type="button" onClick={() => navigate('/blog')} className="text-primary underline">
          Back to blog
        </button>
      </div>
    );
  }

  const bookHref = post.stickyBookHref ?? '/rides';

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">
      <div
        className="fixed top-16 left-0 right-0 h-1 z-[60] bg-gray-100"
        aria-hidden
      >
        <div
          className="h-full bg-[#e8a020] transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar />

      <div className="bg-primary pt-28 pb-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full aspect-[16/10] max-h-[360px] object-cover"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="bg-[#e8a020] text-white text-xs font-bold px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/60">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-white/60 text-sm">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            · Palawan Private Rides
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlogToc entries={toc} />
        <BlogArticleBody sections={post.content} />

        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {post.keywords.map((k) => (
              <span key={k} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                {k}
              </span>
            ))}
          </div>
        </div>

        <BlogRelatedPosts posts={related} />

        <div className="mt-10 grid grid-cols-2 gap-4">
          {prevPost ? (
            <button
              type="button"
              onClick={() => navigate(`/blog/${prevPost.slug}`)}
              className="text-left border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group"
            >
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <ArrowLeft size={11} /> Previous
              </p>
              <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-snug">
                {prevPost.title}
              </p>
            </button>
          ) : (
            <div />
          )}
          {nextPost ? (
            <button
              type="button"
              onClick={() => navigate(`/blog/${nextPost.slug}`)}
              className="text-right border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group ml-auto w-full"
            >
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1 justify-end">
                Next <ArrowRight size={11} />
              </p>
              <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-snug">
                {nextPost.title}
              </p>
            </button>
          ) : (
            <div />
          )}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Blog
          </button>
        </div>
      </div>

      <BlogStickyCta bookHref={bookHref} />
      <SiteFooter />
    </div>
  );
}
