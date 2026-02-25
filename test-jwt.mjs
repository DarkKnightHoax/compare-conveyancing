import 'dotenv/config';
import { SignJWT, jwtVerify } from 'jose';

const jwtSecret = process.env.JWT_SECRET || 'admin-fallback-secret';
console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', jwtSecret.length);

const secret = new TextEncoder().encode(jwtSecret);

// Sign a token
const token = await new SignJWT({ sub: 'admin', role: 'admin' })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('12h')
  .sign(secret);

console.log('Token signed OK, first 50 chars:', token.substring(0, 50));

// Verify it
try {
  const { payload } = await jwtVerify(token, secret);
  console.log('Verify OK, role:', payload.role);
} catch(e) {
  console.log('Verify FAILED:', e.message);
}

// Now simulate what happens in the server: sign with one secret, verify with another
// (This would happen if the server restarts and ENV.cookieSecret changes)
const secret2 = new TextEncoder().encode('different-secret');
try {
  const { payload } = await jwtVerify(token, secret2);
  console.log('Cross-verify OK (unexpected):', payload.role);
} catch(e) {
  console.log('Cross-verify FAILED (expected if secrets differ):', e.message);
}
