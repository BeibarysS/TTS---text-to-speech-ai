import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

// Server-side Gemini client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Single-speaker Kazakh speech synthesis endpoint
app.post('/api/tts/synthesize', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      text,
      voiceName = 'Kore',
      style = 'Warm, natural, melodious Kazakh native speaker with authentic prosody and vowel harmony',
      modelType = 'gemini-3.8-flash-lite-tts',
    } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Мәтін бос болмауы керек (Text is required).' });
    }

    const selectedModel = modelType === 'gemini-3.8-flash-tts'
      ? 'gemini-3.8-flash-tts'
      : 'gemini-3.8-flash-lite-tts';

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: style || 'Clear, natural, fluent Kazakh native speaker',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(502).json({ error: 'Дауыс синтезінен аудио деректері алынбады.' });
    }

    const generationTimeMs = Date.now() - startTime;
    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      metrics: {
        charCount: text.length,
        wordCount: text.trim().split(/\s+/).length,
        generationTimeMs,
        voiceName,
        model: selectedModel,
      },
    });
  } catch (error: any) {
    console.error('Error synthesizing Kazakh speech:', error);
    return res.status(500).json({
      error: error?.message || 'Дыбыстау кезінде қате орын алды (Failed to synthesize speech)',
    });
  }
});

// Dual-speaker Kazakh dialogue synthesis endpoint
app.post('/api/tts/dialogue', async (req, res) => {
  const startTime = Date.now();
  try {
    const { turns, speakerConfigs } = req.body;

    if (!Array.isArray(turns) || turns.length === 0) {
      return res.status(400).json({ error: 'Диалог кезеңдері бос болмауы керек (Turns are required).' });
    }

    // Default 2 speakers: Speaker A & Speaker B
    const spk1 = speakerConfigs?.[0]?.name || turns[0]?.speaker || '1-спикер';
    const spk2 = speakerConfigs?.[1]?.name || turns.find((t: any) => t.speaker !== spk1)?.speaker || '2-спикер';

    const spk1Voice = speakerConfigs?.[0]?.voiceName || 'Kore';
    const spk2Voice = speakerConfigs?.[1]?.voiceName || 'Puck';

    const dialogueParts = turns.map((turn: any) => {
      const speakerName = turn.speaker === spk2 ? spk2 : spk1;
      return {
        text: `${speakerName}: ${turn.text}`,
        speechMetadata: {
          speaker: speakerName,
          style: turn.style || (speakerName === spk1 ? 'Natural conversational Kazakh' : 'Friendly engaging Kazakh responder'),
        },
      };
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: dialogueParts,
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: spk1,
                voiceConfig: { prebuiltVoiceConfig: { voiceName: spk1Voice } },
              },
              {
                speaker: spk2,
                voiceConfig: { prebuiltVoiceConfig: { voiceName: spk2Voice } },
              },
            ],
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(502).json({ error: 'Диалог дыбысын синтездеу мүмкін болмады.' });
    }

    const generationTimeMs = Date.now() - startTime;
    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      metrics: {
        turnCount: turns.length,
        speakers: [spk1, spk2],
        generationTimeMs,
      },
    });
  } catch (error: any) {
    console.error('Error generating dialogue:', error);
    return res.status(500).json({
      error: error?.message || 'Диалогты синтездеуде қате орын алды (Failed to generate dialogue)',
    });
  }
});

// Kazakh text normalization & prosody assistant
app.post('/api/tts/enhance-text', async (req, res) => {
  try {
    const { text, mode } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Мәтін қажет.' });
    }

    let instruction = '';
    if (mode === 'normalize_numbers') {
      instruction = `Сіз қазақ тілінің орфоэпия және фонетика маманысыз. Берілген мәтіндегі барлық сандарды, жылдарды, пайыздарды, валюталарды және өлшем бірліктерін дыбыстауға (TTS) арналған толық қазақ сөздеріне айналдырыңыз. Мәтін мағынасын сақтаңыз. Тек қана дайын өңделген қазақша мәтінді қайтарыңыз, ешқандай түсініктемесіз немесе тырнақшасыз.`;
    } else if (mode === 'add_prosody') {
      instruction = `Сіз қазақ тіліндегі көркем сөз оқу және дикторлық шеберлік маманысыз. Берілген қазақша мәтінді дауыс синтезіне (TTS) барынша табиғи, ырғақты, интонациясы дұрыс естілетіндей етіп тыныс белгілерімен (үтірлер, сұрақ, леп белгілері, қысқа кідірістер үшін көпнүкте '...') реттеп беріңіз. Тек өңделген мәтінді қайтарыңыз.`;
    } else if (mode === 'to_latin') {
      instruction = `Берілген қазақша кирилл мәтінін Қазақстанның жаңа мемлекеттік латын әліпбиі стандартына (Jańa qazaq latyn álipbıi: á, ǵ, q, ń, ó, s h, ch, ú, ý, ı) аударыңыз. Тек аударылған мәтінді қайтарыңыз.`;
    } else if (mode === 'to_cyrillic') {
      instruction = `Берілген латын қаріпті қазақша мәтінді стандартты қазақ кириллицасына (ә, і, ң, ғ, ү, ұ, қ, ө, һ әріптерімен) дәл аударыңыз. Тек өңделген кирилл мәтінді қайтарыңыз.`;
    } else {
      instruction = `Берілген қазақша мәтінді дауыстап оқуға (TTS) ыңғайлы, табиғи қазақ тілі нормаларына сай тексеріп, грамматикалық және орфографиялық жағынан мүлтіксіз етіп жетілдіріңіз. Тек өңделген мәтінді қайтарыңыз.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${instruction}\n\nМәтін:\n${text}` }],
        },
      ],
    });

    const enhanced = response.text?.trim() || text;
    return res.json({ enhancedText: enhanced });
  } catch (error: any) {
    console.error('Enhance text error:', error);
    return res.status(500).json({ error: error?.message || 'Мәтінді өңдеуде қате болды' });
  }
});

// Serve frontend with Vite in dev, static in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Ün Kazakh TTS Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
