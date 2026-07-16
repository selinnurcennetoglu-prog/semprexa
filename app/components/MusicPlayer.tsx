"use client";

import { useState, useRef, useEffect } from "react";

interface AudioState {
  ctx: AudioContext | null;
  osc1: OscillatorNode | null;
  osc2: OscillatorNode | null;
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioState = useRef<AudioState>({ ctx: null, osc1: null, osc2: null });
  const hasAutoPlayed = useRef(false);

  const startMusic = () => {
    if (audioState.current.ctx) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      const notes = [
        392.00, 440.00, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00,
        523.25, 659.25, 783.99, 659.25, 523.25, 440.00, 392.00, 440.00,
      ];
      const durations = [
        0.6, 0.4, 0.6, 0.4, 0.8, 0.4, 0.6, 0.4,
        0.6, 0.4, 0.8, 0.4, 0.6, 0.4, 0.8, 0.4,
      ];

      let time = ctx.currentTime;
      for (let repeat = 0; repeat < 50; repeat++) {
        notes.forEach((freq, i) => {
          osc1.frequency.setValueAtTime(freq, time);
          osc2.frequency.setValueAtTime(freq * 1.5, time);
          time += durations[i];
        });
      }

      osc1.start();
      osc2.start();

      audioState.current = { ctx, osc1, osc2 };
      setPlaying(true);
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  const stopMusic = () => {
    try {
      const { ctx, osc1, osc2 } = audioState.current;
      if (osc1) osc1.stop();
      if (osc2) osc2.stop();
      if (ctx) ctx.close();
    } catch {}
    audioState.current = { ctx: null, osc1: null, osc2: null };
    setPlaying(false);
  };

  const togglePlay = () => {
    if (playing) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  // Auto-play on first load, stop after 5 seconds
  useEffect(() => {
    if (hasAutoPlayed.current) return;
    hasAutoPlayed.current = true;

    const timer = setTimeout(() => {
      startMusic();
      // Stop after 5 seconds
      setTimeout(() => {
        stopMusic();
      }, 5000);
    }, 1000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed bottom-6 left-6 z-[100]"
      style={{ animation: "fadeIn 1s ease-out" }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes royalMusicPulse {
          0%, 100% { box-shadow: 0 0 15px #c0392b40, 0 0 30px #d4af3720; }
          50% { box-shadow: 0 0 25px #c0392b70, 0 0 50px #d4af3740; }
        }
        @keyframes musicBars {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>

      <button
        onClick={togglePlay}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 relative overflow-hidden"
        style={{
          background: playing
            ? "linear-gradient(135deg, #8b0000, #c0392b)"
            : "linear-gradient(135deg, #12103a, #1a1040)",
          border: playing ? "2px solid #d4af3760" : "2px solid #d4af3740",
          animation: playing ? "royalMusicPulse 2s ease-in-out infinite" : "none",
          cursor: "pointer",
        }}
        title={playing ? "Muzigi Durdur" : "Muzigi Ac"}
      >
        <div className="absolute inset-[-2px] rounded-full" style={{ border: "1px dashed #d4af3730" }} />

        {playing ? (
          <div className="flex items-end gap-[3px] h-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  background: "#d4af37",
                  animation: `musicBars 0.${6 + i * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  height: "4px",
                }}
              />
            ))}
          </div>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
