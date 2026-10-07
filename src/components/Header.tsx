import React from 'react';
import { Volume2, BookOpen, Sparkles } from 'lucide-react';
import { TtsMode } from '../types/tts';

interface HeaderProps {
  currentMode: TtsMode;
  onModeChange: (mode: TtsMode) => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-sm shadow-amber-500/20">
            <Volume2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Үн · Kazakh Speech Studio
          </span>
        </div>

        {/* Zone 2: Navigation segmented control tabs */}
        <nav className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => onModeChange('studio')}
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors whitespace-nowrap ${
              currentMode === 'studio'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Дауыс студиясы
          </button>
          <button
            type="button"
            onClick={() => onModeChange('dialogue')}
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors whitespace-nowrap ${
              currentMode === 'dialogue'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Диалог шеберханасы
          </button>
          <button
            type="button"
            onClick={() => onModeChange('library')}
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors whitespace-nowrap ${
              currentMode === 'library'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Үлгілер мен әдебиет
          </button>
          <button
            type="button"
            onClick={() => onModeChange('history')}
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors whitespace-nowrap ${
              currentMode === 'history'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Аудио тарихы
          </button>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenGuide}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-amber-500/50 hover:bg-slate-800 hover:text-white"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Фонетика & SSML</span>
            <span className="md:hidden">Анықтама</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex sm:hidden overflow-x-auto border-t border-slate-800/60 bg-slate-950 px-2 py-1 gap-1">
        <button
          type="button"
          onClick={() => onModeChange('studio')}
          className={`flex-1 py-1.5 px-2 text-xs rounded-md text-center whitespace-nowrap ${
            currentMode === 'studio' ? 'bg-amber-500 text-slate-950 font-medium' : 'text-slate-400'
          }`}
        >
          Студия
        </button>
        <button
          type="button"
          onClick={() => onModeChange('dialogue')}
          className={`flex-1 py-1.5 px-2 text-xs rounded-md text-center whitespace-nowrap ${
            currentMode === 'dialogue' ? 'bg-amber-500 text-slate-950 font-medium' : 'text-slate-400'
          }`}
        >
          Диалог
        </button>
        <button
          type="button"
          onClick={() => onModeChange('library')}
          className={`flex-1 py-1.5 px-2 text-xs rounded-md text-center whitespace-nowrap ${
            currentMode === 'library' ? 'bg-amber-500 text-slate-950 font-medium' : 'text-slate-400'
          }`}
        >
          Үлгілер
        </button>
        <button
          type="button"
          onClick={() => onModeChange('history')}
          className={`flex-1 py-1.5 px-2 text-xs rounded-md text-center whitespace-nowrap ${
            currentMode === 'history' ? 'bg-amber-500 text-slate-950 font-medium' : 'text-slate-400'
          }`}
        >
          Тарих
        </button>
      </div>
    </header>
  );
};
