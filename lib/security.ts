// API 安全防護工具
import { NextRequest, NextResponse } from 'next/server';

// Rate Limiting - 使用記憶體存儲（Vercel Edge 環境）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number;      // 時間窗口（毫秒）
  maxRequests: number;   // 最大請求數
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000,   // 1 分鐘
  maxRequests: 30,       // 每分鐘 30 次
};

export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = DEFAULT_CONFIG
): { success: boolean; remaining: number; resetTime: number } {
  const ip = getClientIP(request);
  const now = Date.now();
  const key = `${ip}:${request.nextUrl.pathname}`;
  
  let record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + config.windowMs };
    rateLimitStore.set(key, record);
  }
  
  record.count++;
  
  const remaining = Math.max(0, config.maxRequests - record.count);
  
  return {
    success: record.count <= config.maxRequests,
    remaining,
    resetTime: record.resetTime,
  };
}

// 清理過期記錄（防止記憶體洩漏）
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// 惡意 Bot 偵測
const MALICIOUS_BOTS = [
  'sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'dirbuster',
  'havij', 'w3af', 'acunetix', 'nessus', 'openvas', 'metasploit',
  'burpsuite', 'owasp', 'appscan', 'webinspect', 'qualys',
];

export function isMaliciousBot(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  return MALICIOUS_BOTS.some(bot => userAgent.includes(bot));
}

// Input Validation
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '')           // 移除 HTML 標籤
    .replace(/javascript:/gi, '')   // 移除 javascript: 協議
    .replace(/on\w+\s*=/gi, '')     // 移除事件處理器
    .replace(/data:\s*text/gi, '')  // 移除 data URI
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validateURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

// Request Size Limit
export function checkRequestSize(request: NextRequest, maxBytes: number = 1024 * 1024): boolean {
  const contentLength = request.headers.get('content-length');
  if (!contentLength) return true;
  return parseInt(contentLength, 10) <= maxBytes;
}

// Security Response Headers
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

// API Security Middleware
export function withSecurity(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    rateLimit?: RateLimitConfig;
    requireAuth?: boolean;
    allowedMethods?: string[];
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // 1. 檢查惡意 Bot
    if (isMaliciousBot(request)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // 2. 檢查請求方法
    if (options.allowedMethods && !options.allowedMethods.includes(request.method)) {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // 3. Rate Limiting
    if (options.rateLimit) {
      const { success, remaining, resetTime } = rateLimit(request, options.rateLimit);
      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': String(options.rateLimit.maxRequests),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(resetTime),
              'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
            },
          }
        );
      }
    }

    // 4. 檢查請求大小
    if (!checkRequestSize(request)) {
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413 }
      );
    }

    // 5. 執行原始 handler
    const response = await handler(request);

    // 6. 加入安全 headers
    return addSecurityHeaders(response);
  };
}
