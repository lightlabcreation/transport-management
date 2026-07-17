export interface RequestOtpInput {
  mobileNumber: string;
}

export interface OtpSentResult {
  status: 'otp_sent';
  challengeId: string;
  maskedMobile: string;
  expiresAt: string;
}

export interface VerifyOtpInput {
  challengeId: string;
  code: string;
}

export interface AuthenticatedResult {
  status: 'authenticated';
}

export interface AuthService {
  requestOtp(input: RequestOtpInput): Promise<OtpSentResult>;
  verifyOtp(input: VerifyOtpInput): Promise<AuthenticatedResult>;
}

export type AuthServiceErrorCode =
  'invalid_otp' | 'expired_challenge' | 'rate_limited' | 'network' | 'unavailable' | 'unknown';

export class AuthServiceError extends Error {
  readonly code: AuthServiceErrorCode;

  constructor(code: AuthServiceErrorCode) {
    super(code);
    this.name = 'AuthServiceError';
    this.code = code;
  }
}
