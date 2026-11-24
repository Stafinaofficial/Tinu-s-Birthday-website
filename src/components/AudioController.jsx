import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import './AudioController.css';

/**
 * Persistent AudioController Component
 * Continuously plays the single birthday music track (/assets/birthday-music.mp3)
 * across the entire website without restarting on scene transitions.
 * Features:
 * - Comfortable default volume (0.55)
 * - Elegant pause/resume toggle with subtle animated sound-wave indicator
 * - Imperative ref methods (startAudio, pauseAudio, toggleAudio) for seamless triggers
 * - Graceful failure handling if file is missing or browser restricts autoplay
 */
const AudioController = forwardRef(function AudioController({ startTrigger }, ref) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef(null);

  // Set comfortable default volume on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.55;
    }
  }, []);

  // Safe play function with browser permission handling
  const startAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.55;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch((err) => {
          console.warn('Audio playback was prevented by browser policy or missing asset:', err);
          setIsPlaying(false);
        });
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      pauseAudio();
    } else {
      startAudio();
    }
  };

  // Expose methods via ref for parent triggers (e.g., "Open Your Surprise" button)
  useImperativeHandle(ref, () => ({
    startAudio,
    pauseAudio,
    toggleAudio,
    isPlaying,
  }));

  // Watch startTrigger prop if parent toggles it
  useEffect(() => {
    if (startTrigger) {
      startAudio();
    }
  }, [startTrigger]);

  return (
    <div className="persistent-audio-wrapper" aria-label="Birthday Music Controller">
      {/* Persistent Single Audio Element */}
      <audio
        ref={audioRef}
        src="/assets/birthday-music.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.warn('Audio asset could not be loaded (/assets/birthday-music.mp3):', e);
          setIsPlaying(false);
        }}
      />

      {/* Small, Elegant Floating Music Toggle Button */}
      <button
        type="button"
        className={`audio-toggle-button ${isPlaying ? 'playing' : 'paused'}`}
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Pause birthday music' : 'Play birthday music'}
        title={isPlaying ? 'Pause Music' : 'Play Birthday Music'}
      >
        <div className="audio-icon-container">
          {isPlaying ? (
            <Volume2 size={16} className="audio-icon active-icon" />
          ) : (
            <VolumeX size={16} className="audio-icon paused-icon" />
          )}

          {/* Subtle Animated Music Wave Indicator */}
          {isPlaying ? (
            <div className="audio-sound-waves" aria-hidden="true">
              <span className="wave-bar bar-1" />
              <span className="wave-bar bar-2" />
              <span className="wave-bar bar-3" />
            </div>
          ) : (
            <span className="music-off-dot" aria-hidden="true" />
          )}
        </div>

        <span className="audio-btn-label">
          {isPlaying ? 'Music' : 'Muted'}
        </span>
      </button>

      {/* Gentle Floating Cue before user has started the music */}
      {!hasStarted && !isPlaying && (
        <button
          type="button"
          className="audio-start-hint"
          onClick={startAudio}
          aria-label="Click to start birthday music"
        >
          <Music size={12} className="hint-note-icon" />
          <span>Click to hear Tinu's song ✦</span>
        </button>
      )}
    </div>
  );
});

export default AudioController;
