import { z } from 'zod';

const environmentSchema = z.object({
  VITE_APP_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  VITE_MOCK_MODE: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'silent']).default('warn'),
  VITE_SERVICE_BASE_URL: z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmedValue = value.trim();
    return trimmedValue === '' ? undefined : trimmedValue;
  }, z.url().optional()),
});

export interface PublicEnvironment {
  readonly appEnvironment: 'development' | 'test' | 'staging' | 'production';
  readonly mockMode: boolean;
  readonly logLevel: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  readonly serviceBaseUrl?: string;
}

export function parsePublicEnvironment(source: unknown): PublicEnvironment {
  const result = environmentSchema.safeParse(source);

  if (!result.success) {
    const invalidVariables = [
      ...new Set(
        result.error.issues.map((issue) => String(issue.path[0] ?? 'environment configuration')),
      ),
    ];

    throw new Error(`Invalid public environment configuration: ${invalidVariables.join(', ')}`);
  }

  const environment: PublicEnvironment = {
    appEnvironment: result.data.VITE_APP_ENV,
    mockMode: result.data.VITE_MOCK_MODE,
    logLevel: result.data.VITE_LOG_LEVEL,
  };

  if (result.data.VITE_SERVICE_BASE_URL === undefined) {
    return environment;
  }

  return {
    ...environment,
    serviceBaseUrl: result.data.VITE_SERVICE_BASE_URL,
  };
}

export const publicEnvironment: PublicEnvironment = parsePublicEnvironment(import.meta.env);
