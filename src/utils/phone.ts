export const INDIAN_PHONE_PREFIX = '+91';
export const INDIAN_PHONE_DIGIT_COUNT = 10;

export const sanitizeIndianPhoneDigits = (value: string) =>
  value.replace(/\D/g, '').slice(0, INDIAN_PHONE_DIGIT_COUNT);

export const isValidIndianPhoneDigits = (value: string) =>
  sanitizeIndianPhoneDigits(value).length === INDIAN_PHONE_DIGIT_COUNT;

export const buildIndianPhoneNumber = (value: string) =>
  `${INDIAN_PHONE_PREFIX}${sanitizeIndianPhoneDigits(value)}`;
