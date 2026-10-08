/**
 * 檔案與輸入驗證模組
 * 
 * 用於防止：
 * - 惡意檔案上傳
 * - 超大檔案攻擊
 * - 無效檔案類型
 * - SQL Injection / XSS
 */

// 允許的圖片 MIME 類型
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

// 允許的檔案大小 (bytes) — 供外部參考
export const FILE_SIZE_LIMITS = {
  receipt: 10 * 1024 * 1024,  // 10 MB (水單)
  avatar: 5 * 1024 * 1024,    // 5 MB (頭像)
  document: 20 * 1024 * 1024, // 20 MB (文件)
};

// 檔案簽名 (Magic Numbers)
const FILE_SIGNATURES: Record<string, string[]> = {
  jpeg: ['FFD8FF'],
  png: ['89504E47'],
  webp: ['52494646'],
  gif: ['47494638'],
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: unknown;
}

/**
 * 驗證圖片檔案
 */
export async function validateImageFile(
  file: File | Blob,
  maxSizeMB: number = 10
): Promise<ValidationResult> {
  // 1. 檢查檔案大小
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `檔案大小超過限制 (最大 ${maxSizeMB}MB)`,
    };
  }
  
  if (file.size === 0) {
    return {
      valid: false,
      error: '檔案為空',
    };
  }
  
  // 2. 檢查 MIME 類型
  const mimeType = file.type.toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `不支援的檔案類型: ${mimeType || 'unknown'}`,
    };
  }
  
  // 3. 驗證檔案簽名 (防止偽裝副檔名)
  try {
    const buffer = await file.arrayBuffer();
    const signature = Buffer.from(buffer.slice(0, 4)).toString('hex').toUpperCase();
    
    let validSignature = false;
    for (const type of Object.keys(FILE_SIGNATURES)) {
      const validSigs = FILE_SIGNATURES[type];
      if (validSigs.some(sig => signature.startsWith(sig))) {
        validSignature = true;
        break;
      }
    }
    
    if (!validSignature) {
      return {
        valid: false,
        error: '檔案內容與圖片格式不符 (可能是偽裝的惡意檔案)',
      };
    }
  } catch {
    return {
      valid: false,
      error: '無法讀取檔案內容',
    };
  }
  
  return { valid: true };
}

/**
 * 驗證 JSON 輸入 (防止 Injection)
 */
export function validateJsonInput(
  data: Record<string, unknown>,
  schema: Record<string, { type: string; required?: boolean; maxLength?: number }>
): ValidationResult {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];
    
    // 檢查必填欄位
    if (rules.required && (value === undefined || value === null || value === '')) {
      return {
        valid: false,
        error: `缺少必填欄位: ${key}`,
      };
    }
    
    // 如果欄位不存在且非必填，跳過
    if (value === undefined || value === null) {
      continue;
    }
    
    // 檢查類型
    if (typeof value !== rules.type) {
      return {
        valid: false,
        error: `欄位 ${key} 類型錯誤: 期望 ${rules.type}, 實際 ${typeof value}`,
      };
    }
    
    // 檢查長度 (字串)
    if (rules.type === 'string' && rules.maxLength) {
      const strValue = value as string;
      if (strValue.length > rules.maxLength) {
        return {
          valid: false,
          error: `欄位 ${key} 超過最大長度 ${rules.maxLength}`,
        };
      }
    }
    
    // 清理字串 (防止 XSS)
    if (rules.type === 'string') {
      sanitized[key] = sanitizeString(value as string);
    } else {
      sanitized[key] = value;
    }
  }
  
  return { valid: true, sanitized };
}

/**
 * 清理字串 (防止 XSS)
 */
function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // 移除 HTML 標籤
    .replace(/javascript:/gi, '') // 移除 javascript: 協議
    .trim();
}

/**
 * 驗證 Email 格式
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email 為空' };
  }
  
  if (email.length > 255) {
    return { valid: false, error: 'Email 過長' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email 格式錯誤' };
  }
  
  return { valid: true, sanitized: email.toLowerCase().trim() };
}

/**
 * 驗證 URL 格式
 */
export function validateUrl(url: string): ValidationResult {
  try {
    const parsed = new URL(url);
    
    // 只允許 http 和 https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: '不支援的 URL 協議' };
    }
    
    // 防止本地網址 (SSRF)
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local')
    ) {
      return { valid: false, error: '不允許的內部網址' };
    }
    
    return { valid: true, sanitized: url };
  } catch {
    return { valid: false, error: 'URL 格式錯誤' };
  }
}

/**
 * 驗證 Slug (網址路徑)
 */
export function validateSlug(slug: string): ValidationResult {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  
  if (!slug || typeof slug !== 'string') {
    return { valid: false, error: 'Slug 為空' };
  }
  
  if (slug.length > 100) {
    return { valid: false, error: 'Slug 過長 (最大 100 字元)' };
  }
  
  if (!slugRegex.test(slug)) {
    return {
      valid: false,
      error: 'Slug 只能包含小寫字母、數字和連字號',
    };
  }
  
  return { valid: true, sanitized: slug.toLowerCase() };
}

/**
 * 驗證台灣統一編號
 */
export function validateTaxId(taxId: string): ValidationResult {
  if (!taxId || typeof taxId !== 'string') {
    return { valid: false, error: '統一編號為空' };
  }
  
  // 移除空白和連字號
  const cleaned = taxId.replace(/[\s-]/g, '');
  
  // 檢查長度
  if (cleaned.length !== 8) {
    return { valid: false, error: '統一編號必須為 8 碼' };
  }
  
  // 檢查是否為數字
  if (!/^\d{8}$/.test(cleaned)) {
    return { valid: false, error: '統一編號只能包含數字' };
  }
  
  return { valid: true, sanitized: cleaned };
}
