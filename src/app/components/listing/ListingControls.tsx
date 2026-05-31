export type SortOption = 'popular' | 'price-asc';

interface ListingControlsProps {
  resultCount: number;
  resultLabel: string;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  groupBy: boolean;
  onGroupByChange: (v: boolean) => void;
  showGroupToggle?: boolean;
}

export function ListingControls({
  resultCount,
  resultLabel,
  sort,
  onSortChange,
  groupBy,
  onGroupByChange,
  showGroupToggle = true,
}: ListingControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <p className="text-sm text-gray-500">
        Showing <span className="font-bold text-gray-800">{resultCount}</span> {resultLabel}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {showGroupToggle && (
          <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={groupBy}
              onChange={(e) => onGroupByChange(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            Group by area
          </label>
        )}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="text-sm font-semibold border border-gray-200 rounded-full px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Sort order"
        >
          <option value="popular">Most popular</option>
          <option value="price-asc">Price: low to high</option>
        </select>
      </div>
    </div>
  );
}
