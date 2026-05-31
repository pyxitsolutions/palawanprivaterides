interface BookingMobileNavProps {
  show: boolean;
  showBack: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  isSubmit?: boolean;
}

export function BookingMobileNav({
  show,
  showBack,
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  isSubmit,
}: BookingMobileNavProps) {
  if (!show) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md px-4 py-3 flex gap-3 safe-area-pb">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600"
        >
          Back
        </button>
      )}
      <button
        type={isSubmit ? 'submit' : 'button'}
        onClick={isSubmit ? undefined : onNext}
        disabled={nextDisabled}
        className={`${showBack ? 'flex-1' : 'w-full'} py-3 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-40`}
      >
        {nextLabel}
      </button>
    </div>
  );
}
