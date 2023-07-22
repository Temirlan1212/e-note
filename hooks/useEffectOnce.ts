import { DependencyList, useEffect } from "react";

let initial = true;

export default function useEffectOnce(callback: Function, deps: DependencyList = []) {
  useEffect(() => {
    if (initial) {
      callback();

      if (deps.length === 0) initial = false;
    }
  }, deps);
}
