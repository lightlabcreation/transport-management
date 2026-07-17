export function normalizePhoneNumber(countryCode: string, nationalNumber: string): string {
  return `${countryCode.trim()}${nationalNumber.replace(/[\s()-]/g, '')}`;
}
