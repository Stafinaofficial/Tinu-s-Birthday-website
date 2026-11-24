import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, ChevronDown } from 'lucide-react';
import './BirthdayScene.css';

/**
 * Birthday Scene:
 * The warm Ghibli watercolor tribute section revealed after scrolling the opening scene.
 * Displays "Happy Birthday, Stalina (Tinu)!" with:
 * - Subtitle: "With endless love, from your little sister."
 * - Nostalgic sisters illustration (sisters.png / sisters.jpeg)
 * - Directly transitions into the progressive emotional storytelling section.
 */
export default function BirthdayScene({ onScrollToStory }) {
  const shouldReduceMotion = useReducedMotion();

  // Words for the animated heading
  const titleWords = ['Happy', 'Birthday,', 'Stalina', '(Tinu)!'];

  // Container variants for staggered entrance
  const headingContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const wordVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 0, y: 30, rotate: -1.5 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 90,
      },
    },
  };

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 35, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.85,
        delay: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const handleScrollToStory = () => {
    if (onScrollToStory) {
      onScrollToStory();
    } else {
      const targetSection =
        document.getElementById('garden-letter-scene') ||
        document.getElementById('emotional-story');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="birthday-scene-container" id="birthday-scene" aria-label="Birthday Celebration">
      {/* Decorative watercolor glow backdrop */}
      <div className="birthday-watercolor-glow top" aria-hidden="true" />
      <div className="birthday-watercolor-glow bottom" aria-hidden="true" />

      <div className="birthday-content-wrapper">
        {/* Decorative Header Sparkle Pill */}
        <motion.div
          className="birthday-tag"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          <Star className="tag-star" size={14} />
          <span>A Special Celebration</span>
          <Star className="tag-star" size={14} />
        </motion.div>

        {/* Animated Main Heading */}
        <motion.h2
          className="birthday-main-heading"
          variants={headingContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {titleWords.map((word, index) => {
            const isName = word === 'Stalina' || word === '(Tinu)!';
            return (
              <motion.span
                key={index}
                className={`heading-word ${isName ? 'highlight-name' : ''}`}
                variants={wordVariants}
              >
                {word}
                {index < titleWords.length - 1 ? '\u00A0' : ''}
              </motion.span>
            );
          })}
        </motion.h2>

        {/* Corrected Subtitle: from your little sister */}
        <motion.p
          className="birthday-script-note"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          With endless love, from your little sister.
        </motion.p>

        {/* Postcard Frame Showcase for Sisters Memory */}
        <motion.div
          className="birthday-memory-card"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="card-ornament top-left" aria-hidden="true">✦</div>
          <div className="card-ornament top-right" aria-hidden="true">✦</div>
          <div className="card-ornament bottom-left" aria-hidden="true">✦</div>
          <div className="card-ornament bottom-right" aria-hidden="true">✦</div>

          <div className="memory-image-frame">
            <img
              src="/assets/sisters.png"
              alt="Stalina and her little sister together"
              className="memory-photo"
              onError={(e) => {
                e.currentTarget.src = '/assets/sisters.jpeg';
              }}
            />
            <div className="photo-sunlight-wash" aria-hidden="true" />
          </div>

          <div className="memory-card-caption">
            <p className="caption-text">
              “Through every chapter, through every laugh and quiet dream, you make life softer, brighter, and infinitely more magical.”
            </p>
          </div>
        </motion.div>

        {/* Direct Transition Callout to the Interactive Story */}
        <motion.div
          className="story-invitation"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button
            type="button"
            className="story-scroll-button"
            onClick={handleScrollToStory}
            aria-label="Scroll to read our story"
          >
            <span className="story-scroll-text">Open Our Story</span>
            <motion.div
              className="story-scroll-chevron"
              animate={shouldReduceMotion ? {} : { y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
