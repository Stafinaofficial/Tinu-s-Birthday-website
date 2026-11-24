import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, Heart, Crown, Cake, RotateCcw, Utensils } from 'lucide-react';
import './CakePrank.css';

/**
 * CakePrank Component - The Final Grand Royal Finale
 * 
 * Features:
 * 1. Royal Cake Reveal with the official royal birthday cake image (/assets/royal-cake.png)
 * 2. Playful dodging prank (3 safe, bounded escapes on click / tap / hover)
 * 3. Exact dramatic sister billing punchline:
 *    "WHERE IS YOUR MONEY?! I SPENT 10 HOURS MAKING THIS, YOU STUPID!"
 * 4. Cinematic cake-cutting ceremony with knife slice animation, celebratory confetti, and golden sparkles
 * 5. Official birthday messages:
 *    "HAPPY BIRTHDAY, STALINA!"
 *    "No matter how much you annoy me, you'll always be my little princess."
 * 6. Final sisterly surprise with the authentic sisters photograph (/assets/sisters.jpeg)
 */
export default function CakePrank({ onCelebrate }) {
  const shouldReduceMotion = useReducedMotion();
  const cakeContainerRef = useRef(null);
  const suspenseTimerRef = useRef(null);
  const cuttingTimerRef = useRef(null);

  // Scene Stages: 'reveal' -> 'dodging' -> 'punchline' -> 'cutting' -> 'celebration'
  const [stage, setStage] = useState('reveal'); // 'reveal' | 'punchline' | 'cutting' | 'celebration'
  const [dodgeCount, setDodgeCount] = useState(0);
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0, rotate: 0 });
  const [prankBubble, setPrankBubble] = useState('');
  const [showSisterPhoto, setShowSisterPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  // Dodging trajectories: safe, gentle, contained offsets that never leave the container
  const DODGE_POSITIONS = [
    { x: 75, y: -18, rotate: 7, speech: 'Whoops! Too slow, Princess Tinu! 😜' },
    { x: -80, y: 16, rotate: -7, speech: 'Hehehe! Can’t catch this royal cake! 🏃‍♀️💨' },
    { x: 35, y: -40, rotate: 5, speech: 'Almost had it... but NOPE! 🍰✨' },
  ];

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (suspenseTimerRef.current) clearTimeout(suspenseTimerRef.current);
      if (cuttingTimerRef.current) clearTimeout(cuttingTimerRef.current);
    };
  }, []);

  // Handle attempt to cut or touch the cake
  const handleAttemptCut = () => {
    // Only active during initial reveal / dodging phase
    if (stage !== 'reveal') return;

    const nextCount = dodgeCount + 1;

    if (nextCount <= 3) {
      const dodge = DODGE_POSITIONS[nextCount - 1];
      setDodgeCount(nextCount);
      setDodgeOffset({ x: dodge.x, y: dodge.y, rotate: dodge.rotate });
      setPrankBubble(dodge.speech);

      // If this was the 3rd and final dodge, pause briefly then return to center and reveal punchline
      if (nextCount === 3) {
        suspenseTimerRef.current = setTimeout(() => {
          setDodgeOffset({ x: 0, y: 0, rotate: 0 });
          setPrankBubble('');
          setStage('punchline');
        }, 900);
      }
    }
  };

  // User acknowledges the punchline: "Okay, okay... let's cut it!"
  const handleProceedToCutting = () => {
    setStage('cutting');
    setDodgeOffset({ x: 0, y: 0, rotate: 0 });

    // Smooth cutting ceremony: knife slices through, sparkles radiate, then celebration bursts
    cuttingTimerRef.current = setTimeout(() => {
      setStage('celebration');
      if (onCelebrate) {
        onCelebrate();
      }
    }, 1200);
  };

  // Reset to relive the experience
  const handleReset = () => {
    setStage('reveal');
    setDodgeCount(0);
    setDodgeOffset({ x: 0, y: 0, rotate: 0 });
    setPrankBubble('');
    setShowSisterPhoto(false);
  };

  return (
    <section
      className="royal-cake-scene"
      id="cake-scene"
      ref={cakeContainerRef}
      aria-label="Royal Birthday Cake Celebration"
    >
      {/* Ambient fairytale background glows */}
      <div className="royal-ambient-glow glow-pink" aria-hidden="true" />
      <div className="royal-ambient-glow glow-gold" aria-hidden="true" />
      <div className="royal-ambient-glow glow-lavender" aria-hidden="true" />

      {/* Floating Sparkles & Gentle Petals */}
      <div className="royal-sparkle-layer" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span
            key={`sparkle-${i}`}
            className="floating-sparkle-particle"
            style={{
              left: `${(i * 8.3 + 4) % 96}%`,
              top: `${(i * 13 + 7) % 90}%`,
              animationDelay: `${(i * 0.45).toFixed(2)}s`,
              animationDuration: `${3.5 + (i % 4) * 0.8}s`,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      <div className="royal-stage-content">
        {/* Stage 1 & 2: Main Header */}
        {stage !== 'celebration' && (
          <div className="royal-scene-header">
            <motion.div
              className="royal-tiara-badge"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Crown size={17} className="tiara-icon" />
              <span>The Royal Birthday Moment</span>
              <Sparkles size={16} className="tiara-icon" />
            </motion.div>

            <h2 className="royal-main-heading">
              And now, Princess Stalina... it's time for your cake!
            </h2>

            <p className="royal-sub-instruction">
              {stage === 'reveal' && dodgeCount === 0 && 'A masterwork fit for royalty... go ahead, make a wish!'}
              {stage === 'reveal' && dodgeCount > 0 && dodgeCount < 3 && 'Wait, did the cake just move?! Try to catch it!'}
              {stage === 'reveal' && dodgeCount === 3 && 'Wait a second... it stopped!'}
              {stage === 'punchline' && 'A special personal invoice from your loving older sister:'}
              {stage === 'cutting' && 'Cutting the royal cake... make a wish! ✨'}
            </p>
          </div>
        )}

        {/* STAGE 2: THE UNEXPECTED MESSAGE (Sister billing alert) */}
        <AnimatePresence>
          {stage === 'punchline' && (
            <motion.div
              className="punchline-card"
              role="alert"
              aria-live="assertive"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.86, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <div className="punchline-header-badge">
                <span className="punchline-badge-emoji">💸</span>
                <span>OFFICIAL SISTER INVOICE</span>
                <span className="punchline-badge-emoji">😤</span>
              </div>

              {/* EXACT REQUIRED MESSAGE */}
              <h3 className="punchline-exact-text">
                “WHERE IS YOUR MONEY?! I SPENT 10 HOURS MAKING THIS, YOU STUPID!”
              </h3>

              <p className="punchline-subnote">
                (Hand-coded with premium love, sleepless nights, and unpaid sister labor! 🎀💅)
              </p>

              {/* EXACT REQUIRED BUTTON */}
              <motion.button
                type="button"
                className="punchline-action-button"
                onClick={handleProceedToCutting}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                autoFocus
              >
                <span>Okay, okay... let's cut it!</span>
                <Sparkles size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CAKE ARENA: The Royal Cake Visual & Playful Dodge */}
        <div className="royal-cake-arena">
          {/* Prank Bubble above cake */}
          <AnimatePresence>
            {prankBubble && stage === 'reveal' && (
              <motion.div
                className="cake-playful-bubble"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
              >
                <span>{prankBubble}</span>
                <div className="bubble-pointer-tail" aria-hidden="true" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Dodging Cake Container */}
          <motion.div
            className={`royal-cake-frame ${stage === 'celebration' ? 'is-celebrating' : ''} ${
              stage === 'cutting' ? 'is-slicing' : ''
            }`}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: dodgeOffset.x,
                    y: dodgeOffset.y,
                    rotate: dodgeOffset.rotate,
                  }
            }
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 17,
              mass: 0.8,
            }}
            onClick={stage === 'reveal' ? handleAttemptCut : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (stage === 'reveal') handleAttemptCut();
              }
            }}
            tabIndex={stage === 'reveal' ? 0 : -1}
            role={stage === 'reveal' ? 'button' : 'img'}
            aria-label="Royal Birthday Cake"
          >
            {/* The Royal Birthday Cake Image */}
            <div className="royal-cake-image-wrapper">
              <img
                src="/assets/royal-cake.png"
                alt="Royal Birthday Cake for Princess Stalina"
                className="royal-cake-img"
                loading="eager"
              />

              {/* Ceremonial Knife Cut Effect */}
              {stage === 'cutting' && (
                <motion.div
                  className="ceremonial-knife-overlay"
                  initial={{ y: -120, opacity: 0 }}
                  animate={{ y: 130, opacity: 1 }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                >
                  <div className="golden-knife-blade">
                    <span className="blade-golden-gleam" />
                  </div>
                  <div className="knife-cut-sparkle-beam" />
                </motion.div>
              )}

              {/* Glowing Cut Seam during Celebration */}
              {stage === 'celebration' && (
                <motion.div
                  className="cake-celebration-slice-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Tap hint for mobile in reveal phase */}
            {stage === 'reveal' && (
              <div className="cake-tap-indicator" aria-hidden="true">
                <Utensils size={14} />
                <span>{dodgeCount === 0 ? 'Tap to cut 🎂' : `Dodged! (${dodgeCount}/3)`}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* REVEAL BUTTON: "Cut the Cake 🎂" */}
        {stage === 'reveal' && (
          <div className="royal-action-zone">
            <motion.button
              type="button"
              className="royal-cut-button"
              onClick={handleAttemptCut}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            >
              <Cake size={20} className="btn-cake-icon" />
              <span>Cut the Cake 🎂</span>
            </motion.button>
          </div>
        )}

        {/* STAGE 3: THE CAKE-CUTTING CELEBRATION */}
        {stage === 'celebration' && (
          <motion.div
            className="celebration-hero-card"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Celebratory Confetti & Petals Burst */}
            <div className="celebration-confetti-rain" aria-hidden="true">
              {['🌸', '✨', '💖', '🎉', '🌟', '🎀', '🎂', '🌸', '✨', '👑', '🎉', '💖'].map(
                (item, idx) => (
                  <span
                    key={`confetti-${idx}`}
                    className="confetti-falling-piece"
                    style={{
                      left: `${(idx * 8.3 + 3) % 96}%`,
                      animationDelay: `${(idx * 0.28).toFixed(2)}s`,
                      animationDuration: `${3.8 + (idx % 3) * 0.6}s`,
                    }}
                  >
                    {item}
                  </span>
                )
              )}
            </div>

            <div className="celebration-crown-header">
              <span className="celebration-sparkle">✨</span>
              <Crown size={28} className="celebration-crown-icon" />
              <span className="celebration-sparkle">✨</span>
            </div>

            {/* EXACT REQUIRED HEADING */}
            <h2 className="celebration-main-title">HAPPY BIRTHDAY, STALINA!</h2>

            {/* EXACT REQUIRED MESSAGE */}
            <p className="celebration-heart-message">
              “No matter how much you annoy me, you'll always be my little princess.”
            </p>

            {/* STAGE 4: THE FINAL SISTERLY SURPRISE BUTTON */}
            {!showSisterPhoto ? (
              <motion.button
                type="button"
                className="final-hug-button"
                onClick={() => setShowSisterPhoto(true)}
                whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                <Heart size={18} className="hug-heart-icon" />
                <span>One Last Hug</span>
                <Heart size={18} className="hug-heart-icon" />
              </motion.button>
            ) : (
              /* THE SISTERS' PHOTOGRAPH REVEAL */
              <motion.div
                className="sisters-keepsake-frame"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                {!photoError ? (
                  <div className="polaroid-photo-inner">
                    <div className="polaroid-image-container">
                      <img
                        src="/assets/sisters.jpeg"
                        alt="Sisters Together - Unbreakable Bond"
                        className="sisters-actual-photo"
                        onError={() => setPhotoError(true)}
                      />
                      <div className="photo-sunlight-sheen" aria-hidden="true" />
                    </div>
                    <div className="polaroid-caption">
                      <Heart size={16} className="caption-heart" />
                      <span>Forever & Always, Your Akka</span>
                      <Heart size={16} className="caption-heart" />
                    </div>
                  </div>
                ) : (
                  <div className="polaroid-fallback-card">
                    <Heart size={32} className="fallback-heart" />
                    <p className="fallback-text">
                      To my forever sister — every memory with you is treasured. 💖
                    </p>
                  </div>
                )}

                <div className="celebration-footer-actions">
                  <button
                    type="button"
                    className="replay-prank-btn"
                    onClick={handleReset}
                    title="Relive the prank & celebration"
                  >
                    <RotateCcw size={15} />
                    <span>Relive The Magic</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
