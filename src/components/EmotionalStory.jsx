import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Mail,
  Flower2,
  Swords,
  Moon,
  Sun,
  Smile,
  Crown,
  Cake,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import './EmotionalStory.css';

/**
 * EmotionalStory Component
 * Presents the complete original birthday narrative progressively on screen,
 * one exact original section at a time, using elegant fade-in and fade-out animations.
 *
 * Every single original word, sentence, paragraph, punctuation mark, and order
 * is preserved with 100% fidelity.
 *
 * Automatically advances based on reading length and smoothly transitions to CakePrank
 * when the story finishes.
 */
// Reading time allocation for each exact section based on word count & emotional pacing
const SECTION_DURATIONS = [
  4500, // 0: "Hey, Tinu..."
  6200, // 1: "I know I never called you akka, but you've always had such a special place in my heart."
  6200, // 2: "Those little annoying moments, those cute laughs with you, and of course... our legendary sister fights!"
  5200, // 3: "And your delightfully lazy behaviour... hehehehe."
  5800, // 4: "I loved everything. I loved every little part of our journey together."
  8200, // 5: "Sometimes, with that annoying ego of yours... Look at those balloon cheeks! 🎈😳"
  5800, // 6: "But when I think about it now, those are the very things I know we'll cherish forever together."
  5800, // 7: "I thank God for giving me such a beautiful, Barbie-girl sister. 💖"
  5000, // 8: "And Tinu, I know reaching 21 isn't easy..."
  5200, // 9: "Because soon you'll become old and die! Hehehehe! 💀🌸"
  4800, // 10: "Meanwhile, I'll still be young. 😎💅"
  5200, // 11: "You're already getting old, oldy Barbie! 🎀👵"
  5500, // 12: "Anyway... shall we cut your cake? 🎂✨" -> then automatically transitions to CakePrank
];

