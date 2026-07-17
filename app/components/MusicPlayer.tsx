"use client";

import { useState, useRef, useEffect } from "react";

interface AudioState {
  ctx: AudioContext | null;
  nodes: AudioNode[];
}

interface MusicPlayerProps {
  triggerPlay?: boolean;
}

export default function MusicPlayer({ triggerPlay: _triggerPlay }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const audioState = useRef<AudioState>({ ctx: null, nodes: [] });
  const hasAutoPlayed = useRef(false);

  const startMusic = () => {
    if (audioState.current.ctx) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const allNodes: AudioNode[] = [];

      // Reverb-like effect with multiple oscillators
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.5);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 4.8);
      masterGain.connect(ctx.destination);
      allNodes.push(masterGain);

      // Soft pad sound - dreamy ambient
      const padNotes = [
        // Phrase 1 - gentle rise
        { freq: 261.63, time: 0, dur: 0.8 },    // C4
        { freq: 329.63, time: 0.4, dur: 0.8 },   // E4
        { freq: 392.00, time: 0.8, dur: 1.0 },   // G4
        { freq: 440.00, time: 1.2, dur: 0.6 },   // A4
        { freq: 392.00, time: 1.6, dur: 0.8 },   // G4
        // Phrase 2 - gentle fall
        { freq: 349.23, time: 2.2, dur: 0.8 },   // F4
        { freq: 329.63, time: 2.6, dur: 0.6 },   // E4
        { freq: 293.66, time: 3.0, dur: 0.8 },   // D4
        { freq: 261.63, time: 3.4, dur: 1.2 },   // C4
      ];

      padNotes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        gain.gain.setValueAtTime(0, ctx.currentTime + time);
        gain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + time + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + dur);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + dur + 0.1);
        allNodes.push(osc, gain);
      });

      // Harmony layer - perfect fifths
      const harmonyNotes = [
        { freq: 196.00, time: 0, dur: 1.2 },     // G3
        { freq: 220.00, time: 0.8, dur: 1.0 },    // A3
        { freq: 261.63, time: 1.6, dur: 1.2 },    // C4
        { freq: 220.00, time: 2.4, dur: 1.0 },    // A3
        { freq: 196.00, time: 3.2, dur: 1.4 },    // G3
      ];

      harmonyNotes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        gain.gain.setValueAtTime(0, ctx.currentTime + time);
        gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + time + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + dur);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + dur + 0.1);
        allNodes.push(osc, gain);
      });

      // High sparkle notes
      const sparkleNotes = [
        { freq: 1046.50, time: 0.3, dur: 0.3 },   // C6
        { freq: 1174.66, time: 1.0, dur: 0.25 },   // D6
        { freq: 1318.51, time: 1.8, dur: 0.3 },    // E6
        { freq: 1174.66, time: 2.8, dur: 0.25 },   // D6
        { freq: 1046.50, time: 3.6, dur: 0.4 },    // C6
      ];

      sparkleNotes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        gain.gain.setValueAtTime(0, ctx.currentTime + time);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + dur + 0.05);
        allNodes.push(osc, gain);
      });

      audioState.current = { ctx, nodes: allNodes };
      setPlaying(true);

      // Auto-stop after 5 seconds
      setTimeout(() => {
        stopMusic();
      }, 5000);
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  const stopMusic = () => {
    try {
      const { ctx } = audioState.current;
      if (ctx) ctx.close();
    } catch {}
    audioState.current = { ctx: null, nodes: [] };
    setPlaying(false);
  };

  const togglePlay = () => {
    if (playing) {
      stopMusic();
    } else {
      startMusic();
    }
  };

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
