import { DependencyList, EffectCallback, useEffect } from "react";

let initial = true;

export default function useEffectOnce(callback: EffectCallback, deps: DependencyList = []) {
  useEffect(() => {
    if (initial) {
      callback();
      initial = false;
    }
  }, deps);
}
