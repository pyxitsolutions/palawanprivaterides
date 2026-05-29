import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { blogPosts } from '../data/blog';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loadingCta, setLoadingCta] = useState(false);

  const post = blogPosts.find((p) => p.slug === slug);
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

  useEffect(() => {
    if (!post) return;
    document.title = post.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', post.metaDescription);
  }, [slug, post]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Article not found.</p>
        <button onClick={() => navigate('/blog')} className="text-primary underline">Back to blog</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <div className="bg-primary pt-28 pb-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-[#e8a020] text-white text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
            <span className="flex items-center gap-1 text-xs text-white/60"><Clock size={12} /> {post.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">{post.title}</h1>
          <p className="text-white/60 text-sm">
            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Palawan Private Rides
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="prose prose-gray max-w-none">
          {post.content.map((section, i) => {
            if (section.type === 'h2') {
              return <h2 key={i} className="text-2xl font-black text-gray-900 mt-10 mb-4">{section.text}</h2>;
            }
            if (section.type === 'h3') {
              return <h3 key={i} className="text-lg font-black text-gray-900 mt-6 mb-3">{section.text}</h3>;
            }
            if (section.type === 'p') {
              return <p key={i} className="text-gray-600 leading-relaxed mb-4">{section.text}</p>;
            }
            if (section.type === 'ul') {
              return (
                <ul key={i} className="space-y-2 mb-6">
                  {section.items?.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-gray-600 text-sm">
                      <span className="text-primary font-black mt-0.5 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            if (section.type === 'tip') {
              return (
                <div key={i} className="bg-[#e8a020]/10 border border-[#e8a020]/30 rounded-xl p-4 my-6">
                  <p className="text-gray-700 text-sm leading-relaxed">{section.text}</p>
                </div>
              );
            }
            if (section.type === 'cta') {
              return (
                <div key={i} className="bg-primary rounded-2xl p-6 my-8 text-center">
                  <p className="text-white font-bold mb-4">Ready to explore Palawan?</p>
                  <button
                    disabled={loadingCta}
                    onClick={() => { setLoadingCta(true); setTimeout(() => navigate(section.ctaHref ?? '/book'), 500); }}
                    className="bg-[#e8a020] text-white px-7 py-3 rounded-full font-bold text-sm hover:bg-[#d49020] transition-colors inline-flex items-center gap-2 disabled:opacity-80"
                  >
                    {loadingCta ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/></svg> Loading...</> : <>{section.ctaLabel} <ArrowRight size={15} /></>}
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Keywords */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {post.keywords.map((k) => (
              <span key={k} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">{k}</span>
            ))}
          </div>
        </div>

        {/* Prev / Next */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          {prevPost ? (
            <button
              onClick={() => navigate(`/blog/${prevPost.slug}`)}
              className="text-left border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group"
            >
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><ArrowLeft size={11} /> Previous</p>
              <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-snug">{prevPost.title}</p>
            </button>
          ) : <div />}
          {nextPost ? (
            <button
              onClick={() => navigate(`/blog/${nextPost.slug}`)}
              className="text-right border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group ml-auto w-full"
            >
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1 justify-end">Next <ArrowRight size={11} /></p>
              <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-snug">{nextPost.title}</p>
            </button>
          ) : <div />}
        </div>

        {/* Back to blog */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Blog
          </button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
