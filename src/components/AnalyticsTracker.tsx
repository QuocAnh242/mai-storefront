'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track storefront user routes (skip admin and api routes)
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    // Send tracking hit asynchronously with keepalive
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pageview',
          path: pathname,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Ignore client network tracking errors
    }
  }, [pathname]);

  return null;
}
