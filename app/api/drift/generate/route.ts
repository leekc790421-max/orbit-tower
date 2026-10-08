/**
 * POST /api/drift/generate
 * 
 * 漂流瓶生成 API
 * 
 * 安全機制：
 * 1. Rate Limiting (每分鐘 30 次)
 * 2. Input Validation
 * 3. Groq API 整合 (帶 Timeout)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit/rate-limiter';
import { validateJsonInput } from '@/lib/validation/validator';

// Rate Limit: 每分鐘 30 次
const RATE_LIMIT_TYPE = 'drift' as const;

// Groq API 設定
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = 'mixtral-8x7b-32768';
const GROQ_TIMEOUT = 10000; // 10 秒

export async function POST(request: NextRequest) {
  // 1. Rate Limiting
  const rateLimitResult = withRateLimit(request, RATE_LIMIT_TYPE);
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }
  
  try {
    // 2. 解析請求
    const body = await request.json();
    
    // 3. Input Validation
    const validation = validateJsonInput(body, {
      action: { type: 'string', required: true, maxLength: 20 },
      user_id: { type: 'string', required: true, maxLength: 100 },
      message: { type: 'string', required: false, maxLength: 500 },
      locale: { type: 'string', required: false, maxLength: 10 },
    });
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const data = validation.sanitized as Record<string, string>;
    
    // 4. 驗證 Action
    const validActions = ['throw', 'catch', 'generate'];
    if (!validActions.includes(data.action)) {
      return NextResponse.json(
        { error: '無效的動作' },
        { status: 400 }
      );
    }
    
    // 5. 生成漂流瓶內容
    const fortune = await generateFortune(data.action, data.message, data.locale);
    
    // 6. 成功
    return NextResponse.json({
      success: true,
      data: {
        action: data.action,
        fortune,
        timestamp: new Date().toISOString(),
      },
    });
    
  } catch (error: unknown) {
    console.error('Drift API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : '';
    
    // JSON parse error
    if (errorMessage.includes('JSON')) {
      return NextResponse.json(
        { error: '請求格式錯誤' },
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
 * 生成漂流瓶內容 (使用 Groq API)
 */
async function generateFortune(
  action: string,
  message?: string,
  locale: string = 'zh-TW'
): Promise<string> {
  // 如果沒有 Groq API Key，使用預設內容
  if (!GROQ_API_KEY) {
    return getDefaultFortune(action, locale);
  }
  
  try {
    // 呼叫 Groq API (帶 Timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GROQ_TIMEOUT);
    
    const prompt = buildPrompt(action, message, locale);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: '你是一個漂流瓶精靈，負責生成溫暖、正向的籤詩與祝福。回覆要簡短（50字以內），富有詩意。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }
    
    const data = await response.json();
    const fortune = data.choices?.[0]?.message?.content || '';
    
    return fortune.trim() || getDefaultFortune(action, locale);
    
  } catch (error) {
    console.error('Groq API error:', error);
    return getDefaultFortune(action, locale);
  }
}

/**
 * 建立 Prompt
 */
function buildPrompt(action: string, message?: string, locale: string = 'zh-TW'): string {
  const langMap: Record<string, string> = {
    'zh-TW': '繁體中文',
    'en': 'English',
    'ja': '日本語',
  };
  
  const lang = langMap[locale] || '繁體中文';
  
  if (action === 'throw' && message) {
    return `有人拋出了一個漂流瓶，內容是：「${message}」\n請用${lang}生成一個溫暖的回覆或祝福（50字以內）。`;
  }
  
  if (action === 'catch') {
    return `有人撿到了一個漂流瓶，請用${lang}生成一段神秘的籤詩或祝福（50字以內）。`;
  }
  
  return `請用${lang}生成一段溫暖的漂流瓶訊息或祝福（50字以內）。`;
}

/**
 * 預設籤詩 (當 Groq API 不可用時)
 */
function getDefaultFortune(action: string, locale: string): string {
  const fortunes: Record<string, string[]> = {
    'zh-TW': [
      '願你的每一天都充滿陽光與希望 🌞',
      '風会带来遠方的消息，請保持期待 🌊',
      '你的努力即將開花結果，繼續加油 🌸',
      '今天是一個適合開始的新日子 🌱',
      '願你找到內心的平靜與力量 🕊️',
    ],
    'en': [
      'May your day be filled with sunshine and hope 🌞',
      'The wind brings news from afar, stay期待 🌊',
      'Your efforts are about to bloom, keep going 🌸',
      'Today is a new day perfect for starting fresh 🌱',
      'May you find inner peace and strength 🕊️',
    ],
    'ja': [
      'あなたの毎日が陽気と希望に満ちていますように 🌞',
      '風が遠くからの知らせを運んでくれます 🌊',
      'あなたの努力が 곧 花咲くでしょう 🌸',
      '今日は新しい始まりに最適な日です 🌱',
      '心の平静と力を見つけられますように 🕊️',
    ],
  };
  
  const list = fortunes[locale] || fortunes['zh-TW'];
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * GET /api/drift/generate
 * 取得漂流瓶 (快取測試用)
 */
export async function GET(request: NextRequest) {
  const rateLimitResult = withRateLimit(request, RATE_LIMIT_TYPE);
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }
  
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const action = searchParams.get('action') || 'catch';
  
  if (!userId) {
    return NextResponse.json(
      { error: '缺少 user_id 參數' },
      { status: 400 }
    );
  }
  
  // 生成漂流瓶
  const fortune = await generateFortune(action, undefined, 'zh-TW');
  
  return NextResponse.json({
    success: true,
    data: {
      action,
      fortune,
      cached: true,
      timestamp: new Date().toISOString(),
    },
  });
}
