import { useEffect } from "react";

/**
 * Browsers only allow audio.play() after a real user gesture (click, tap, key press).
 * Scrolling / wheel events do NOT count. That is why sound only worked after you
 * clicked the navbar: the click "unlocked" audio for the page.
 *
 * This hook listens for the first real gesture anywhere on the page and silently
 * plays + pauses your audio element(s), which unlocks them for later scroll-triggered play().
 * Call it once, passing the same Audio objects you play later.
 */
export const useAudioPrimer = (getAudios: () => Array<HTMLAudioElement | null | undefined>) => {
  useEffect(() => {
    let primed = false;

    const prime = () => {
      if (primed) return;
      primed = true;

      getAudios().forEach((audio) => {
        if (!audio) return;
        const wasMuted = audio.muted;
        audio.muted = true;
        void audio
          .play()
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = wasMuted;
          })
          .catch(() => {
            audio.muted = wasMuted;
            primed = false; // try again on the next gesture
          });
      });

      if (primed) removeListeners();
    };

    // "touchend" (not "touchstart") is what counts as a gesture on mobile browsers.
    const events: Array<keyof WindowEventMap> = ["pointerdown", "click", "touchend", "keydown"];
    const removeListeners = () => events.forEach((e) => window.removeEventListener(e, prime));
    events.forEach((e) => window.addEventListener(e, prime, { passive: true }));

    return removeListeners;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};