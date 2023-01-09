import * as crypto from 'crypto';

export const generateUniqueIdentifier = (): string => {
  return `${new Date().getTime()}-${crypto.randomBytes(16).toString('hex')}`;
};

export const generateBrightColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness < 125) {
    return generateBrightColor(); // regenerate if not bright enough
  }

  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
