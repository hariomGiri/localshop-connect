
import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIsVisibleProps {
  threshold?: number;
  rootMargin?: string;
}

export function useIsVisible<T extends HTMLElement>({
  threshold = 0.1,
  rootMargin = '0px'
}: UseIsVisibleProps = {}): [boolean, RefObject<T>] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return [isVisible, ref];
}
