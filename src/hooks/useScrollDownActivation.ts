import { useEffect, useState } from "react";

type SectionRef = { current: HTMLElement | null };

/**
 * Activates once the section has actually been scrolled into view.
 *
 * It looks at the section's real position on every scroll/resize, so it works the same
 * whether the user arrived by mouse wheel, touch, scrollbar drag, keyboard, or a navbar
 * link. No wheel/touch gesture detection is involved any more.
 *
 * `_requiredSwipes` is kept only so existing calls like useScrollDownActivation(ref, 1)
 * still compile.
 */
export const useScrollDownActivation = (sectionRef: SectionRef, _requiredSwipes = 1) => {
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    let done = false;

    const removeListeners = () => {
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };

    const check = () => {
      frame = 0;
      if (done) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // The section's top has risen into the upper 85% of the screen and it is not gone yet.
      if (rect.top < viewportHeight * 0.85 && rect.bottom > viewportHeight * 0.15) {
        done = true;
        setIsActivated(true);
        removeListeners();
      }
    };

    function schedule() {
      if (frame || done) return;
      frame = window.requestAnimationFrame(check);
    }

    // capture: true also catches scrolling inside any wrapper element, not only the window
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    check();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      removeListeners();
    };
  }, [sectionRef]);

  return isActivated;
};

// import { useEffect, useState } from "react";

// type SectionRef = { current: HTMLElement | null };

// // A "swipe" is one continuous burst of downward scrolling. It ends after this much idle time.
// const GESTURE_IDLE_MS = 300;

// export const useScrollDownActivation = (sectionRef: SectionRef, requiredSwipes = 1) => {
//   const [isActivated, setIsActivated] = useState(false);

//   useEffect(() => {
//     const section = sectionRef.current;
//     if (!section) return;

//     let sectionIsVisible = false;
//     let activated = false;
//     let gestureActive = false;
//     let gestureTimer = 0;
//     let downwardSwipes = 0;
//     let lastScrollY = window.scrollY;
//     let touchStartY: number | null = null;

//     // Any downward movement while the section is on screen counts, however it was
//     // produced (wheel, touch, scrollbar drag, keyboard, momentum scrolling).
//     const registerDownwardMovement = () => {
//       if (!sectionIsVisible || activated) return;

//       window.clearTimeout(gestureTimer);
//       gestureTimer = window.setTimeout(() => {
//         gestureActive = false;
//       }, GESTURE_IDLE_MS);

//       if (gestureActive) return;
//       gestureActive = true;
//       downwardSwipes += 1;

//       if (downwardSwipes >= requiredSwipes) {
//         activated = true;
//         setIsActivated(true);
//       }
//     };

//     // Main trigger: works even when the user scrolls continuously into the section.
//     const onScroll = () => {
//       const y = window.scrollY;
//       if (y > lastScrollY) registerDownwardMovement();
//       lastScrollY = y;
//     };

//     // Fallbacks for when the page cannot scroll any further (e.g. bottom of page).
//     const onWheel = (event: WheelEvent) => {
//       if (event.deltaY > 0) registerDownwardMovement();
//     };

//     const onTouchStart = (event: TouchEvent) => {
//       touchStartY = event.touches[0]?.clientY ?? null;
//     };

//     const onTouchEnd = (event: TouchEvent) => {
//       const endY = event.changedTouches[0]?.clientY;
//       if (touchStartY !== null && endY !== undefined && touchStartY - endY > 24) {
//         registerDownwardMovement();
//       }
//       touchStartY = null;
//     };

//     const onKeyDown = (event: KeyboardEvent) => {
//       if (["ArrowDown", "PageDown", " ", "End"].includes(event.key)) {
//         registerDownwardMovement();
//       }
//     };

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         sectionIsVisible = entry.isIntersecting;
//         if (!sectionIsVisible && !activated) {
//           // Left the section before activating: start fresh next time.
//           downwardSwipes = 0;
//           gestureActive = false;
//           window.clearTimeout(gestureTimer);
//         }
//         // If the user scrolled in and is already past the top edge, activate right away.
//         if (sectionIsVisible && !activated && section.getBoundingClientRect().top < 0) {
//           registerDownwardMovement();
//         }
//       },
//       { threshold: 0.05 },
//     );

//     observer.observe(section);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("wheel", onWheel, { passive: true });
//     window.addEventListener("touchstart", onTouchStart, { passive: true });
//     window.addEventListener("touchend", onTouchEnd, { passive: true });
//     window.addEventListener("keydown", onKeyDown);

//     return () => {
//       observer.disconnect();
//       window.clearTimeout(gestureTimer);
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("wheel", onWheel);
//       window.removeEventListener("touchstart", onTouchStart);
//       window.removeEventListener("touchend", onTouchEnd);
//       window.removeEventListener("keydown", onKeyDown);
//     };
//   }, [sectionRef, requiredSwipes]);

//   return isActivated;
// };

