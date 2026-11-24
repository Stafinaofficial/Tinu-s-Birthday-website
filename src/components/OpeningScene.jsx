import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import './OpeningScene.css';

/**
 * Opening Scene:
 * Full-screen immersive cinematic Ghibli-inspired entrance with
 * video background, graceful image fallback, watercolor gradient overlay,
 * personalized quote, and delicate scroll indicator.
 */
export default function OpeningScene({ onScrollToNext, onOpenSurprise }) {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleOpenSurpriseClick = () => {
    if (onOpenSurprise) {
      onOpenSurprise();
    } else if (onScrollToNext) {
      onScrollToNext();
    } else {
      const nextSection = document.getElementById('birthday-scene');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="opening-scene-container" id="opening-scene" aria-label="Opening Scene">
      {/* Background Media: Video with Fallback */}
      <div className="scene-media-wrapper">
        {!videoError ? (
          <video
            className={`scene-video ${videoLoaded ? 'loaded' : ''}`}
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/sisters.png"
            onCanPlay={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            aria-label="Cinematic opening animation"
          >
            <source src="/assets/opening-scene.mp4" type="video/mp4" />
            <source src="/assets/opening_scene.mp4" type="video/mp4" />
            {/* Graceful fallback if video tag isn't supported */}
            <img
              src="/assets/sisters.png"
              alt="Stalina and family memory"
              className="scene-fallback-img"
              onError={(e) => {
                e.currentTarget.src = '/assets/sisters.jpeg';
              }}
            />
          </video>
        ) : (
          <img
            src="/assets/sisters.png"
            alt="Stalina and sisters nostalgic memory"
            className="scene-fallback-img loaded"
            onError={(e) => {
              e.currentTarget.src = '/assets/sisters.jpeg';
            }}
          />
        )}

        {/* Ambient Watercolor & Sunlight Gradient Overlays */}
        <div className="scene-overlay-sunlight" aria-hidden="true" />
        <div className="scene-overlay-watercolor" aria-hidden="true" />
        <div className="scene-overlay-vignette" aria-hidden="true" />
      </div>

      {/* Hero Content */}
      <div className="scene-content">
        <motion.div
          className="scene-badge"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: 'easeOut' }}
        >
          <Sparkles className="badge-icon" size={15} />
          <span>A Story For Our Tinu</span>
          <Sparkles className="badge-icon" size={15} />
        </motion.div>

        <motion.h1
          className="scene-quote"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          “A little world made just for you...”
        </motion.h1>

        <motion.p
          className="scene-subtext"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9, ease: 'easeOut' }}
        >
          Where every memory blooms in sunlight and gentle warmth
        </motion.p>

        {/* Primary Call to Action: Open Your Surprise */}
        <motion.button
          type="button"
          className="open-surprise-button"
          onClick={handleOpenSurpriseClick}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
          aria-label="Open Your Surprise"
        >
          <Sparkles className="surprise-sparkle-icon" size={17} />
          <span>Open Your Surprise</span>
          <Sparkles className="surprise-sparkle-icon" size={17} />
        </motion.button>
      </div>

      {/* Delicate Animated Scroll Indicator */}
      <motion.button
        type="button"
        className="scene-scroll-indicator"
        onClick={handleOpenSurpriseClick}
        aria-label="Scroll to birthday celebration"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.3 }}
      >
        <span className="scroll-caption">Scroll to enter</span>
        <div className="scroll-mouse-pill">
          <motion.div
            className="scroll-wheel-dot"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, 9, 0],
                    opacity: [1, 0.4, 1],
                  }
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        <motion.div
          className="scroll-chevron-wrap"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, 4, 0],
                }
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
        >
          <ChevronDown size={18} className="scroll-chevron" />
        </motion.div>
      </motion.button>
    </section>
  );
}
