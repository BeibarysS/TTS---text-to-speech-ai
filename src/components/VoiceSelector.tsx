import React from 'react';
import { Play, Check, Sparkles, User, AudioLines, Loader2 } from 'lucide-react';
import { KazakhVoice } from '../types/tts';
import { KAZAKH_VOICES } from '../data/voices';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelectVoice: (voice: KazakhVoice) => void;
  onPreviewVoice: (voice: KazakhVoice) => void;
  previewingVoiceId: string | null;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onSelectVoice,
  onPreviewVoice,
  previewingVoiceId,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200">
          Қазақ дауыс бейнесі (Voice Profile)
        </label>
        <span className="text-xs text-slate-400">
          6 табиғи дауыс тембрі
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {KAZAKH_VOICES.map((voice) => {
          const isSelected = voice.id === selectedVoiceId;
          const isPreviewing = previewingVoiceId === voice.id;

          return (
            <div
              key={voice.id}
              onClick={() => onSelectVoice(voice)}
              className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                isSelected
                  ? 'border-amber-500/80 bg-slate-900/90 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              {/* Header with avatar icon and selection indicator */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-semibold text-sm ${
                      voice.gender === 'female'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    }`}
                  >
                    {voice.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {voice.nativeName} ({voice.name})
                      </h4>
                      {isSelected && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-slate-950">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    {/* Zero-pill metadata */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>{voice.gender === 'female' ? 'Әйел дауысы' : 'Ер дауысы'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[11px] text-amber-400/90">{voice.geminiVoice}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  title="Дауысты тыңдап көру (Preview)"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewVoice(voice);
                  }}
                  disabled={isPreviewing}
                  className="cursor-pointer flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-amber-500/60 hover:text-amber-400 transition-colors"
                >
                  {isPreviewing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Tagline */}
              <p className="text-xs text-slate-300 line-clamp-1 mb-2">
                {voice.tagline}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
                {voice.description}
              </p>

              {/* Recommended genres - strictly zero pill typography */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-x-1.5 text-[11px] text-slate-400">
                <span className="text-slate-400">Қолданылуы:</span>
                {voice.recommendedFor.map((item, idx) => (
                  <React.Fragment key={item}>
                    <span className="text-slate-300">{item}</span>
                    {idx < voice.recommendedFor.length - 1 && (
                      <span aria-hidden="true" className="text-slate-400">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
