import React from 'react';
import { X, BookOpen, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface PhoneticsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneticsGuideModal: React.FC<PhoneticsGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Қазақ тілі фонетикасы және TTS нұсқаулығы
              </h3>
              <p className="text-xs text-slate-400">
                Дыбыстау сапасын барынша табиғи әрі шынайы етудің құпиялары
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section 1: Kazakh Vowels & Harmony */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <span>01.</span> Үндестік заңы және қазақтың 9 төл дыбысы
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Қазақ тілінде үндестік (сингармонизм) заңы өте маңызды. Синтезатор табиғи оқуы үшін әріптердің дұрыс жазылуын қадағалаңыз:
          </p>
          <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1">
              <span className="font-semibold text-slate-200">Жуан дауыстылар (Hard vowels):</span>
              <p className="text-slate-400 font-mono">А, О, Ұ, Ы</p>
              <p className="text-[11px] text-slate-400">Сөздер ауыр, терең дауыспен оқылады (мысалы: <em>құлын, қала, орталық</em>).</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1">
              <span className="font-semibold text-slate-200">Жіңішке дауыстылар (Soft vowels):</span>
              <p className="text-slate-400 font-mono">Ә, Ө, Ү, І, Е</p>
              <p className="text-[11px] text-slate-400">Нәзік, ілгері үнмен дыбысталады (мысалы: <em>көктем, әуез, үйрек</em>).</p>
            </div>
          </div>
        </div>

        {/* Section 2: Numbers & Dates */}
        <div className="space-y-2 border-t border-slate-800 pt-4">
          <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <span>02.</span> Сандар мен жылдарды дұрыс оқыту
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Цифрлар (мысалы: <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">2026 жылы</code> немесе <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">45%</code>) автоматты түрде оқылғанда екпін қателігі болмауы үшін редактордағы <strong>«Сандар → Сөз»</strong> батырмасын басыңыз.
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs space-y-1">
            <div className="flex items-center gap-2 text-rose-300">
              <span>✕</span> <span>2026 жылы 15 наурызда</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <span>✓</span> <span>екі мың жиырма алтыншы жылы он бесінші наурызда</span>
            </div>
          </div>
        </div>

        {/* Section 3: SSML & Vocal Bursts */}
        <div className="space-y-2 border-t border-slate-800 pt-4">
          <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <span>03.</span> Интонациялық белгілер мен вокалдық тыныстар
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Gemini Flash TTS моделі арнайы эмоциялық тыныс белгілерін қолдайды. Мәтін ішіне мына белгілерді қосу арқылы шынайы адамның сөйлесін ала аласыз:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5">
              <span className="font-mono text-amber-400">&lt;breath&gt;</span>
              <p className="text-[11px] text-slate-400 mt-1">Ұзын сөйлем алдында табиғи тыныс алу дыбысын қосады.</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5">
              <span className="font-mono text-amber-400">&lt;pause&gt;</span>
              <p className="text-[11px] text-slate-400 mt-1">Ойды түйіндеу немесе назар аудару үшін кідіріс жасайды.</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5">
              <span className="font-mono text-amber-400">&lt;laugh&gt;</span>
              <p className="text-[11px] text-slate-400 mt-1">Жылы, достық көңіл-күйдегі жеңіл күлкі репликасы.</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
          >
            Түсінікті, жабу
          </button>
        </div>
      </div>
    </div>
  );
};
