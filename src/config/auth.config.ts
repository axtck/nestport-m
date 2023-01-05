import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: parseInt(process.env.JWT_EXPIRY as string, 10),
  saltRounds: parseInt(process.env.SALT_ROUNDS as string, 10) || 12,
}));
