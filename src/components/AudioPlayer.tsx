import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  Check,
  Share2
} from 'lucide-react';

interface AudioPlayerProps {
  audioBase64: string;
  voiceName: string;
  charCount?: number;
  wordCount?: number;
  generationTimeMs?: number;
  modelUsed?: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  voiceName,
  charCount,
  wordCount,
  generationTimeMs,
  modelUsed,
  autoPlay = true,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const audioSrc = `data:audio/wav;base64,${audioBase64}`;

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    audio.playbackRate = playbackRate;
    audio.volume = isMuted ? 0 : volume;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      if (autoPlay) {
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioBase64]);

  // Handle Play/Pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = parseFloat(e.target.value);
    setCurrentTime(nextTime);
    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.8, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleVolumeToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioSrc;
    link.download = `un_kazakh_tts_${voiceName.toLowerCase()}_${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  // Render Canvas Waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numBars = 54;
      const barWidth = width / numBars - 2;
      const progressRatio = duration > 0 ? currentTime / duration : 0;
      const activeBarIndex = Math.floor(progressRatio * numBars);

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2);

        // Calculate stylized waveform height with movement when playing
        let barHeight: number;
        if (isPlaying) {
          phase += 0.002;
          const wave1 = Math.sin(i * 0.25 + phase * 3);
          const wave2 = Math.cos(i * 0.15 - phase * 2);
          const dynamicAmp = 0.3 + 0.7 * Math.abs(wave1 * wave2);
          barHeight = Math.max(6, (height * 0.8) * dynamicAmp);
        } else {
          // Static visual pattern based on index
          const base = Math.sin(i * 0.2) * 0.4 + 0.5;
          barHeight = Math.max(4, height * 0.7 * Math.abs(base));
        }

        const y = (height - barHeight) / 2;

        if (i <= activeBarIndex) {
          ctx.fillStyle = '#F59E0B'; // Amber accent for played portion
        } else {
          ctx.fillStyle = '#334155'; // Slate-700 for upcoming portion
        }

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime, duration]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-4 sm:p-5 shadow-lg shadow-black/40 space-y-4">
      {/* Top status bar: Clean zero-pill metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">
            {voiceName} дауысымен синтезделген аудио
          </span>
          <span aria-hidden="true">·</span>
          <span>24kHz WAV</span>
        </div>

        <div className="flex items-center gap-3 font-mono tabular-nums text-slate-400">
          {generationTimeMs && (
            <span>Синтез: {generationTimeMs}ms</span>
          )}
          {modelUsed && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400/90">{modelUsed}</span>
            </>
          )}
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative h-20 w-full overflow-hidden rounded-xl bg-slate-950/90 px-3 py-2 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={80}
          className="h-full w-full"
        />
      </div>

      {/* Scrubbing timeline slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.01}
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-xs font-mono tabular-nums text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Player controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback action controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-transform active:scale-95"
            title={isPlaying ? 'Тоқтату (Pause)' : 'Ойнату (Play)'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            title="Басынан қайта қосу"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Speed selector */}
          <button
            type="button"
            onClick={handleSpeedChange}
            className="cursor-pointer flex h-9 items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 text-xs font-mono font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            title="Ойнату жылдамдығы"
          >
            <Gauge className="h-3.5 w-3.5 text-amber-400" />
            <span>{playbackRate}x</span>
          </button>
        </div>

        {/* Volume & Download actions */}
        <div className="flex items-center gap-3">
          {/* Volume slider */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handleVolumeToggle}
              className="text-slate-400 hover:text-slate-200"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Download button */}
          <button
            type="button"
            onClick={handleDownload}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 hover:border-amber-500 transition-all shadow-xs"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Жүктелді (.wav)</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Аудионы жүктеу (.wav)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
