// lib/rateLimiter.ts
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest } from 'next/server';

// General rate limiting configuration
export const rateLimiter = (windowMs: number, maxRequests: number) => {
  const rateLimiter = new RateLimiterMemory({
    points: maxRequests,
    duration: Math.floor(windowMs / 1000), // Convert milliseconds to seconds
  });

  return async (req: NextRequest) => {
    try {
      // Use the client's IP address as the key for rate limiting
      const ip = req.ip || 'unknown';
      await rateLimiter.consume(ip);
      return true;
    } catch (error) {
      return false;
    }
  };
};