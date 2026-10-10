// LINE Messaging API Integration
// Vercel Serverless Function

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_API_BASE = 'https://api.line.me/v2/bot';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Send message to LINE
    const response = await fetch(`${LINE_API_BASE}/message/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to: userId || 'U0000000000000000000000000000000', // Default admin user ID
        messages: [
          {
            type: 'text',
            text: `[網站諮詢] ${message}`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LINE API error:', error);
      return res.status(500).json({ error: 'Failed to send message to LINE' });
    }

    // Auto-reply with acknowledgment
    const autoReply = generateAutoReply(message);

    return res.status(200).json({
      success: true,
      reply: autoReply
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Generate intelligent auto-replies based on message content
function generateAutoReply(message) {
  const lowerMsg = message.toLowerCase();

  // Pricing inquiries
  if (lowerMsg.includes('價格') || lowerMsg.includes('費用') || lowerMsg.includes('多少') || lowerMsg.includes('pricing')) {
    return '感謝您的詢問！我們的方案從 NT$228,000 起跳。建議您預約免費顧問諮詢，我們將根據您的需求推薦最適合的方案。請加入 LINE 官方帳號 @559julyu 或直接致電聯繫我們。';
  }

  // Demo/consultation requests
  if (lowerMsg.includes('預約') || lowerMsg.includes('諮詢') || lowerMsg.includes('demo') || lowerMsg.includes('展示')) {
    return '好的！我們很樂意為您安排專屬導覽。請加入 LINE 官方帳號 @559julyu，我們的顧問會盡快與您聯繫安排時間。';
  }

  // Technology gallery
  if (lowerMsg.includes('科技') || lowerMsg.includes('藝廊') || lowerMsg.includes('gallery')) {
    return '歡迎參觀我們的科技藝廊！那裡展示了 12 件未來科技展品，每件都有詳細的技術說明與商業價值分析。您可以在主導航找到「科技藝廊」入口。';
  }

  // AI capabilities
  if (lowerMsg.includes('AI') || lowerMsg.includes('人工智慧') || lowerMsg.includes('能力')) {
    return 'Orbit Tower 整合六大 AI 協同能力：智慧分析、客戶接待、內容生成、知識管理、流程自動化、決策支援。想了解更多細節嗎？';
  }

  // Website building
  if (lowerMsg.includes('建站') || lowerMsg.includes('網站') || lowerMsg.includes('建置')) {
    return '我們提供三階段企業建站方案：Orbit Foundation（NT$228,000）、Orbit Growth（NT$498,000）、Orbit Enterprise（NT$1,080,000）。每個方案都包含 AI 驅動的智慧功能。';
  }

  // Domain rental
  if (lowerMsg.includes('網域') || lowerMsg.includes('分租') || lowerMsg.includes('domain')) {
    return '網域分租方案讓您快速獲得已建立權威的產業網域，包含 SEO 優化與 GEO 定位設定。這是進軍國際市場的捷徑。';
  }

  // 3D Tower
  if (lowerMsg.includes('3D') || lowerMsg.includes('大樓') || lowerMsg.includes('tower')) {
    return '我們的 3D 互動大樓有 8 個樓層，從 AI Core 到策略中心，每個樓層都對應特定的企業功能。點擊樓層可以查看詳細資訊和對應的科技展品。';
  }

  // LINE contact
  if (lowerMsg.includes('line') || lowerMsg.includes('聯絡') || lowerMsg.includes('contact')) {
    return '您可以加入我們的 LINE 官方帳號 @559julyu 進行即時諮詢，或掃描首頁的 QR Code。我們的顧問會盡快回覆您。';
  }

  // Greeting
  if (lowerMsg.includes('你好') || lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('嗨')) {
    return '您好！歡迎來到 Orbit Tower AI Digital Headquarters。我是您的 AI 助手，有什麼可以幫您的嗎？您可以詢問關於價格方案、科技藝廊、AI 能力等任何問題。';
  }

  // Default response
  return '感謝您的訊息！我們的顧問會盡快回覆您。如需即時協助，請加入 LINE 官方帳號 @559julyu，或瀏覽我們的價格方案與科技藝廊了解更多資訊。';
}
