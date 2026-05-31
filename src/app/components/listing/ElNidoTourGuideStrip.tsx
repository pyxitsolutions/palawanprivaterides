import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function ElNidoTourGuideStrip() {
  const navigate = useNavigate();

  return (
    <div className="mb-8 rounded-2xl overflow-hidden border border-[#1a3728]/20 flex flex-col sm:flex-row">
      <div className="bg-[#1a3728] text-white p-5 sm:p-6 flex-1">
        <p className="text-[#e8a020] text-[10px] font-bold uppercase tracking-widest mb-2">El Nido</p>
        <h2 className="text-xl font-black mb-2">Tours A, B, C or D?</h2>
        <p className="text-white/75 text-sm leading-relaxed">
          Each route covers different lagoons, beaches, and caves. Read our comparison guide before you
          book.
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/blog/el-nido-island-tours-guide')}
        className="flex items-center justify-center gap-2 bg-[#e8a020] text-[#1a3728] px-6 py-4 font-black text-sm hover:bg-[#ffc84d] transition-colors sm:min-w-[160px]"
      >
        Compare tours
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
