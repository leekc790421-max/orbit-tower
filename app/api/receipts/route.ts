export const dynamic = 'force-dynamic';

/**
 * POST /api/receipts
 * 
 * 水單上傳 API
 * 
 * 安全機制：
 * 1. Rate Limiting (每分鐘 10 次)
 * 2. 檔案大小限制 (10MB)
 * 3. 檔案類型驗證 (僅允許圖片)
 * 4. 檔案簽名驗證 (防止偽裝)
 * 5. Input Validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit/rate-limiter';
import { validateImageFile, validateJsonInput } from '@/lib/validation/validator';

// Rate Limit: 每分鐘 10 次
const RATE_LIMIT_TYPE = 'receipts' as const;

// 最大檔案大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  // 1. Rate Limiting
  const rateLimitResult = withRateLimit(request, RATE_LIMIT_TYPE);
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }
  
  try {
    // 2. 解析 multipart/form-data
    const formData = await request.formData();
    
    // 3. 取得檔案
    const file = formData.get('file') as File | null;
    const claimId = formData.get('claim_id') as string | null;
    const paymentChannel = formData.get('payment_channel') as string | null;
    
    // 4. 驗證必填欄位
    if (!file) {
      return NextResponse.json(
        { error: '缺少檔案' },
        { status: 400 }
      );
    }
    
    if (!claimId) {
      return NextResponse.json(
        { error: '缺少 claim_id' },
        { status: 400 }
      );
    }
    
    if (!paymentChannel) {
      return NextResponse.json(
        { error: '缺少 payment_channel' },
        { status: 400 }
      );
    }
    
    // 5. 驗證檔案大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: '檔案大小超過限制',
          message: `最大檔案大小為 ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE,
        },
        { status: 413 } // Payload Too Large
      );
    }
    
    if (file.size === 0) {
      return NextResponse.json(
        { error: '檔案為空' },
        { status: 400 }
      );
    }
    
    // 6. 驗證檔案類型 (MIME)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          error: '不支援的檔案類型',
          message: '僅允許上傳圖片檔案 (JPEG, PNG, WebP, GIF)',
          fileType: file.type || 'unknown',
        },
        { status: 415 } // Unsupported Media Type
      );
    }
    
    // 7. 驗證檔案簽名 (防止偽裝副檔名)
    const signatureValidation = await validateFileSignature(file);
    if (!signatureValidation.valid) {
      return NextResponse.json(
        {
          error: '檔案驗證失敗',
          message: signatureValidation.error,
        },
        { status: 400 }
      );
    }
    
    // 8. 驗證 Payment Channel
    const validChannels = ['rakuten', 'bank_of_taiwan', 'payoneer'];
    if (!validChannels.includes(paymentChannel)) {
      return NextResponse.json(
        { error: '無效的付款通道' },
        { status: 400 }
      );
    }
    
    // 9. 上傳檔案 (模擬)
    // TODO: 實際上傳到 Supabase Storage 或 S3
    const uploadResult = await uploadReceipt(file, claimId);
    
    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error },
        { status: 500 }
      );
    }
    
    // 10. 建立 Receipt Record
    // TODO: 寫入資料庫
    
    // 11. 成功
    return NextResponse.json({
      success: true,
      data: {
        claim_id: claimId,
        file_url: uploadResult.url,
        file_size: file.size,
        file_type: file.type,
        uploaded_at: new Date().toISOString(),
      },
      message: '水單上傳成功，等待審核',
    });
    
  } catch (error: unknown) {
    console.error('Receipt upload error:', error);
    
    const errorMessage = error instanceof Error ? error.message : '';
    
    // FormData parse error
    if (errorMessage.includes('FormData') || errorMessage.includes('boundary')) {
      return NextResponse.json(
        { error: '請求格式錯誤，請使用 multipart/form-data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}

/**
 * 驗證檔案簽名 (Magic Numbers)
 */
async function validateFileSignature(file: File): Promise<{ valid: boolean; error?: string }> {
  try {
    const buffer = await file.arrayBuffer();
    const signature = Buffer.from(buffer.slice(0, 4)).toString('hex').toUpperCase();
    
    // 檔案簽名對照表
    const signatures: Record<string, string[]> = {
      'image/jpeg': ['FFD8FF'],
      'image/png': ['89504E47'],
      'image/webp': ['52494646'],
      'image/gif': ['47494638'],
    };
    
    const expectedSignatures = signatures[file.type.toLowerCase()];
    
    if (!expectedSignatures) {
      return { valid: false, error: '未知的檔案類型' };
    }
    
    const isValid = expectedSignatures.some(sig => signature.startsWith(sig));
    
    if (!isValid) {
      return {
        valid: false,
        error: '檔案內容與圖片格式不符 (可能是偽裝的惡意檔案)',
      };
    }
    
    return { valid: true };
    
  } catch {
    return { valid: false, error: '無法讀取檔案內容' };
  }
}

/**
 * 上傳水單 (模擬)
 */
async function uploadReceipt(
  file: File,
  claimId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  // TODO: 實際上傳到 Supabase Storage
  // const { data, error } = await supabase.storage
  //   .from('receipts')
  //   .upload(`${claimId}/${Date.now()}-${file.name}`, file);
  
  // 模擬上傳成功
  return {
    success: true,
    url: `https://storage.example.com/receipts/${claimId}/${file.name}`,
  };
}
