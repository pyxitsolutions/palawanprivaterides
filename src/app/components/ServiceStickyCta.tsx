import { Car, MessageCircle } from 'lucide-react';

interface ServiceStickyCtaProps {
  onBook: () => void;
  booking: boolean;
  whatsappHref: string;
}

export function ServiceStickyCta({ onBook, booking, whatsappHref }: ServiceStickyCtaProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] border-t border-gray-200 bg-white/95 backdrop-blur-md px-4 py-3 flex gap-2">
      <button
        type="button"
        disabled={booking}
        onClick={onBook}
        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e8a020] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-80"
      >
        <Car size={16} />
        {booking ? 'Loading…' : 'Book now'}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-4 py-3 rounded-xl border-2 border-[#25D366] text-[#25D366] font-bold text-sm"
        aria-label="WhatsApp"
      >
        <MessageCircle size={18} />
      </a>
    </div>
  );
}