export default function EmotionalStory({ onScrollToCake }) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const transitionToCakeTriggeredRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const totalSections = SECTION_DURATIONS.length;

  // Observe when this story section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSectionInView(true);
          } else {
            setIsSectionInView(false);
          }
        });
      },
      { threshold: 0.3 }
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
  }, []);

  // Automatic progression through the exact sections
  useEffect(() => {
    if (!isSectionInView || isPaused) return;

    // If on the final section (Section 13 / index 12), transition to CakePrank after duration
    if (currentIndex >= totalSections - 1) {
      const cakeTimer = setTimeout(() => {
        if (!transitionToCakeTriggeredRef.current) {
          transitionToCakeTriggeredRef.current = true;
          const cakeTarget = document.getElementById('cake-scene');
          if (cakeTarget) {
            cakeTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          if (onScrollToCake) {
            onScrollToCake();
          }
        }
      }, SECTION_DURATIONS[currentIndex]);

      return () => clearTimeout(cakeTimer);
    }

    // Otherwise, advance to next section after current section's reading duration
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, totalSections - 1));
    }, SECTION_DURATIONS[currentIndex]);

    return () => clearTimeout(timer);
  }, [currentIndex, isSectionInView, isPaused, totalSections, onScrollToCake]);

  // Manual navigation helpers
  const handleNext = () => {
    if (currentIndex < totalSections - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (onScrollToCake) {
        onScrollToCake();
      } else {
        const cakeTarget = document.getElementById('cake-scene');
        if (cakeTarget) {
          cakeTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Render the exact, original content for the current logical section
  const renderCurrentSection = (index) => {
    switch (index) {
      case 0:
        return (
          <article className="story-beat beat-letter" key="section-0">
            <div className="beat-visual-wrapper">
              <motion.div
                className="floating-letter-card"
                animate={shouldReduceMotion ? {} : { y: [0, -8, 0], rotate: [0, 1, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="letter-wax-seal">
                  <Mail size={22} className="seal-icon" />
                </div>
                <span className="letter-hint">A heartfelt letter for Tinu</span>
              </motion.div>
            </div>

            <h3 className="beat-text-primary beat-greeting">
              <span className="story-word">Hey, </span>
              <span className="story-word">Tinu...</span>
            </h3>
          </article>
        );

      case 1:
        return (
          <article className="story-beat beat-emotional" key="section-1">
            <div className="beat-visual-wrapper">
              <motion.div
                className="flower-halo"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Flower2 size={28} className="flower-icon" />
              </motion.div>
            </div>

            <p className="beat-text-medium">
              “I know I never called you <span className="highlight-keyword">akka</span>, but you've always had such a{' '}
              <span className="highlight-heart">special place in my heart</span>.”
            </p>
          </article>
        );

      case 2:
        return (
          <article className="story-beat beat-fights" key="section-2">
            <div className="beat-visual-wrapper">
              <div className="fights-icon-badge">
                <Swords size={26} className="fights-icon" />
                <span className="clash-sparkle">💥</span>
              </div>
            </div>

            <p className="beat-text-medium">
              Those little annoying moments, those cute laughs with you, and of course...{' '}
              <span className="highlight-shake">our legendary sister fights!</span>
            </p>
          </article>
        );

      case 3:
        return (
          <article className="story-beat beat-lazy" key="section-3">
            <div className="beat-visual-wrapper">
              <motion.div
                className="sleepy-cloud"
                animate={shouldReduceMotion ? {} : { y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Moon size={24} className="moon-icon" />
                <span className="zzz-text">z Z Z</span>
              </motion.div>
            </div>

            <p className="beat-text-medium">
              And your delightfully lazy behaviour...{' '}
              <span className="giggle-text">hehehehe.</span>
            </p>
          </article>
        );

      case 4:
        return (
          <article className="story-beat beat-warm-glow" key="section-4">
            <div className="beat-visual-wrapper">
              <div className="sunlight-heart-glow">
                <Sun size={28} className="sun-icon" />
                <Heart size={20} className="glow-heart" />
              </div>
            </div>

            <p className="beat-text-large beat-sentiment">
              “I loved everything. I loved every little part of our journey together.”
            </p>
          </article>
        );

      case 5:
        return (
          <article className="story-beat beat-cheeks" key="section-5">
            <div className="comic-speech-bubble">
              <div className="comic-bubble-tail" aria-hidden="true" />
              <p className="comic-bubble-text">
                “Sometimes, with that annoying ego of yours, especially when I ask for or take your things,
                I've wondered...
              </p>
              <div className="comic-punchline">
                ‘Why on earth do I have such an annoying sister? Look at those balloon cheeks!’ 🎈😳
              </div>
            </div>
          </article>
        );

      case 6:
        return (
          <article className="story-beat beat-cherish" key="section-6">
            <div className="beat-visual-wrapper">
              <Sparkles size={24} className="cherish-sparkle" />
            </div>

            <p className="beat-text-medium">
              But when I think about it now, those are the very things I know we'll{' '}
              <span className="highlight-gold">cherish forever together</span>.
            </p>
          </article>
        );

      case 7:
        return (
          <article className="story-beat beat-barbie" key="section-7">
            <div className="beat-visual-wrapper">
              <motion.div
                className="barbie-crown-wrapper"
                animate={shouldReduceMotion ? {} : { rotate: [-4, 4, -4], scale: [1, 1.05, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Crown size={28} className="crown-icon" />
                <span className="barbie-sparkle">✨</span>
              </motion.div>
            </div>

            <p className="beat-text-large">
              I thank God for giving me such a beautiful,{' '}
              <span className="barbie-pink-shimmer">Barbie-girl sister</span>. 💖
            </p>
          </article>
        );

      case 8:
        return (
          <article className="story-beat beat-milestone" key="section-8">
            <div className="milestone-badge">
              <span className="milestone-number">21</span>
              <span className="milestone-label">Golden Chapter</span>
            </div>

            <p className="beat-text-medium">
              And Tinu, I know reaching <span className="highlight-gold">21</span> isn't easy...
            </p>
          </article>
        );

      case 9:
        return (
          <article className="story-beat beat-old-joke" key="section-9">
            <div className="old-joke-card">
              <span className="old-joke-icon">👵✨</span>
              <h4 className="old-joke-title">
                “Because soon you'll become old and die! Hehehehe!” 💀🌸
              </h4>
            </div>
          </article>
        );

      case 10:
        return (
          <article className="story-beat beat-young-sis" key="section-10">
            <div className="young-sis-badge">
              <Smile size={20} className="smile-icon" />
              <span>Forever Your Younger Sis</span>
            </div>

            <p className="beat-text-large beat-smug">
              “Meanwhile, <span className="highlight-young">I'll still be young</span>.” 😎💅
            </p>
          </article>
        );

      case 11:
        return (
          <article className="story-beat beat-oldy-barbie" key="section-11">
            <div className="oldy-barbie-box">
              <p className="oldy-barbie-text">
                “You're already getting old, <span className="oldy-highlight">oldy Barbie!</span>” 🎀👵
              </p>
            </div>
          </article>
        );

      case 12:
        return (
          <article className="story-beat beat-cake-invitation" key="section-12">
            <motion.div
              className="cake-spark-icon-wrapper"
              animate={shouldReduceMotion ? {} : { scale: [1, 1.12, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Cake size={36} className="cake-prompt-icon" />
            </motion.div>

            <h3 className="cake-invitation-heading">
              “Anyway... shall we cut your cake?” 🎂✨
            </h3>

            <motion.button
              type="button"
              className="cut-cake-entry-button"
              onClick={onScrollToCake}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>Bring on the Birthday Cake!</span>
              <ChevronDown size={18} />
            </motion.button>
          </article>
        );

      default:
        return null;
    }
  };

  return (
    <section
      ref={containerRef}
      className="emotional-story-container"
      id="emotional-story"
      aria-label="A Heartfelt Letter for Tinu"
    >
      {/* Ambient background glows */}
      <div className="story-ambient-glow glow-1" aria-hidden="true" />
      <div className="story-ambient-glow glow-2" aria-hidden="true" />
      <div className="story-ambient-glow glow-3" aria-hidden="true" />

      {/* Story Stage Container */}
      <div className="story-stage-viewport">
        {/* Story Progress Indicator */}
        <div className="story-progress-indicator" aria-label={`Chapter ${currentIndex + 1} of ${totalSections}`}>
          <span className="story-progress-label">Memory {currentIndex + 1} of {totalSections}</span>
          <div className="story-progress-dots">
            {SECTION_DURATIONS.map((_, i) => (
              <button
                type="button"
                key={i}
                className={`progress-dot ${i === currentIndex ? 'active' : ''} ${i < currentIndex ? 'completed' : ''}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Jump to message ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Animated Single Active Section with Fade-in and Fade-out */}
        <div className="story-active-card-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="story-animated-content"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderCurrentSection(currentIndex)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Gentle Navigation Controls */}
        <div className="story-control-bar">
          <button
            type="button"
            className="story-nav-btn"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous message"
            title="Previous message"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            className="story-play-pause-btn"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? 'Resume story' : 'Pause story'}
            title={isPaused ? 'Resume autoplay' : 'Pause on this memory'}
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
            <span>{isPaused ? 'Paused' : 'Playing'}</span>
          </button>

          <button
            type="button"
            className="story-nav-btn"
            onClick={handleNext}
            aria-label={currentIndex === totalSections - 1 ? 'Go to cake' : 'Next message'}
            title={currentIndex === totalSections - 1 ? 'Go to cake' : 'Next message'}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
