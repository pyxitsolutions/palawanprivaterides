import { Check } from 'lucide-react';

const stepLabels = ['Contact', 'Schedule', 'Passengers', 'Trip Details', 'Review'];

export function BookingStepIndicator({ step }: { step: number }) {
  return (
    <div className="pb-6 mb-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, i) => {
          const num = i + 1;
          const isActive = step === num;
          const isDone = step > num;
          return (
            <div key={num} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                    isDone || isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isDone ? <Check size={14} /> : num}
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] mt-1 font-semibold truncate max-w-[52px] sm:max-w-none text-center ${
                    isActive ? 'text-primary' : isDone ? 'text-primary/60' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 sm:mx-2 mb-4 transition-all ${step > num ? 'bg-primary' : 'bg-gray-200'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { stepLabels };
