# Next Route Progress

A lightweight progress bar for Next.js App Router.

An alternative to [nextjs-progressbar](https://www.npmjs.com/package/nextjs-progressbar), which worked great until Next.js 13, when `router.events` was deprecated. The frustration came from seeing nextjs-progressbar still being widely recommended, even though it no longer works in modern Next.js versions (next > 13). For context, see: [nextjs-progressbar issues](https://github.com/apal21/nextjs-progressbar/issues/86) and discussion on [alternative for router events in v13.4](https://github.com/vercel/next.js/discussions/51329)

This solution is a hybrid approach inspired by [this comment](https://github.com/vercel/next.js/discussions/41745#discussioncomment-4208449) by [@jmcmullen](https://github.com/jmcmullen)

## Import

```tsx
import NextRouteProgress from "next-route-progress";
```

## Usage

You can drop it directly into your RootLayout without extra setup. It automatically tracks route changes — whether triggered by \<Link />, \<a /> tags, or updates to search parameters.

```tsx
import NextRouteProgress from "next-route-progress";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <NextRouteProgress
          color="#5e5e5e"
          easingFunction="ease"
          height={5}
          transitionDuration={300}
        />
        {children}
      </body>
    </html>
  );
}
```

## Configuration

- color → Hex code for the bar color (default: #5e5e5e).
- height → Height of the progress bar in pixels (default: 5).
- transitionDuration → Duration of the transition in milliseconds (default: 300).
- easingFunction → CSS easing function for transitions (default: ease-out).

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/okraks/next-route-progress/issues) or make a PR [here](https://github.com/okraks/next-route-progress).

## LICENSE

MIT
