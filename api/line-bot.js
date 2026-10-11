// api/line-bot.js — LINE OA 自動推播 Webhook
// Vercel Serverless Function

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
  const LINE_CHANNEL_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!LINE_CHANNEL_TOKEN) {
    return res.status(500).json({ error: 'LINE token not configured' });
  }

  try {
    const events = req.body?.events || [];

    for (const event of events) {
      // 追蹤事件：新好友加入
      if (event.type === 'follow') {
        const userId = event.source.userId;
        await sendReply(LINE_CHANNEL_TOKEN, event.replyToken, {
          type: 'flex',
          altText: '歡迎加入 Orbit Tower！',
          contents: buildWelcomeFlex(userId)
        });
        // 記錄新好友到 CRM (可串接外部 API)
        await logNewFriend(userId);
      }

      // 文字訊息：AI 自動回覆
      if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text.toLowerCase();
        let reply = buildAutoReply(text);
        await sendReply(LINE_CHANNEL_TOKEN, event.replyToken, {
          type: 'text',
          text: reply
        });
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('LINE webhook error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// === LINE Messaging API ===
async function sendReply(token, replyToken, message) {
  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      replyToken,
      messages: [message]
    })
  });
}

async function sendPush(token, userId, message) {
  await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      to: userId,
      messages: [message]
    })
  });
}

// === Auto Reply Logic ===
function buildAutoReply(text) {
  if (text.includes('價格') || text.includes('方案') || text.includes('pricing')) {
    return '🏢 Orbit Tower 提供三階段建站方案：\n\n💎 Orbit Foundation — $6,800 起\n💎 Orbit Growth — $14,800 起\n💎 Orbit Enterprise — $32,000 起\n\n👉 查看完整方案：https://orbit.xingdeng.tw/pricing.html';
  }
  if (text.includes('3D') || text.includes('大樓') || text.includes('體驗')) {
    return '🏢 歡迎體驗 Orbit Tower 3D 互動數位企業總部！\n\n👉 立即探索：https://orbit.xingdeng.tw/tower.html\n\n8 大功能樓層、12 件科技展品、6 大 AI 協同能力，等您來發現！';
  }
  if (text.includes('推薦') || text.includes('優惠') || text.includes('referral')) {
    return '🎁 推薦裂變獎勵：\n\n✅ 推薦新企業進駐，您折抵 1 個月 MRR\n✅ 新租戶享 9 折優惠\n\n👉 取得專屬推薦碼：https://orbit.xingdeng.tw/marketing-hub.html';
  }
  if (text.includes('聯絡') || text.includes('客服') || text.includes('demo')) {
    return '📞 專屬顧問服務：\n\n📧 Email: contact@559julyu.ai\n🌐 官網: https://orbit.xingdeng.tw\n\n或點擊下方按鈕預約免費展示！';
  }
  return '您好！我是 Orbit Tower AI 樓管 🤖\n\n我可以為您提供：\n📊 價格方案資訊\n🏢 3D 大樓體驗\n🎁 推薦優惠\n📞 預約展示\n\n請輸入關鍵字，或撥打 contact@559julyu.ai 聯繫專屬顧問！';
}

// === Welcome Flex Message ===
function buildWelcomeFlex(userId) {
  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url: 'https://orbit.xingdeng.tw/assets/orbit-poster.png',
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover'
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: '歡迎加入 Orbit Tower！', weight: 'bold', size: 'xl' },
        { type: 'text', text: '您已成為 AI Digital Headquarters 的一員', size: 'sm', color: '#aaaaaa', margin: 'md' },
        { type: 'separator', margin: 'lg' },
        { type: 'text', text: '🎁 新好友專屬優惠', weight: 'bold', margin: 'lg' },
        { type: 'text', text: '立即體驗 3D 數位總部，享受首次 9 折優惠', size: 'sm', margin: 'sm' }
      ]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          style: 'primary',
          action: { type: 'uri', label: '探索 3D 大樓', uri: 'https://orbit.xingdeng.tw/tower.html' }
        },
        {
          type: 'button',
          style: 'secondary',
          action: { type: 'uri', label: '查看價格方案', uri: 'https://orbit.xingdeng.tw/pricing.html' }
        }
      ]
    }
  };
}

// === Log New Friend (CRM Stub) ===
async function logNewFriend(userId) {
  console.log(`[CRM] New LINE friend: ${userId} at ${new Date().toISOString()}`);
  // TODO: 串接外部 CRM API (HubSpot, Salesforce, etc.)
}
