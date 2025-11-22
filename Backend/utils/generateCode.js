import crypto from "crypto";

/**
 * Generate a 6-digit numeric verification code
 * @returns {string} 6-digit code
 */
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a secure random token for password reset
 * @returns {string} Random token
 */
export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

