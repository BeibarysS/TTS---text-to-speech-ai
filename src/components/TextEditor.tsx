import React, { useRef, useState } from 'react';
import {
  Wand2,
  Binary,
  Languages,
  Sparkles,
  Trash2,
  Sliders,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { cyrillicToLatin, latinToCyrillic, expandNumbersInText } from '../utils/kazakhConverter';

interface TextEditorProps {
  text: string;
  onChange: (newText: string) => void;
  stylePrompt: string;
  onStylePromptChange: (newStyle: string) => void;
  modelType: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts';
  onModelTypeChange: (model: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts') => void;
  onEnhanceText: (mode: 'normalize_numbers' | 'add_prosody' | 'to_latin' | 'to_cyrillic' | 'check_grammar') => void;
  isEnhancing: boolean;
}

const KAZAKH_LETTERS = ['ә', 'і', 'ң', 'ғ', 'ү', 'ұ', 'қ', 'ө', 'һ'];
const KAZAKH_LETTERS_UPPER = ['Ә', 'І', 'Ң', 'Ғ', 'Ү', 'Ұ', 'Қ', 'Ө', 'Һ'];

const STYLE_PRESETS = [
  { label: 'Табиғи сөйлесу', value: 'Warm, natural, conversational Kazakh native speaker with authentic prosody and gentle vowel cadence' },
  { label: 'Жаңалықтар дикторы', value: 'Crisp, articulate, professional Kazakh news anchor with impeccable diction and dynamic newsroom delivery' },
  { label: 'Көркем оқу / Поэзия', value: 'Soulful, lyrical Kazakh poetry recitation with deep emotional nuance and rhythmic cadence' },
  { label: 'Салтанатты / Эпос', value: 'Deep, resonant, authoritative Kazakh male orator with grounded gravitas and epic cadence' },
  { label: 'Түсіндірме сабақ', value: 'Calm, gentle, articulate Kazakh educator with soothing clarity and clear pronunciation' },
  { label: 'Ертегі / Әңгіме', value: 'Engaging, expressive storyteller with vivid intonation and warm pacing' },
];

export const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onChange,
  stylePrompt,
  onStylePromptChange,
  modelType,
  onModelTypeChange,
  onEnhanceText,
  isEnhancing,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [isUpper, setIsUpper] = useState(false);

  const insertAtCursor = (content: string) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(text + content);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const nextText = text.substring(0, start) + content + text.substring(end);
    onChange(nextText);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + content.length, start + content.length);
    }, 0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLocalNumberExpand = () => {
    const expanded = expandNumbersInText(text);
    onChange(expanded);
  };

  const handleLocalToLatin = () => {
    const lat = cyrillicToLatin(text);
    onChange(lat);
  };

  const handleLocalToCyrillic = () => {
    const cyr = latinToCyrillic(text);
    onChange(cyr);
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5 backdrop-blur-sm space-y-4">
      {/* Top tools bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-200">
            Дыбысталатын мәтін (Kazakh Text)
          </label>
        </div>

        {/* Text Actions */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={handleLocalNumberExpand}
            title="Сандарды жазбаша қазақша сөзге айналдыру"
            className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:border-amber-500/50 hover:text-white transition-colors"
          >
            <Binary className="h-3 w-3 text-amber-400" />
            <span>Сандар → Сөз</span>
          </button>

          <button
            type="button"
            onClick={handleLocalToLatin}
            title="Жаңа латын әліпбиіне өткізу"
            className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:border-amber-500/50 hover:text-white transition-colors"
          >
            <Languages className="h-3 w-3 text-emerald-400" />
            <span>Латынға</span>
          </button>

          <button
            type="button"
            onClick={handleLocalToCyrillic}
            title="Кириллицаға өткізу"
            className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:border-amber-500/50 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3 w-3 text-cyan-400" />
            <span>Кириллге</span>
          </button>

          <button
            type="button"
            onClick={() => onEnhanceText('add_prosody')}
            disabled={isEnhancing || !text.trim()}
            title="AI арқылы интонация мен тыныс белгілерін реттеу"
            className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-amber-300 hover:bg-amber-500/20 disabled:opacity-50 transition-colors"
          >
            <Wand2 className="h-3 w-3" />
            <span>AI Ырғақ</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/80 px-2 py-1 text-slate-300 hover:text-white transition-colors"
            title="Көшіріп алу"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </button>

          {text && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/80 px-2 py-1 text-slate-400 hover:text-rose-400 transition-colors"
              title="Тазарту"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Kazakh Specific Letters Quick-Insertion Bar */}
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/60 p-1.5">
        <span className="text-[11px] font-medium text-slate-400 px-2">
          Қазақ әріптері:
        </span>
        <button
          type="button"
          onClick={() => setIsUpper(!isUpper)}
          className="cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-semibold text-amber-400 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
          title="Бас / кіші әріптерді ауыстыру"
        >
          {isUpper ? 'Бас' : 'Кіші'}
        </button>
        <div className="flex flex-wrap items-center gap-1">
          {(isUpper ? KAZAKH_LETTERS_UPPER : KAZAKH_LETTERS).map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => insertAtCursor(letter)}
              className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-200 hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
            >
              {letter}
            </button>
          ))}
        </div>

        {/* SSML and Prosody Tags */}
        <div className="ml-auto hidden sm:flex items-center gap-1 pl-2 border-l border-slate-800 text-[11px]">
          <span className="text-slate-400 mr-1">Интонация:</span>
          <button
            type="button"
            onClick={() => insertAtCursor(' <pause> ')}
            className="cursor-pointer rounded px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300"
            title="Кідіріс енгізу"
          >
            &lt;pause&gt;
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor(' <breath> ')}
            className="cursor-pointer rounded px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300"
            title="Тыныс алу"
          >
            &lt;breath&gt;
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor(' <laugh> ')}
            className="cursor-pointer rounded px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300"
            title="Күлкі енгізу"
          >
            &lt;laugh&gt;
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Дыбысталатын қазақша мәтінді осында жазыңыз немесе қойыңыз (мысалы: Сәлеметсіз бе! Бүгін ауа райы тамаша...)"
          rows={6}
          className="w-full resize-y rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-sm leading-relaxed text-slate-100 placeholder-slate-400 focus:border-amber-500/80 focus:outline-hidden focus:ring-1 focus:ring-amber-500/50"
        />
      </div>

      {/* Textarea Bottom Bar: Counters & Model & Style toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {/* Tabular numerals */}
          <span className="font-mono tabular-nums text-slate-400">
            {charCount} таңба
          </span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="font-mono tabular-nums text-slate-400">
            {wordCount} сөз
          </span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="font-mono tabular-nums text-slate-400">
            ~{Math.max(1, Math.round(wordCount / 2.2))} сек болжам
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* TTS Model selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => onModelTypeChange('gemini-3.8-flash-lite-tts')}
              className={`cursor-pointer rounded px-2 py-0.5 transition-colors whitespace-nowrap ${
                modelType === 'gemini-3.8-flash-lite-tts'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Жедел әрі үнемді TTS моделі"
            >
              Flash-Lite TTS
            </button>
            <button
              type="button"
              onClick={() => onModelTypeChange('gemini-3.8-flash-tts')}
              className={`cursor-pointer rounded px-2 py-0.5 transition-colors whitespace-nowrap ${
                modelType === 'gemini-3.8-flash-tts'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Флагмандық дауыс дизайнері моделі"
            >
              Flash TTS (Премиум)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowStylePanel(!showStylePanel)}
            className={`cursor-pointer inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 transition-colors ${
              showStylePanel
                ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="h-3 w-3" />
            <span>Интонация мен стиль</span>
          </button>
        </div>
      </div>

      {/* Style & Prosody tuning panel (Collapsible) */}
      {showStylePanel && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Сөйлеу мәнері мен интонация нұсқаулығы (Speech Style Directive)
            </span>
            <span className="text-[11px] text-slate-400">
              Gemini Audio кондиционирлеу
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onStylePromptChange(preset.value)}
                className={`cursor-pointer rounded-md border px-2 py-1 text-xs transition-colors ${
                  stylePrompt === preset.value
                    ? 'border-amber-500/70 bg-amber-500/20 text-amber-300 font-medium'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={stylePrompt}
            onChange={(e) => onStylePromptChange(e.target.value)}
            placeholder="Арнайы стиль (мысалы: Warm, natural, energetic Kazakh speaker with enthusiastic cadence)"
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:border-amber-500/80 focus:outline-hidden"
          />
        </div>
      )}
    </div>
  );
};
