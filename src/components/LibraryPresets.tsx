import React, { useState } from 'react';
import { BookOpen, ArrowRight, User, Sparkles } from 'lucide-react';
import { KAZAKH_LIBRARY_PRESETS, LibraryPreset } from '../data/voices';
import { KAZAKH_VOICES } from '../data/voices';

interface LibraryPresetsProps {
  onSelectPreset: (preset: LibraryPreset) => void;
}

export const LibraryPresets: React.FC<LibraryPresetsProps> = ({ onSelectPreset }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Барлық үлгілер' },
    { id: 'literature', label: 'Классикалық әдебиет' },
    { id: 'poetry', label: 'Поэзия' },
    { id: 'news', label: 'Ғылым және IT' },
    { id: 'business', label: 'Бизнес және қызмет' },
    { id: 'dialogue', label: 'Подкаст' },
  ];

  const filteredPresets = selectedCategory === 'all'
    ? KAZAKH_LIBRARY_PRESETS
    : KAZAKH_LIBRARY_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Қазақ тілінің бай сөздік үлгілері (Kazakh Sample Library)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Абай мен Мұқағали туындыларынан бастап заманауи IT жаңалықтары мен бизнес хабарландыруларына дейінгі дайын мәтіндер.
          </p>
        </div>

        {/* Category switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`cursor-pointer rounded-md px-2.5 py-1 transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Presets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPresets.map((preset) => {
          const recVoice = KAZAKH_VOICES.find((v) => v.id === preset.recommendedVoiceId);

          return (
            <div
              key={preset.id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 hover:bg-slate-900/70 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-amber-400/90">
                    {preset.categoryLabel}
                  </span>
                  {recVoice && (
                    <span className="text-[11px] text-slate-400">
                      Ұсынылатын дауыс: <strong className="text-slate-200 font-semibold">{recVoice.nativeName}</strong>
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight">
                  {preset.title}
                  {preset.author && (
                    <span className="ml-1.5 text-xs font-normal text-slate-400">
                      — {preset.author}
                    </span>
                  )}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  "{preset.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                  {preset.text.length} таңба · {preset.text.split(/\s+/).length} сөз
                </span>

                <button
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 hover:border-amber-500 transition-colors"
                >
                  <span>Студияға жүктеу</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
