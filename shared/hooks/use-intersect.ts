import { useEffect, useRef, useState } from "preact/hooks";

type UseIntersectArgs = IntersectionObserverInit;

export const useIntersect = ({
  root,
  rootMargin = "",
  threshold = 0,
}: UseIntersectArgs = {}) => {
  const [entry, updateEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new window.IntersectionObserver(
      ([entry]) => updateEntry(entry),
      {
        root,
        rootMargin,
        threshold,
      }
    );

    if (node) observer.current?.observe(node);

    return () => observer.current?.disconnect();
  }, [node, root, rootMargin, threshold]);

  return [setNode, entry] as const;
};
