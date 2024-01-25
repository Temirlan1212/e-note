import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect } from "react";

export const ScrollHandler: FC<PropsWithChildren<{ start: boolean; seconds?: number }>> = ({
  children,
  start = false,
  seconds = 100,
}) => {
  const { pathname } = useRouter();

  const handleScroll = () => {
    const hash = window.location.hash;
    const element = document.getElementById(hash.replace("#", ""));
    window.scrollTo({
      behavior: element ? "smooth" : "auto",
      top: element ? element.offsetTop : 0,
    });
  };

  useEffect(() => {
    if (start) {
      setTimeout(() => {
        handleScroll();
      }, seconds);
    }
  }, [pathname, start]);

  return children;
};
