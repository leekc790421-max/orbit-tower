/**
 * Rate Limiter - 防止 API 濫用
 * 
 * 使用 Memory Cache (可替換為 Redis)
 * 支援 IP-based 和 User-based 限制
 */

interface RateLimitConfig {
  windowMs: number;      // 時間窗口 (毫秒)
  maxRequests: number;   // 最大請求數
  message: string;       // 超過限制時的訊息
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Memory store (生產環境建議使用 Redis)
const store = new Map<string, RateLimitEntry>();

// 預設配置
const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  // 漂流瓶 API: 每分鐘 30 次
  drift: {
    windowMs: 60 * 1000,
    maxRequests: 30,
    message: '漂流瓶 API 請求過於頻繁，請稍後再試',
  },
  // 認領 API: 每分鐘 5 次
  checkout: {
    windowMs: 60 * 1000,
    maxRequests: 5,
    message: '認領請求過於頻繁，請稍後再試',
  },
  // 水單上傳: 每分鐘 10 次
  receipts: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    message: '水單上傳過於頻繁，請稍後再試',
  },
  // 全域: 每分鐘 100 次
  global: {
    windowMs: 60 * 1000,
    maxRequests: 100,
    message: '請求過於頻繁，請稍後再試',
  },
};

/**
 * 取得客戶端 IP
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * 檢查 Rate Limit
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIGS.global
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = store.get(key);
  
  // 如果不存在或已過期，建立新記錄
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowMs;
    store.set(key, { count: 1, resetTime });
    
    // 清理過期記錄 (防止記憶體洩漏)
    cleanupExpired();
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }
  
  // 檢查是否超過限制
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  
  // 增加計數
  entry.count += 1;
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * 套用 Rate Limit 到 API Route
 */
export function withRateLimit(
  request: Request,
  limitType: keyof typeof DEFAULT_CONFIGS = 'global'
): { allowed: boolean; response?: Response } {
  const config = DEFAULT_CONFIGS[limitType];
  const ip = getClientIp(request);
  const key = `${limitType}:${ip}`;
  
  const result = checkRateLimit(key, config);
  
  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    
    const response = Response.json(
      {
        error: config.message,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(config.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.resetTime),
        },
      }
    );
    
    return { allowed: false, response };
  }
  
  // 成功時也回傳 rate limit headers
  return { allowed: true };
}

/**
 * 清理過期記錄
 */
function cleanupExpired() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}

/**
 * 手動重置 Rate Limit (用於測試)
 */
export function resetRateLimit(key?: string) {
  if (key) {
    store.delete(key);
  } else {
    store.clear();
  }
}

/**
 * 取得 Rate Limit 狀態 (用於監控)
 */
export function getRateLimitStats() {
  return {
    totalKeys: store.size,
    entries: Array.from(store.entries()).map(([key, entry]) => ({
      key,
      count: entry.count,
      resetIn: Math.max(0, entry.resetTime - Date.now()),
    })),
  };
}
