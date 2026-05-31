import { slugify } from '../../pages/ServicePage';

interface PopularRouteChipsProps {
  names: string[];
  onSelect: (name: string) => void;
}

export function PopularRouteChips({ names, onSelect }: PopularRouteChipsProps) {
  return (
    <div className="mb-8">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">
        Popular routes
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {names.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              onSelect(name);
              const el = document.getElementById(`listing-${slugify(name)}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="px-4 py-2 rounded-full text-sm font-semibold bg-white border border-[#e8a020]/40 text-gray-800 hover:bg-[#e8a020]/10 hover:border-[#e8a020] transition-colors"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
