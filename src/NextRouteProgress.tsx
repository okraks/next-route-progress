"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface ProgressInterface {
  height?: number;
  color?: string;
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

      // Opens in a new tab/window — current page never navigates
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0 ||
        target.target === "_blank"
      ) {
        return;
      }

      // Downloads don't navigate the SPA
      if (target.hasAttribute("download")) return;

      let nextUrl: URL;
      try {
        nextUrl = new URL(target.href, location.href);
      } catch {
        return;
      }

      // mailto:, tel:, javascript:, etc. — no SPA navigation
      if (nextUrl.protocol !== "http:" && nextUrl.protocol !== "https:") {
        return;
      }

      // External origin — leaves the SPA, no pathname/search change to await
      if (nextUrl.origin !== location.origin) return;

      // Same route (hash-only change or identical URL) — Next won't re-render
      if (
        nextUrl.pathname === location.pathname &&
        nextUrl.search === location.search
      ) {
        return;
      }

      setLoadingProgress(10);
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
