import { Star, Shield } from 'lucide-react';

export function PageTrustLine({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-2 text-sm ${className}`}>
      <span className="inline-flex items-center gap-1.5 text-white/85 font-medium">
        <Star size={14} className="text-[#e8a020] fill-[#e8a020]" />
        5.0 · 9 Google reviews
      </span>
      <span className="inline-flex items-center gap-1.5 text-white/85 font-medium">
        <Shield size={14} className="text-[#e8a020]" />
        Trusted by 300+ travelers
      </span>
    </div>
  );
}
