"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface ProgressInterface {
  height?: number;
  color?: `#${string}`;
  transitionDuration?: number;
  easingFunction?: "ease-out" | "ease" | "ease-in" | "linear" | "ease-in-out";
}

function Progress({
  height = 5,
  color = "#5e5e5e",
  transitionDuration = 300,
  easingFunction = "ease-out",
}: ProgressInterface) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // <Link/> or <a/> Navigations
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;

      if (target.href !== location.href) {
        setLoadingProgress(10);
      }
    };

    const anchors = document.querySelectorAll("a");
    anchors.forEach((a) => a.addEventListener("click", handleClick));

    return () => {
      anchors.forEach((a) => a.removeEventListener("click", handleClick));
    };
  }, [pathname]);

  // Router (push / replace)
  useEffect(() => {
    const origPush = router.push;
    const origReplace = router.replace;

    router.push = (...args: Parameters<typeof origPush>) => {
      setLoadingProgress(10);
      return origPush(...args);
    };

    router.replace = (...args: Parameters<typeof origReplace>) => {
      setLoadingProgress(10);
      return origReplace(...args);
    };

    return () => {
      router.push = origPush;
      router.replace = origReplace;
    };
  }, [router]);

  // Smooth increment while loading up to 90%
  useEffect(() => {
    if (loadingProgress > 0 && loadingProgress < 90) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);

      return () => clearInterval(interval);
    }
  }, [loadingProgress]);

  // Complete when pathname or search parameters change
  useEffect(() => {
    if (!pathname) return;

    if (loadingProgress > 0) {
      setLoadingProgress(100);
      const timeout = setTimeout(() => setLoadingProgress(0), 300);
      return () => clearTimeout(timeout);
    }
  }, [pathname, searchParams]);

  if (!loadingProgress) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: `${height}px`,
        backgroundColor: `${color}`,
        zIndex: 99999999999,
        transitionProperty: "all",
        transitionDuration: `${transitionDuration}ms`,
        transitionTimingFunction: `${easingFunction}`,
        width: `${loadingProgress}%`,
        opacity: loadingProgress === 100 ? 0 : 1,
      }}
    />
  );
}

export default function NextRouteProgress({
  height = 5,
  color = "#5e5e5e",
  transitionDuration = 300,
  easingFunction = "ease-out",
}: ProgressInterface) {
  return (
    <Suspense>
      <Progress
        height={height}
        color={color}
        transitionDuration={transitionDuration}
        easingFunction={easingFunction}
      />
    </Suspense>
  );
}
