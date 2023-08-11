import { DependencyList, useEffect, useId, useMemo } from "react";

let hookId: string | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const setTimer = (t: ReturnType<typeof setTimeout> | null) => (timer = t);

export default function useEffectOnce(callback: Function, deps: DependencyList = []) {
  const id = useId();
  const memoId = useMemo(() => (deps?.length > 0 ? JSON.stringify(deps) : id), []);

  useEffect(() => {
    if (timer != null && memoId === hookId) clearTimeout(timer);

    hookId = memoId;

    setTimer(
      setTimeout(() => {
        callback();
      }, 0)
    );
  }, deps);
}
