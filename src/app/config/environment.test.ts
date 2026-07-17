import { describe, expect, it } from 'vitest';

import { parsePublicEnvironment } from '@/app/config/environment';

describe('parsePublicEnvironment', () => {
  it('uses safe default values', () => {
    expect(parsePublicEnvironment({})).toEqual({
      appEnvironment: 'development',
      mockMode: true,
      logLevel: 'warn',
    });
  });

  it('accepts valid overrides', () => {
    expect(
      parsePublicEnvironment({
        VITE_APP_ENV: 'production',
        VITE_MOCK_MODE: 'false',
        VITE_LOG_LEVEL: 'error',
      }),
    ).toEqual({
      appEnvironment: 'production',
      mockMode: false,
      logLevel: 'error',
    });
  });

  it('converts boolean strings', () => {
    expect(parsePublicEnvironment({ VITE_MOCK_MODE: 'true' }).mockMode).toBe(true);
    expect(parsePublicEnvironment({ VITE_MOCK_MODE: 'false' }).mockMode).toBe(false);
  });

  it('rejects an invalid application environment', () => {
    expect(() => parsePublicEnvironment({ VITE_APP_ENV: 'local' })).toThrowError(
      'Invalid public environment configuration: VITE_APP_ENV',
    );
  });

  it('rejects an invalid log level', () => {
    expect(() => parsePublicEnvironment({ VITE_LOG_LEVEL: 'verbose' })).toThrowError(
      'Invalid public environment configuration: VITE_LOG_LEVEL',
    );
  });

  it('rejects an invalid boolean value', () => {
    expect(() => parsePublicEnvironment({ VITE_MOCK_MODE: 'yes' })).toThrowError(
      'Invalid public environment configuration: VITE_MOCK_MODE',
    );
  });

  it('accepts a valid service URL', () => {
    expect(
      parsePublicEnvironment({ VITE_SERVICE_BASE_URL: 'https://example.invalid/service' }),
    ).toMatchObject({
      serviceBaseUrl: 'https://example.invalid/service',
    });
  });

  it('rejects an invalid service URL', () => {
    expect(() => parsePublicEnvironment({ VITE_SERVICE_BASE_URL: 'not-a-url' })).toThrowError(
      'Invalid public environment configuration: VITE_SERVICE_BASE_URL',
    );
  });

  it('treats an empty service URL as absent', () => {
    expect(parsePublicEnvironment({ VITE_SERVICE_BASE_URL: '' })).not.toHaveProperty(
      'serviceBaseUrl',
    );
  });

  it('does not expose invalid raw values in validation errors', () => {
    const invalidRawValue = 'private-invalid-value';

    expect.assertions(2);

    try {
      parsePublicEnvironment({ VITE_APP_ENV: invalidRawValue });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).not.toContain(invalidRawValue);
    }
  });
});
