"use client";

import { useState, useRef } from "react";

interface AudioState {
  ctx: AudioContext | null;
  osc1: OscillatorNode | null;
  osc2: OscillatorNode | null;
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioState = useRef<AudioState>({ ctx: null, osc1: null, osc2: null });

  const togglePlay = () => {
    if (!playing) {
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
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.5);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 698.46, 659.25, 587.33];
        const durations = [0.8, 0.6, 0.8, 0.6, 1.0, 0.6, 0.8, 0.6];

        let time = ctx.currentTime;
        for (let repeat = 0; repeat < 100; repeat++) {
          notes.forEach((freq, i) => {
            osc1.frequency.setValueAtTime(freq, time);
            osc2.frequency.setValueAtTime(freq * 1.25, time);
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
    } else {
      try {
        const { ctx, osc1, osc2 } = audioState.current;
        if (osc1) osc1.stop();
        if (osc2) osc2.stop();
        if (ctx) ctx.close();
      } catch {}
      audioState.current = { ctx: null, osc1: null, osc2: null };
      setPlaying(false);
    }
  };

  return (
    <div
      className="fixed bottom-6 left-6 z-[100]"
      style={{ animation: "fadeIn 1s ease-out" }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes musicPulse {
          0%, 100% { box-shadow: 0 0 15px #FF5CA840, 0 0 30px #00F0FF20; }
          50% { box-shadow: 0 0 25px #FF5CA870, 0 0 50px #00F0FF40; }
        }
        @keyframes musicBars {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>

      <button
        onClick={togglePlay}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: playing
            ? "linear-gradient(135deg, #FF5CA8, #BC6CFF)"
            : "linear-gradient(135deg, #111535, #1a1040)",
          border: playing ? "2px solid #FF5CA860" : "2px solid #BC6CFF40",
          animation: playing ? "musicPulse 2s ease-in-out infinite" : "none",
          cursor: "pointer",
        }}
        title={playing ? "Müziği Durdur" : "Müziği Aç"}
      >
        {playing ? (
          <div className="flex items-end gap-[3px] h-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  background: "#fff",
                  animation: `musicBars 0.${6 + i * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  height: "4px",
                }}
              />
            ))}
          </div>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BC6CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
