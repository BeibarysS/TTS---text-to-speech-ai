import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  Volume2,
  MessageSquare,
  Play
} from 'lucide-react';
import { DialogueTurn } from '../types/tts';
import { KAZAKH_VOICES } from '../data/voices';

interface DialogueStudioProps {
  onGenerateDialogue: (
    turns: DialogueTurn[],
    speakerConfigs: { name: string; voiceName: 'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Aoede' | 'Charon' }[]
  ) => Promise<void>;
  isGenerating: boolean;
}

const DEFAULT_TURNS: DialogueTurn[] = [
  {
    id: 'turn_1',
    speaker: 'Данияр',
    voiceName: 'Puck',
    text: 'Сәлем, Алтынай! Соңғы кездері қазақ тіліндегі дауыстық технологиялар қалай қарқынды дамып жатыр, байқадың ба?',
    style: 'Casual, bright young podcaster opening conversation',
  },
  {
    id: 'turn_2',
    speaker: 'Алтынай',
    voiceName: 'Kore',
    text: 'Иә, Данияр, әрине! Әсіресе дауыс ырғағы мен қазақша төл дыбыстардың табиғи естілуі таңғалдырады.',
    style: 'Warm, melodious, approving conversational responder',
  },
  {
    id: 'turn_3',
    speaker: 'Данияр',
    voiceName: 'Puck',
    text: 'Дәл солай! Енді аудиокітаптар мен подкастарды кез келген уақытта сапалы дыбыстауға болады.',
    style: 'Enthusiastic, encouraging tech enthusiast',
  },
  {
    id: 'turn_4',
    speaker: 'Алтынай',
    voiceName: 'Kore',
    text: 'Өте дұрыс айтасың. Тіліміздің цифрлық кеңістіктегі мәртебесі арта берсін!',
    style: 'Uplifting, warm closing remark',
  },
];

export const DialogueStudio: React.FC<DialogueStudioProps> = ({
  onGenerateDialogue,
  isGenerating,
}) => {
  const [speaker1Name, setSpeaker1Name] = useState('Данияр');
  const [speaker1Voice, setSpeaker1Voice] = useState<'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Aoede' | 'Charon'>('Puck');

  const [speaker2Name, setSpeaker2Name] = useState('Алтынай');
  const [speaker2Voice, setSpeaker2Voice] = useState<'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Aoede' | 'Charon'>('Kore');

  const [turns, setTurns] = useState<DialogueTurn[]>(DEFAULT_TURNS);

  const handleAddTurn = () => {
    const lastTurnSpeaker = turns.length > 0 ? turns[turns.length - 1].speaker : speaker1Name;
    const nextSpeaker = lastTurnSpeaker === speaker1Name ? speaker2Name : speaker1Name;
    const nextVoice = nextSpeaker === speaker1Name ? speaker1Voice : speaker2Voice;

    setTurns([
      ...turns,
      {
        id: `turn_${Date.now()}`,
        speaker: nextSpeaker,
        voiceName: nextVoice,
        text: '',
        style: 'Natural conversational Kazakh',
      },
    ]);
  };

  const handleRemoveTurn = (id: string) => {
    setTurns(turns.filter((t) => t.id !== id));
  };

  const handleUpdateTurnText = (id: string, text: string) => {
    setTurns(turns.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const handleToggleSpeaker = (id: string) => {
    setTurns(
      turns.map((t) => {
        if (t.id !== id) return t;
        const isSpk1 = t.speaker === speaker1Name;
        return {
          ...t,
          speaker: isSpk1 ? speaker2Name : speaker1Name,
          voiceName: isSpk1 ? speaker2Voice : speaker1Voice,
        };
      })
    );
  };

  const handleSubmit = () => {
    const validTurns = turns.filter((t) => t.text.trim().length > 0);
    if (validTurns.length === 0) return;

    onGenerateDialogue(validTurns, [
      { name: speaker1Name, voiceName: speaker1Voice },
      { name: speaker2Name, voiceName: speaker2Voice },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header and description */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Екі дауысты диалог шеберханасы (Multi-Speaker Dialogue)
            </h3>
            <p className="text-xs text-slate-400">
              Gemini 3.8 Flash TTS арқылы екі кейіпкердің арасындағы табиғи қазақша әңгімені бір тұтас аудиоға синтездеңіз.
            </p>
          </div>
        </div>

        {/* Speaker Profiles Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
          {/* Speaker 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400">
                1-Спикер (Speaker A)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {speaker1Voice}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Аты (Name):</label>
                <input
                  type="text"
                  value={speaker1Name}
                  onChange={(e) => setSpeaker1Name(e.target.value)}
                  className="w-full rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-amber-500/80 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Дауысы (Voice):</label>
                <select
                  value={speaker1Voice}
                  onChange={(e) => setSpeaker1Voice(e.target.value as any)}
                  className="w-full rounded-md border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 focus:border-amber-500/80 focus:outline-hidden cursor-pointer"
                >
                  {KAZAKH_VOICES.map((v) => (
                    <option key={v.id} value={v.geminiVoice}>
                      {v.nativeName} ({v.geminiVoice})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Speaker 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400">
                2-Спикер (Speaker B)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {speaker2Voice}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Аты (Name):</label>
                <input
                  type="text"
                  value={speaker2Name}
                  onChange={(e) => setSpeaker2Name(e.target.value)}
                  className="w-full rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-amber-500/80 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Дауысы (Voice):</label>
                <select
                  value={speaker2Voice}
                  onChange={(e) => setSpeaker2Voice(e.target.value as any)}
                  className="w-full rounded-md border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 focus:border-amber-500/80 focus:outline-hidden cursor-pointer"
                >
                  {KAZAKH_VOICES.map((v) => (
                    <option key={v.id} value={v.geminiVoice}>
                      {v.nativeName} ({v.geminiVoice})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogue Turns Sequence */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200">
            Диалог репликалары ({turns.length} кезең)
          </label>
          <button
            type="button"
            onClick={handleAddTurn}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-amber-500/60 hover:text-white transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-amber-400" />
            <span>Реплика қосу</span>
          </button>
        </div>

        <div className="space-y-3">
          {turns.map((turn, index) => {
            const isSpk1 = turn.speaker === speaker1Name;
            return (
              <div
                key={turn.id}
                className={`rounded-xl border p-4 transition-all ${
                  isSpk1
                    ? 'border-amber-500/30 bg-slate-900/70 ml-0 mr-4'
                    : 'border-emerald-500/30 bg-slate-900/70 ml-4 mr-0'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSpeaker(turn.id)}
                      className={`cursor-pointer rounded-md px-2 py-0.5 text-xs font-bold transition-colors ${
                        isSpk1
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                      title="Спикерді ауыстыру"
                    >
                      {turn.speaker}
                    </button>
                    <span className="text-[11px] text-slate-400">
                      #{index + 1} реплика
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveTurn(turn.id)}
                    disabled={turns.length <= 1}
                    className="cursor-pointer text-slate-500 hover:text-rose-400 disabled:opacity-30 transition-colors"
                    title="Өшіру"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <textarea
                  value={turn.text}
                  onChange={(e) => handleUpdateTurnText(turn.id, e.target.value)}
                  rows={2}
                  placeholder={`${turn.speaker} сөзін осында жазыңыз...`}
                  className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-sm text-slate-100 placeholder-slate-400 focus:border-amber-500/80 focus:outline-hidden"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Synthesis Trigger Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isGenerating || turns.every((t) => !t.text.trim())}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all active:scale-95"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
              <span>Диалог синтезделуде...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Диалогты дыбыстау (Gemini Flash TTS)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
