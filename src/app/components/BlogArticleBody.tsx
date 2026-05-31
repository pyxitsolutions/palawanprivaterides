import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { Section } from '../data/blog';

interface BlogArticleBodyProps {
  sections: Section[];
}

export function BlogArticleBody({ sections }: BlogArticleBodyProps) {
  const navigate = useNavigate();
  const [loadingCta, setLoadingCta] = useState<string | null>(null);

  return (
    <div className="prose prose-gray max-w-none">
      {sections.map((section, i) => {
        if (section.type === 'h2' && section.text) {
          const id = section.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return (
            <h2 key={i} id={id} className="text-2xl font-black text-gray-900 mt-10 mb-4 scroll-mt-28">
              {section.text}
            </h2>
          );
        }
        if (section.type === 'h3' && section.text) {
          return (
            <h3 key={i} className="text-lg font-black text-gray-900 mt-6 mb-3">
              {section.text}
            </h3>
          );
        }
        if (section.type === 'p' && section.text) {
          return (
            <p key={i} className="text-gray-600 leading-relaxed mb-4">
              {section.text}
            </p>
          );
        }
        if (section.type === 'ul' && section.items) {
          return (
            <ul key={i} className="space-y-2 mb-6">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="text-primary font-black mt-0.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (section.type === 'tip' && section.text) {
          return (
            <div key={i} className="bg-[#e8a020]/10 border border-[#e8a020]/30 rounded-xl p-4 my-6">
              <p className="text-gray-700 text-sm leading-relaxed">{section.text}</p>
            </div>
          );
        }
        if (section.type === 'link' && section.text && section.href) {
          const internal = section.href.startsWith('/');
          return (
            <p key={i} className="mb-4">
              <button
                type="button"
                onClick={() => navigate(section.href!)}
                className="inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:underline"
              >
                {section.text}
                {internal ? <ArrowRight size={14} /> : <ExternalLink size={14} />}
              </button>
            </p>
          );
        }
        if (section.type === 'priceBox' && section.priceRows) {
          return (
            <div
              key={i}
              className="my-8 rounded-2xl border border-[#e8a020]/30 bg-[#1a3728]/5 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[#e8a020]/20 bg-[#1a3728]">
                <p className="text-white font-black text-sm">
                  {section.priceTitle ?? 'Private transfer rates'}
                </p>
                <p className="text-white/60 text-xs mt-0.5">Per booking · whole vehicle · promotional rate</p>
              </div>
              <ul className="divide-y divide-gray-200">
                {section.priceRows.map((row) => (
                  <li key={row.vehicle} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="text-gray-700 font-semibold">{row.vehicle}</span>
                    <span className="text-right">
                      {row.was && (
                        <span className="text-gray-400 line-through text-xs mr-2">₱{row.was}</span>
                      )}
                      <span className="font-black text-[#c8870f]">₱{row.price}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {section.ctaHref && (
                <div className="px-5 py-4 bg-white border-t border-gray-100">
                  <button
                    type="button"
                    disabled={loadingCta === section.ctaHref}
                    onClick={() => {
                      setLoadingCta(section.ctaHref!);
                      setTimeout(() => navigate(section.ctaHref!), 400);
                    }}
                    className="w-full sm:w-auto bg-[#e8a020] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#d49020] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-80"
                  >
                    {section.ctaLabel ?? 'Book now'}
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>
          );
        }
        if (section.type === 'cta' && section.ctaLabel) {
          return (
            <div key={i} className="bg-primary rounded-2xl p-6 my-8 text-center">
              <p className="text-white font-bold mb-4">Ready to explore Palawan?</p>
              <button
                type="button"
                disabled={loadingCta === section.ctaHref}
                onClick={() => {
                  setLoadingCta(section.ctaHref ?? '/book');
                  setTimeout(() => navigate(section.ctaHref ?? '/book'), 500);
                }}
                className="bg-[#e8a020] text-white px-7 py-3 rounded-full font-bold text-sm hover:bg-[#d49020] transition-colors inline-flex items-center gap-2 disabled:opacity-80"
              >
                {loadingCta === section.ctaHref ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    {section.ctaLabel}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
