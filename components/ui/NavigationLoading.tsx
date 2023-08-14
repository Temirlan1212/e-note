import { useState, useEffect, PropsWithChildren, FC } from "react";
import { useRouter } from "next/router";
import { LinearProgress } from "@mui/material";

const NavigationLoading: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setProgress(true);
    };
    const handleComplete = () => {
      setProgress(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  return (
    <>
      {progress && <LinearProgress sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }} />}
      {children}
    </>
  );
};

export default NavigationLoading;
