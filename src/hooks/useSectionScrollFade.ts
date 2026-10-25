import { useEffect, useRef, useState } from "react";

export const useSectionScrollFade = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return { sectionRef, isVisible };
};
