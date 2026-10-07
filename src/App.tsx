/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Volume2,
  AudioWaveform,
  SlidersHorizontal,
  BookmarkPlus
} from 'lucide-react';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { TextEditor } from './components/TextEditor';
import { AudioPlayer } from './components/AudioPlayer';
import { DialogueStudio } from './components/DialogueStudio';
import { LibraryPresets } from './components/LibraryPresets';
import { HistoryArchive } from './components/HistoryArchive';
import { PhoneticsGuideModal } from './components/PhoneticsGuideModal';
import { KazakhVoice, TtsMode, GenerationHistoryItem, DialogueTurn } from './types/tts';
import { KAZAKH_VOICES, LibraryPreset } from './data/voices';

const studioBackdropPath = '/src/assets/images/kazakh_sound_studio_backdrop_1791346486145.jpg';
const avatarSpeakerPath = '/src/assets/images/avatar_kazakh_speaker_1791346503265.jpg';

export default function App() {
  const [currentMode, setCurrentMode] = useState<TtsMode>('studio');
  const [selectedVoice, setSelectedVoice] = useState<KazakhVoice>(KAZAKH_VOICES[0]);
  const [text, setText] = useState<string>(KAZAKH_VOICES[0].sampleText);
  const [stylePrompt, setStylePrompt] = useState<string>(KAZAKH_VOICES[0].defaultStyle);
  const [modelType, setModelType] = useState<'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts'>('gemini-3.8-flash-lite-tts');

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeAudio, setActiveAudio] = useState<{
    base64: string;
    voiceName: string;
    charCount?: number;
    wordCount?: number;
    generationTimeMs?: number;
    model?: string;
  } | null>(null);

  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('un_tts_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentlyPlayingHistoryId, setCurrentlyPlayingHistoryId] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('un_tts_history', JSON.stringify(history));
    } catch {
      // Storage quota safety
    }
  }, [history]);

  // Voice selection handler
  const handleSelectVoice = (voice: KazakhVoice) => {
    setSelectedVoice(voice);
    setStylePrompt(voice.defaultStyle);
  };

  // Quick preview voice handler
  const handlePreviewVoice = async (voice: KazakhVoice) => {
    setPreviewingVoiceId(voice.id);
    setError(null);
    try {
      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: voice.sampleText,
          voiceName: voice.geminiVoice,
          style: voice.defaultStyle,
          modelType: 'gemini-3.8-flash-lite-tts',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Дауыс алдын-ала тыңдау қателігі');
      }

      setActiveAudio({
        base64: data.audioBase64,
        voiceName: `${voice.nativeName} (${voice.name})`,
        charCount: data.metrics?.charCount,
        wordCount: data.metrics?.wordCount,
        generationTimeMs: data.metrics?.generationTimeMs,
        model: data.metrics?.model,
      });
    } catch (err: any) {
      setError(err?.message || 'Дауысты тыңдау мүмкін болмады');
    } finally {
      setPreviewingVoiceId(null);
    }
  };

  // Main single-speaker synthesis handler
  const handleSynthesize = async () => {
    if (!text.trim()) {
      setError('Дыбыстау үшін мәтін енгізіңіз.');
      return;
    }

    setIsSynthesizing(true);
    setError(null);

    try {
      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voiceName: selectedVoice.geminiVoice,
          style: stylePrompt,
          modelType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Дауыс синтезі кезінде қате орын алды.');
      }

      const newAudioItem = {
        base64: data.audioBase64,
        voiceName: `${selectedVoice.nativeName} (${selectedVoice.name})`,
        charCount: data.metrics?.charCount,
        wordCount: data.metrics?.wordCount,
        generationTimeMs: data.metrics?.generationTimeMs,
        model: data.metrics?.model,
      };

      setActiveAudio(newAudioItem);

      // Add to archive
      const historyEntry: GenerationHistoryItem = {
        id: `gen_${Date.now()}`,
        timestamp: Date.now(),
        text: text.trim(),
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.nativeName,
        audioBase64: data.audioBase64,
        durationFormatted: `${Math.max(1, Math.round(data.metrics?.wordCount / 2.2))} сек`,
        model: data.metrics?.model,
        charCount: data.metrics?.charCount,
        wordCount: data.metrics?.wordCount,
      };

      setHistory((prev) => [historyEntry, ...prev.slice(0, 24)]);
    } catch (err: any) {
      setError(err?.message || 'Дауысты дыбыстау мүмкін болмады. Сервер жауабын тексеріңіз.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Dialogue synthesis handler
  const handleGenerateDialogue = async (
    turns: DialogueTurn[],
    speakerConfigs: { name: string; voiceName: 'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Aoede' | 'Charon' }[]
  ) => {
    setIsSynthesizing(true);
    setError(null);

    try {
      const response = await fetch('/api/tts/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turns, speakerConfigs }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Диалог синтезі кезінде қате орын алды.');
      }

      const combinedText = turns.map((t) => `${t.speaker}: ${t.text}`).join(' \n');

      const newAudioItem = {
        base64: data.audioBase64,
        voiceName: `${speakerConfigs[0].name} & ${speakerConfigs[1].name}`,
        generationTimeMs: data.metrics?.generationTimeMs,
        model: 'gemini-3.8-flash-tts',
      };

      setActiveAudio(newAudioItem);

      const historyEntry: GenerationHistoryItem = {
        id: `dlg_${Date.now()}`,
        timestamp: Date.now(),
        text: combinedText,
        voiceId: 'dialogue',
        voiceName: `${speakerConfigs[0].name} & ${speakerConfigs[1].name}`,
        audioBase64: data.audioBase64,
        durationFormatted: `${turns.length * 3} сек`,
        model: 'gemini-3.8-flash-tts',
        charCount: combinedText.length,
        wordCount: combinedText.split(/\s+/).length,
        isDialogue: true,
      };

      setHistory((prev) => [historyEntry, ...prev.slice(0, 24)]);
    } catch (err: any) {
      setError(err?.message || 'Диалогты синтездеуде қате болды.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // AI Text enhance handler
  const handleEnhanceText = async (
    mode: 'normalize_numbers' | 'add_prosody' | 'to_latin' | 'to_cyrillic' | 'check_grammar'
  ) => {
    if (!text.trim()) return;

    setIsEnhancing(true);
    setError(null);

    try {
      const response = await fetch('/api/tts/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Мәтінді өңдеуде қате болды');
      }

      if (data.enhancedText) {
        setText(data.enhancedText);
      }
    } catch (err: any) {
      setError(err?.message || 'Мәтінді жетілдіру мүмкін болмады');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Select preset from library
  const handleSelectPreset = (preset: LibraryPreset) => {
    setText(preset.text);
    setStylePrompt(preset.style);
    const matchedVoice = KAZAKH_VOICES.find((v) => v.id === preset.recommendedVoiceId);
    if (matchedVoice) {
      setSelectedVoice(matchedVoice);
    }
    setCurrentMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Play history item in audio player
  const handlePlayHistoryItem = (item: GenerationHistoryItem) => {
    setCurrentlyPlayingHistoryId(item.id);
    setActiveAudio({
      base64: item.audioBase64,
      voiceName: item.voiceName,
      charCount: item.charCount,
      wordCount: item.wordCount,
      model: item.model,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar contract */}
      <Header
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Banner with Studio Atmosphere */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="absolute inset-0 z-0">
            <img
              src={studioBackdropPath}
              alt="Kazakh Speech Synthesis Acoustic Studio"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
                <span>ҚАЗАҚ ТІЛІНДЕГІ ДАУЫС СИНТЕЗІ</span>
                <span aria-hidden="true">·</span>
                <span>GEMINI 3.8 NEURAL TTS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Қазақ тілінің табиғи әуезі мен бай интонациясы
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                6 табиғи қазақ дауыс бейнесі, үндестік заңына бейімделген фонетикалық құралдар, және екі кейіпкерлі диалогты бір мезетте дыбыстау мүмкіндігі.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 rounded-xl border border-slate-800 bg-slate-950/70 p-3 backdrop-blur-sm">
              <img
                src={avatarSpeakerPath}
                alt="Kazakh sound artist"
                referrerPolicy="no-referrer"
                className="h-12 w-12 rounded-lg object-cover border border-amber-500/30"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-100 block">Үн Студиясы</span>
                <span className="text-slate-400 block font-mono text-[11px]">24,000 Hz Hi-Fi WAV</span>
                <span className="text-amber-400 font-medium text-[11px]">Жоғары сапалы дыбыс</span>
              </div>
            </div>
          </div>
        </section>

        {/* Global Error Banner */}
        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white font-semibold ml-2 cursor-pointer"
            >
              Жабу
            </button>
          </div>
        )}

        {/* Studio View */}
        {currentMode === 'studio' && (
          <div className="space-y-6">
            {/* 1. Voice Selector */}
            <VoiceSelector
              selectedVoiceId={selectedVoice.id}
              onSelectVoice={handleSelectVoice}
              onPreviewVoice={handlePreviewVoice}
              previewingVoiceId={previewingVoiceId}
            />

            {/* 2. Text Editor */}
            <TextEditor
              text={text}
              onChange={setText}
              stylePrompt={stylePrompt}
              onStylePromptChange={setStylePrompt}
              modelType={modelType}
              onModelTypeChange={setModelType}
              onEnhanceText={handleEnhanceText}
              isEnhancing={isEnhancing}
            />

            {/* 3. Synthesis Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Таңдалған дауыс:</span>
                <strong className="text-amber-400 font-semibold">{selectedVoice.nativeName} ({selectedVoice.name})</strong>
                <span aria-hidden="true">·</span>
                <span>{selectedVoice.gender === 'female' ? 'Әйел үні' : 'Ер үні'}</span>
              </div>

              <button
                type="button"
                onClick={handleSynthesize}
                disabled={isSynthesizing || !text.trim()}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all active:scale-95"
              >
                {isSynthesizing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Қазақша дыбысталуда...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Дауысты синтездеу (TTS)</span>
                  </>
                )}
              </button>
            </div>

            {/* 4. Active Audio Player with Live Waveform */}
            {activeAudio && (
              <div className="space-y-2 animate-in fade-in">
                <label className="text-sm font-semibold text-slate-200">
                  Аудио ойнатқыш (Generated Audio)
                </label>
                <AudioPlayer
                  audioBase64={activeAudio.base64}
                  voiceName={activeAudio.voiceName}
                  charCount={activeAudio.charCount}
                  wordCount={activeAudio.wordCount}
                  generationTimeMs={activeAudio.generationTimeMs}
                  modelUsed={activeAudio.model}
                />
              </div>
            )}
          </div>
        )}

        {/* Dialogue View */}
        {currentMode === 'dialogue' && (
          <div className="space-y-6">
            <DialogueStudio
              onGenerateDialogue={handleGenerateDialogue}
              isGenerating={isSynthesizing}
            />

            {activeAudio && (
              <div className="space-y-2 animate-in fade-in">
                <label className="text-sm font-semibold text-slate-200">
                  Синтезделген диалог (Synthesized Dialogue)
                </label>
                <AudioPlayer
                  audioBase64={activeAudio.base64}
                  voiceName={activeAudio.voiceName}
                  generationTimeMs={activeAudio.generationTimeMs}
                  modelUsed={activeAudio.model}
                />
              </div>
            )}
          </div>
        )}

        {/* Library Presets View */}
        {currentMode === 'library' && (
          <LibraryPresets onSelectPreset={handleSelectPreset} />
        )}

        {/* History Archive View */}
        {currentMode === 'history' && (
          <div className="space-y-6">
            <HistoryArchive
              history={history}
              onPlayItem={handlePlayHistoryItem}
              onClearHistory={() => setHistory([])}
              onDeleteItem={(id) => setHistory((prev) => prev.filter((i) => i.id !== id))}
              currentlyPlayingId={currentlyPlayingHistoryId}
            />

            {activeAudio && (
              <div className="space-y-2 animate-in fade-in">
                <label className="text-sm font-semibold text-slate-200">
                  Қазір ойналып жатқан аудио
                </label>
                <AudioPlayer
                  audioBase64={activeAudio.base64}
                  voiceName={activeAudio.voiceName}
                  charCount={activeAudio.charCount}
                  wordCount={activeAudio.wordCount}
                  modelUsed={activeAudio.model}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Phonetics and SSML Modal */}
      <PhoneticsGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Үн · Kazakh Speech Synthesis Studio. Барлық құқықтар қорғалған.</p>
          <div className="flex items-center gap-3">
            <span>24kHz Mono WAV</span>
            <span aria-hidden="true">·</span>
            <span>Gemini Neural Speech Engine</span>
            <span aria-hidden="true">·</span>
            <span>Қазақ тілі</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
