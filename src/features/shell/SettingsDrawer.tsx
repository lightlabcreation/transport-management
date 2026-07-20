import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kiyaan-theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kiyaan-language') || 'en-US';
    }
    return 'en-US';
  });
  const [quickTrackingActive, setQuickTrackingActive] = useState(true);

  if (!isOpen || typeof document === 'undefined') return null;

  function toggleTheme() {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('kiyaan-theme', next ? 'dark' : 'light');
      }
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }

  function handleLanguageChange(newLang: string) {
    setSelectedLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kiyaan-language', newLang);
    }
  }

  function handleNavigate(path: string) {
    onClose();
    navigate(path);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex justify-end bg-black/50 backdrop-blur-xs transition-opacity"
      aria-modal="true"
      role="dialog"
      aria-label="Quick Settings & Navigation"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <aside className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-border bg-surface p-6 shadow-xl sm:w-80">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-heading-sm font-bold text-foreground">Quick Settings</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close quick settings"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Quick Toggles Section */}
        <div className="border-b border-border py-4 space-y-3">
          <p className="text-body-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Instant Preferences
          </p>

          {/* Dark-Light Mode Toggle (Corrected spelling) */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-muted/40 px-3.5 py-2.5 text-body-sm font-medium text-foreground">
            <div className="flex items-center gap-2">
              <span>{isDarkMode ? '🌙' : '☀️'}</span>
              <span>Dark-Light Mode</span>
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isDarkMode ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Quick Life Tracking Status Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-muted/40 px-3.5 py-2.5 text-body-sm font-medium text-foreground">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${quickTrackingActive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
              <span>Quick Life Tracking</span>
            </div>
            <button
              onClick={() => setQuickTrackingActive(!quickTrackingActive)}
              className={`rounded px-2 py-0.5 text-xs font-bold transition-colors ${
                quickTrackingActive
                  ? 'bg-success/20 text-success'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {quickTrackingActive ? 'ACTIVE' : 'PAUSED'}
            </button>
          </div>

          {/* Quick Language Selector */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-muted/40 px-3.5 py-2 text-body-sm">
            <span className="text-muted-foreground font-medium">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent font-semibold text-foreground focus:outline-none"
            >
              <option value="en-US">🇺🇸 English (US)</option>
              <option value="en-GB">🇬🇧 English (UK)</option>
              <option value="ar-AE">🇦🇪 العربية (Arabic)</option>
              <option value="hi-IN">🇮🇳 हिंदी (Hindi)</option>
              <option value="ur-PK">🇵🇰 اردو (Urdu)</option>
              <option value="fr-FR">🇫🇷 Français (French)</option>
              <option value="es-ES">🇪🇸 Español (Spanish)</option>
              <option value="de-DE">🇩🇪 Deutsch (German)</option>
              <option value="ru-RU">🇷🇺 Русский (Russian)</option>
              <option value="zh-CN">🇨🇳 中文 (Chinese)</option>
              <option value="ja-JP">🇯🇵 日本語 (Japanese)</option>
              <option value="tr-TR">🇹🇷 Türkçe (Turkish)</option>
              <option value="pt-BR">🇵🇹 Português</option>
            </select>
          </div>
        </div>

        {/* Navigation Shortcuts */}
        <nav className="flex-1 overflow-y-auto py-4">
          <p className="mb-2 text-body-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation Shortcuts
          </p>
          <ul className="space-y-1">
            {[
              { name: 'Dashboard', path: '/app/dashboard', icon: '📊' },
              { name: 'Live Map', path: '/app/live-map', icon: '🗺️' },
              { name: 'Trips', path: '/app/trips', icon: '🚛' },
              { name: 'Notifications', path: '/app/notifications', icon: '🔔' },
              { name: 'Profile', path: '/app/profile', icon: '👤' },
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigate(item.path)}
                  className="flex w-full items-center justify-between rounded-md px-3.5 py-2.5 text-body-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                  <span className="text-muted-foreground">→</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Button Below Menu: Open Full Application Preferences */}
        <div className="border-t border-border pt-4">
          <button
            onClick={() => handleNavigate('/app/settings')}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-body-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            <span>⚙️ Open All Preferences & API Keys</span>
          </button>
        </div>
      </aside>
    </div>,
    document.body
  );
}
