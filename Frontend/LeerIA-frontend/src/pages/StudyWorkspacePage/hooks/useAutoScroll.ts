import { useEffect, type RefObject } from "react";

export function useAutoScroll(
  ref: RefObject<HTMLDivElement | null>,
  dependencies: unknown[]
) {
  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, dependencies);
}