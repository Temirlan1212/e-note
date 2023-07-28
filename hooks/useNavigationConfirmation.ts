import { useEffect } from "react";

export default function useNavigationConfirmation(block: boolean = true) {
  useEffect(() => {
    const onBeforeUnloadHandler = (e: BeforeUnloadEvent) => {
      if (block) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", onBeforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnloadHandler);
    };
  }, [block]);
}
