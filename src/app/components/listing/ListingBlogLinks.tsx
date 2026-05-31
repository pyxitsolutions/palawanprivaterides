import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';

interface Link {
  slug: string;
  title: string;
}

export function ListingBlogLinks({ links, heading }: { links: Link[]; heading: string }) {
  const navigate = useNavigate();

  return (
    <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-[#e8a020]" />
        <h2 className="text-lg font-black text-gray-900">{heading}</h2>
      </div>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.slug}>
            <button
              type="button"
              onClick={() => navigate(`/blog/${link.slug}`)}
              className="w-full text-left flex items-center justify-between gap-2 text-sm font-semibold text-primary hover:underline py-1"
            >
              {link.title}
              <ArrowRight size={14} className="shrink-0" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
