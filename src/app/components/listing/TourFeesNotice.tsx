import { Info } from 'lucide-react';

export function TourFeesNotice() {
  return (
    <div className="mb-8 rounded-2xl border border-[#e8a020]/30 bg-[#e8a020]/5 px-5 py-4 flex gap-3">
      <Info size={20} className="text-[#c8870f] shrink-0 mt-0.5" />
      <div className="text-sm text-gray-700 leading-relaxed">
        <p className="font-bold text-gray-900 mb-1">Transparent tour pricing</p>
        <p>
          Rates shown are <span className="font-semibold">per person</span>. Some tours add separate
          government <span className="font-semibold">environmental</span> and{' '}
          <span className="font-semibold">entrance</span> fees — each card shows the extras. No hidden
          surprises at booking.
        </p>
      </div>
    </div>
  );
}
