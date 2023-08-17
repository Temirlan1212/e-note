import { DependencyList, useEffect, useId } from "react";

let hookId: string | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const setTimer = (t: ReturnType<typeof setTimeout> | null) => (timer = t);

export default function useEffectOnce(callback: Function, deps: DependencyList = []) {
  const newId = useId();
  const id = deps?.length > 0 ? JSON.stringify(deps) : newId;

  useEffect(() => {
    if (timer != null && id === hookId) clearTimeout(timer);

    hookId = id;

    setTimer(
      setTimeout(() => {
        callback();
      }, 0)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
