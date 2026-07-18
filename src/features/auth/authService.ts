export interface RequestOtpInput {
  mobileNumber: string;
  password?: string | undefined;
}

export type AuthChallengeSource = 'login' | 'registration';

export interface OtpSentResult {
  status: 'otp_sent';
  source: AuthChallengeSource;
  challengeId: string;
  maskedMobile: string;
  expiresAt: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email?: string;
  language: 'en';
  acceptedTerms: boolean;
}

export interface VerifyOtpInput {
  challengeId: string;
  code: string;
}

export interface AuthenticatedResult {
  status: 'authenticated';
}

export interface LoginWithPasswordInput {
  mobileNumber: string;
  password?: string | undefined;
}

export interface AuthService {
  requestOtp(input: RequestOtpInput): Promise<OtpSentResult>;
  register(input: RegisterInput): Promise<OtpSentResult>;
  verifyOtp(input: VerifyOtpInput): Promise<AuthenticatedResult>;
  loginWithPassword?(input: LoginWithPasswordInput): Promise<AuthenticatedResult>;
}

export type AuthServiceErrorCode =
  | 'duplicate_account'
  | 'validation'
  | 'invalid_otp'
  | 'expired_challenge'
  | 'rate_limited'
  | 'network'
  | 'unavailable'
  | 'unknown';

export class AuthServiceError extends Error {
  readonly code: AuthServiceErrorCode;

  constructor(code: AuthServiceErrorCode) {
    super(code);
    this.name = 'AuthServiceError';
    this.code = code;
  }
}
