import { AuthServiceError, type AuthService, type AuthServiceErrorCode } from './authService';

type MockAuthOutcome = { type: 'otp_sent' } | { type: 'failure'; code: AuthServiceErrorCode };

interface MockAuthServiceOptions {
  outcome?: MockAuthOutcome;
  delayMs?: number;
}

export function createMockAuthService({
  outcome = { type: 'otp_sent' },
  delayMs = 300,
}: MockAuthServiceOptions = {}): AuthService {
  return {
    async requestOtp() {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      if (outcome.type === 'failure') {
        throw new AuthServiceError(outcome.code);
      }

      return {
        status: 'otp_sent',
        source: 'login',
        challengeId: 'mock-auth-challenge',
        maskedMobile: '+•• ••••••3210',
        expiresAt: '2030-01-01T00:05:00.000Z',
      };
    },
    async register() {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      if (outcome.type === 'failure') {
        throw new AuthServiceError(outcome.code);
      }

      return {
        status: 'otp_sent',
        source: 'registration',
        challengeId: 'mock-registration-challenge',
        maskedMobile: '+•• ••••••3210',
        expiresAt: '2030-01-01T00:05:00.000Z',
      };
    },
    async verifyOtp({ code }) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      if (outcome.type === 'failure') {
        throw new AuthServiceError(outcome.code);
      }

      if (code !== '123456') {
        throw new AuthServiceError('invalid_otp');
      }

      return { status: 'authenticated' };
    },
    async loginWithPassword({ password }) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      if (outcome.type === 'failure') {
        throw new AuthServiceError(outcome.code);
      }

      if (!password) {
        throw new AuthServiceError('validation');
      }

      return { status: 'authenticated' };
    },
  };
}

export const mockAuthService = createMockAuthService();
