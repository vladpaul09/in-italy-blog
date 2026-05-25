import { useCallback, useEffect, useState } from "react";

export default function useInViewport(threshold: number): { isInViewport: boolean; ref: React.RefCallback<HTMLElement> } {
  const [isInViewport, setIsInViewport] = useState(false);
  const [refElement, setRefElement] = useState<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setRefElement(node);
    }
  }, []);

  useEffect(() => {
    if (refElement) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInViewport(entry.isIntersecting);
        },
        { threshold: threshold }
      );
      observer.observe(refElement);

      return () => {
        observer.disconnect();
      };
    }
  }, [refElement, threshold]);

  return { isInViewport, ref: setRef };
}
