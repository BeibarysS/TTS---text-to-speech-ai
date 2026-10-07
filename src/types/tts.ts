export type VoiceGender = 'female' | 'male';

export interface KazakhVoice {
  id: string;
  name: string;
  nativeName: string;
  gender: VoiceGender;
  geminiVoice: 'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Aoede' | 'Charon';
  tagline: string;
  description: string;
  recommendedFor: string[];
  sampleText: string;
  defaultStyle: string;
  avatarSeed: string;
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: number;
  text: string;
  voiceId: string;
  voiceName: string;
  audioBase64: string;
  durationFormatted: string;
  model: string;
  charCount: number;
  wordCount: number;
  isDialogue?: boolean;
}

export interface DialogueTurn {
  id: string;
  speaker: string;
  voiceName: 'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Aoede' | 'Charon';
  text: string;
  style?: string;
}

export type TtsMode = 'studio' | 'dialogue' | 'library' | 'history';
