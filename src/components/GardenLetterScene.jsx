import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Sparkles, ChevronDown, RotateCcw } from 'lucide-react';
import './GardenLetterScene.css';

/**
 * GardenLetterScene Component
 * Features the cinematic garden walking sequence where a letter is discovered and opened.
 * - Plays /assets/tinu_garden_letter_sequence.mp4 once without controls or looping
 * - Starts when scrolled into view and pauses when leaving the scene
 * - Background birthday-music.mp3 continues uninterrupted
 * - Holds on the final opened-letter frame before automatically and smoothly transitioning
 *   the viewport to the next scene (A Heartfelt Letter for Tinu) without manual scrolling
 * - Prevents multiple triggers during the same playback
 */
export default function GardenLetterScene({ onScrollToStory }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hasTransitionedRef = useRef(false);
  const transitionTimeoutRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const [videoEnded, setVideoEnded] = useState(false);
  const [isAutoTransitioning, setIsAutoTransitioning] = useState(false);
  const [showBookPlaceholder, setShowBookPlaceholder] = useState(false);
  const [isVideoInView, setIsVideoInView] = useState(false);

  // Monitor visibility: only play when in view, pause when leaving view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoInView(true);
            if (videoRef.current && !videoEnded) {
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch((err) => {
                  console.warn('Garden video playback prevented:', err);
                });
              }
            }
          } else {
            setIsVideoInView(false);
            if (videoRef.current && !videoEnded) {
              videoRef.current.pause();
            }
          }
        });
      },
      {
        threshold: 0.35, // Trigger when 35% of the scene is visible
      }
    );

    const target = containerRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
  }, [videoEnded]);

  // Clean up any pending transition timeouts on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Handle video completion: hold last frame briefly, then automatically transition smoothly
  const handleVideoEnded = () => {
    if (hasTransitionedRef.current) return;
    hasTransitionedRef.current = true;

    setVideoEnded(true);
    setIsAutoTransitioning(true);

    // Keep final frame (the opened letter) visible for 2.2s, then automatically scroll to next scene
    transitionTimeoutRef.current = setTimeout(() => {
      const nextTarget = document.getElementById('emotional-story');
      if (nextTarget) {
        nextTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (onScrollToStory) {
        onScrollToStory();
      }
      setIsAutoTransitioning(false);
      setShowBookPlaceholder(true);
    }, 2200);
  };

  // Allow replaying the video
  const handleReplay = () => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    hasTransitionedRef.current = false;
    setIsAutoTransitioning(false);
    setShowBookPlaceholder(false);
    setVideoEnded(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  const handleContinue = () => {
    if (onScrollToStory) {
      onScrollToStory();
    } else {
      const storySection = document.getElementById('emotional-story');
      if (storySection) {
        storySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="garden-letter-container"
      id="garden-letter-scene"
      aria-label="Garden Letter Sequence"
    >
      {/* Ambient watercolor glows */}
      <div className="garden-glow top-glow" aria-hidden="true" />
      <div className="garden-glow bottom-glow" aria-hidden="true" />

      <div className="garden-content-wrapper">
        {/* Header Tag */}
        <motion.div
          className="garden-tag"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <Sparkles size={14} className="tag-sparkle" />
          <span>A Path Through The Garden</span>
          <Sparkles size={14} className="tag-sparkle" />
        </motion.div>

        {/* Narrative Title */}
        <motion.h2
          className="garden-title"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          A Letter Found Along The Way...
        </motion.h2>

        <motion.p
          className="garden-subtext"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          Follow the sunlight into the peaceful garden where words begin to bloom.
        </motion.p>

        {/* Video Cinema Frame */}
        <div className="garden-video-frame">
          <video
            ref={videoRef}
            className={`garden-video-player ${videoEnded ? 'ended-hold' : ''}`}
            src="/assets/tinu_garden_letter_sequence.mp4"
            playsInline
            muted
            controls={false}
            loop={false}
            preload="auto"
            onEnded={handleVideoEnded}
            aria-label="Garden and Letter Sequence Animation"
          />

          {/* Sunlight watercolor overlay on video frame */}
          <div className="video-ambient-overlay" aria-hidden="true" />

          {/* Smooth cinematic auto-transition indicator */}
          {isAutoTransitioning && (
            <motion.div
              className="garden-auto-transition-banner"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Sparkles size={15} className="transition-sparkle" />
              <span>Opening Tinu’s Letter...</span>
              <Sparkles size={15} className="transition-sparkle" />
            </motion.div>
          )}

          {/* Subtle playing hint if paused */}
          {!isVideoInView && !videoEnded && (
            <div className="video-scroll-hint" aria-hidden="true">
              <span>Scroll to watch the letter unfold</span>
            </div>
          )}
        </div>

        {/* Temporary Placeholder for Interactive Birthday Book / Return Navigation */}
        {showBookPlaceholder && (
          <motion.div
            className="book-placeholder-container"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="book-card-ornament top-left" aria-hidden="true">✦</div>
            <div className="book-card-ornament top-right" aria-hidden="true">✦</div>

            <div className="book-icon-badge">
              <BookOpen size={26} className="book-icon" />
            </div>

            <h3 className="book-card-title">Stalina’s Birthday Storybook</h3>
            
            <p className="book-card-description">
              The letter has unfolded its memories into the chapters below.
            </p>

            <div className="book-status-pill">
              <Sparkles size={13} className="pill-sparkle" />
              <span>Interactive Storybook Experience Coming Next</span>
              <Sparkles size={13} className="pill-sparkle" />
            </div>

            {/* Navigation and Replay Controls */}
            <div className="book-placeholder-actions">
              <button
                type="button"
                className="continue-story-button"
                onClick={handleContinue}
              >
                <span>Read Tinu's Story</span>
                <ChevronDown size={18} />
              </button>

              <button
                type="button"
                className="replay-video-button"
                onClick={handleReplay}
                aria-label="Replay garden video sequence"
                title="Watch the garden walk again"
              >
                <RotateCcw size={15} />
                <span>Replay Garden Walk</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
