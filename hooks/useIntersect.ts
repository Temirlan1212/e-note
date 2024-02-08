import { useEffect, useState, useRef, RefObject } from "react";

interface IUseIntersect {
  inView: boolean;
}

export const useIntersect = (ref: RefObject<HTMLElement>): IUseIntersect => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [inView, setIsOnView] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => setIsOnView(entry.isIntersecting));
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    observerRef.current?.observe(ref.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [ref.current]);

  return { inView };
};
