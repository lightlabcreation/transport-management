import { useEffect } from 'react';
import { RouterProvider } from 'react-router/dom';

import { router } from '@/app/router';

export function App() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kiyaan-theme');
      const isSystemDark =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && isSystemDark) || (stored === 'system' && isSystemDark)) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, []);

  return <RouterProvider router={router} />;
}
