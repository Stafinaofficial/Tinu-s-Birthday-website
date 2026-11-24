import React, { useMemo } from 'react';
import './PetalsOverlay.css';

/**
 * Floating flower petals that drift across the screen with gentle CSS keyframe animations.
 * Provides a dreamy, Studio Ghibli-inspired watercolor touch.
 */
export default function PetalsOverlay() {
  // Generate a fixed set of petal properties for consistent rendering
  const petals = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => {
      const left = (i * 4.6 + (i % 3) * 2) % 100; // spread evenly across width
      const size = 12 + ((i * 7) % 16); // 12px - 28px
      const duration = 12 + ((i * 3) % 11); // 12s - 22s
      const delay = -(i * 1.8); // staggered start times so screen is immediately filled
      const swayDuration = 3 + ((i * 2) % 4); // 3s - 6s sway
      const opacity = 0.55 + ((i % 5) * 0.08); // 0.55 - 0.87
      const petalType = i % 3; // 3 subtle variations

      return {
        id: i,
        left: `${left}%`,
        size: `${size}px`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        swayDuration: `${swayDuration}s`,
        opacity,
        petalType,
      };
    });
  }, []);

  return (
    <div className="petals-container" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className={`petal-wrapper petal-type-${petal.petalType}`}
          style={{
            left: petal.left,
            animationDuration: petal.duration,
            animationDelay: petal.delay,
          }}
        >
          <div
            className="petal"
            style={{
              width: petal.size,
              height: `calc(${petal.size} * 1.25)`,
              animationDuration: petal.swayDuration,
              opacity: petal.opacity,
            }}
          />
        </div>
      ))}
    </div>
  );
}
