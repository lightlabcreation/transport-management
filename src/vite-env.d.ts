/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: 'development' | 'test' | 'staging' | 'production';
  readonly VITE_MOCK_MODE?: 'true' | 'false';
  readonly VITE_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  readonly VITE_SERVICE_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
