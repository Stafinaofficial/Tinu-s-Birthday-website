import React, { useRef } from 'react';
import PetalsOverlay from './components/PetalsOverlay';
import AudioController from './components/AudioController';
import OpeningScene from './components/OpeningScene';
import BirthdayScene from './components/BirthdayScene';
import GardenLetterScene from './components/GardenLetterScene';
import EmotionalStory from './components/EmotionalStory';
import CakePrank from './components/CakePrank';
import './App.css';

/**
 * Main Application Component
 * Assembles the personalized, cinematic birthday experience for Stalina (Tinu):
 * 1. Persistent Audio Controller (/assets/birthday-music.mp3 playing continuously)
 * 2. Opening Scene (Ghibli video/fallback hero with "Open Your Surprise" button)
 * 3. Birthday Scene (Birthday introduction, corrected subtitle, sisters photo)
 * 4. Garden Letter Scene (/assets/tinu_garden_letter_sequence.mp4 with book placeholder)
 * 5. Emotional Story (Progressive 13-beat narrative)
 * 6. Cake Prank (Movable knife, escaping cake, funny billing punchline & celebration)
 */
function App() {
  const audioControllerRef = useRef(null);

  // Triggered when clicking "Open Your Surprise" or opening scroll indicator
  const handleOpenSurprise = () => {
    if (audioControllerRef.current && audioControllerRef.current.startAudio) {
      audioControllerRef.current.startAudio();
    }
    scrollToBirthday();
  };

  const scrollToBirthday = () => {
    const birthdaySection = document.getElementById('birthday-scene');
    if (birthdaySection) {
      birthdaySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGarden = () => {
    const gardenSection = document.getElementById('garden-letter-scene');
    if (gardenSection) {
      gardenSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStory = () => {
    const storySection = document.getElementById('emotional-story');
    if (storySection) {
      storySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCake = () => {
    const cakeSection = document.getElementById('cake-scene');
    if (cakeSection) {
      cakeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* Floating flower petals overlay (pure CSS, reduced-motion friendly) */}
      <PetalsOverlay />

      {/* Persistent Audio Controller: plays birthday-music.mp3 continuously */}
      <AudioController ref={audioControllerRef} />

      {/* Scene 1: Full-screen opening scene with cinematic video/fallback and Open Surprise trigger */}
      <OpeningScene
        onScrollToNext={scrollToBirthday}
        onOpenSurprise={handleOpenSurprise}
      />

      {/* Scene 2: Birthday introduction with sisters illustration */}
      <BirthdayScene onScrollToStory={scrollToGarden} />

      {/* Scene 3: Garden Letter Video Sequence & Interactive Book Placeholder */}
      <GardenLetterScene onScrollToStory={scrollToStory} />

      {/* Scene 4: Progressive cinematic emotional story with narrative beats */}
      <EmotionalStory onScrollToCake={scrollToCake} />

      {/* Scene 5: Interactive birthday cake prank & grand celebration */}
      <CakePrank />
    </div>
  );
}

export default App;
