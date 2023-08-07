import { DependencyList, useEffect } from "react";

export default function useEffectOnce(callback: Function, deps: DependencyList = []) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  useEffect(() => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      callback();
    }, 0);
  }, deps ?? []);
}
