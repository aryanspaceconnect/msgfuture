import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
// Ensure the encryption key is 32 bytes (64 hex characters)
const secretKey = process.env.ENCRYPTION_KEY || '';

if (!secretKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  // Fallback for dev only (DO NOT USE IN PROD)
  console.warn('WARNING: Using insecure fallback encryption key for development');
}

// Ensure key is Buffer of 32 bytes
const key = secretKey ? Buffer.from(secretKey, 'hex') : crypto.randomBytes(32);

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    content: Buffer.concat([encrypted, authTag]).toString('hex')
  };
}

export function decrypt(encryptedData: { iv: string; content: string }) {
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const encryptedText = Buffer.from(encryptedData.content, 'hex');

  // Extract auth tag (last 16 bytes)
  const authTag = encryptedText.subarray(encryptedText.length - 16);
  const encrypted = encryptedText.subarray(0, encryptedText.length - 16);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
