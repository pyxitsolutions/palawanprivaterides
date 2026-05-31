import { useNavigate } from 'react-router-dom';
import { Car, MessageCircle } from 'lucide-react';

const WHATSAPP =
  'https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20read%20your%20blog%20and%20want%20to%20book%20in%20Palawan.';

interface BlogStickyCtaProps {
  bookHref?: string;
}

export function BlogStickyCta({ bookHref = '/rides' }: BlogStickyCtaProps) {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] border-t border-gray-200 bg-white/95 backdrop-blur-md px-4 py-3 flex gap-2">
      <button
        type="button"
        onClick={() => navigate(bookHref)}
        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e8a020] text-white py-3 rounded-xl font-bold text-sm"
      >
        <Car size={16} />
        Book now
      </button>
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#25D366] px-4 py-3 rounded-xl font-bold text-sm"
        aria-label="WhatsApp"
      >
        <MessageCircle size={18} />
      </a>
    </div>
  );
}
