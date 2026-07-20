import { useState } from 'react';
import { useNavigate } from 'react-router';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  if (!isOpen) return null;

  function toggleTheme() {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  }

  function handleRegisterClick() {
    onClose();
    navigate('/auth/register');
  }

  return (
    <div
      className="fixed inset-0 z-modal flex justify-end bg-black/50 backdrop-blur-xs transition-opacity"
      aria-modal="true"
      role="dialog"
      aria-label="Settings Menu"
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
            <h2 className="text-heading-sm font-bold text-foreground">Menu & Settings</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Client Menu Items List */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {[
              { name: 'MAP', path: '/app/live-map' },
              { name: 'Profile', path: '/app/profile' },
              { name: 'Opportunity', path: '/app/trips' },
              { name: 'Notification', path: '/app/notifications' },
              { name: 'Contact us', path: '/app/settings' },
              { name: 'Setting', path: '/app/settings' },
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    onClose();
                    navigate(item.path);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-4 py-3 text-body-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
                >
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">→</span>
                </button>
              </li>
            ))}

            {/* Dark-Light Mode Toggle */}
            <li>
              <div className="flex items-center justify-between rounded-md px-4 py-3 text-body-sm font-medium text-foreground hover:bg-surface-muted">
                <span>Dark-Light Mod</span>
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme mode"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
            </li>
          </ul>
        </nav>

        {/* Action Buttons Below Menu */}
        <div className="border-t border-border pt-4 space-y-3">
          {/* Register (open Service List) */}
          <button
            onClick={handleRegisterClick}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-body-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Register (open Service List)</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-2 text-body-sm">
            <span className="text-muted-foreground font-medium">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent font-semibold text-foreground focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Arabic">العربية (Arabic)</option>
              <option value="Hindi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>
      </aside>
    </div>
  );
}
