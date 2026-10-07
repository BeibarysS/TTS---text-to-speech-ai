import React, { useState } from 'react';
import {
  History,
  Play,
  Pause,
  Download,
  Trash2,
  Clock,
  Volume2,
  Music,
  Calendar
} from 'lucide-react';
import { GenerationHistoryItem } from '../types/tts';

interface HistoryArchiveProps {
  history: GenerationHistoryItem[];
  onPlayItem: (item: GenerationHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  currentlyPlayingId: string | null;
}

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({
  history,
  onPlayItem,
  onClearHistory,
  onDeleteItem,
  currentlyPlayingId,
}) => {
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString('kk-KZ')} ${d.toLocaleTimeString('kk-KZ', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const handleDownloadItem = (item: GenerationHistoryItem) => {
    const link = document.createElement('a');
    link.href = `data:audio/wav;base64,${item.audioBase64}`;
    link.download = `un_kazakh_tts_${item.voiceName.toLowerCase()}_${item.id}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center backdrop-blur-sm space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
          <History className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200">
          Синтез тарихы әзірге бос
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Дауыс студиясы немесе диалог шеберханасы арқылы қазақша мәтінді дыбыстағаннан кейін барлық аудио файлдар осы жерде сақталады.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            Синтезделген аудиолар тарихы ({history.length} файл)
          </h3>
          <p className="text-xs text-slate-400">
            Браузер жадында сақталған соңғы жазбалар
          </p>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:border-rose-500/50 hover:text-rose-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Тарихты тазарту</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {history.map((item) => {
          const isPlaying = currentlyPlayingId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isPlaying
                  ? 'border-amber-500/70 bg-slate-900/90 shadow-md shadow-amber-500/10'
                  : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => onPlayItem(item)}
                  className={`cursor-pointer flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform active:scale-95 ${
                    isPlaying
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'border border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-500/50 hover:text-amber-400'
                  }`}
                  title={isPlaying ? 'Тоқтату' : 'Ойнату'}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  )}
                </button>

                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-slate-200 line-clamp-1 font-medium">
                    "{item.text}"
                  </p>
                  {/* Zero-pill metadata */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="font-semibold text-amber-400/90">
                      {item.voiceName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{item.charCount} таңба</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{item.wordCount} сөз</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatTime(item.timestamp)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownloadItem(item)}
                  className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:border-amber-500/50 hover:text-white transition-colors"
                  title="WAV форматында жүктеу"
                >
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline">Жүктеу</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  className="cursor-pointer p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Өшіру"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
