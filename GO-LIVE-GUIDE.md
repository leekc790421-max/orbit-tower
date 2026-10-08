# SNT 光躍星樞 (Orbit Tower) — 上線設定指南

## 🚀 快速設定步驟

### 1️⃣ Supabase 資料庫設定

#### A. 建立 Supabase 專案
1. 前往 https://supabase.com
2. 點擊 "New Project"
3. 填寫專案名稱：`orbit-tower`
4. 設定資料庫密碼（記下來）
5. 選擇區域：`Northeast Asia (Tokyo)` 或離你最近的區域
6. 等待專案建立完成（約 2 分鐘）

#### B. 執行資料庫遷移
1. 在 Supabase Dashboard 左側選單點擊 "SQL Editor"
2. 點擊 "New Query"
3. 複製 `supabase/migrations/001_security_functions.sql` 的完整內容
4. 貼上到 SQL Editor
5. 點擊 "Run" 執行

**這個腳本會建立：**
- ✅ 5 個資料表：`stores`, `claims`, `payments`, `receipts`, `audit_logs`
- ✅ 1 個原子性認領函式：`claim_store()`
- ✅ Row-Level Security (RLS) 政策
- ✅ 效能優化索引
- ✅ 自動更新 `updated_at` 觸發器

#### C. 初始化 36 個店面
執行以下 SQL 插入 6 層 x 6 面 = 36 個店面：

```sql
INSERT INTO stores (floor, face) VALUES
(1, 'A'), (1, 'B'), (1, 'C'), (1, 'D'), (1, 'E'), (1, 'F'),
(2, 'A'), (2, 'B'), (2, 'C'), (2, 'D'), (2, 'E'), (2, 'F'),
(3, 'A'), (3, 'B'), (3, 'C'), (3, 'D'), (3, 'E'), (3, 'F'),
(4, 'A'), (4, 'B'), (4, 'C'), (4, 'D'), (4, 'E'), (4, 'F'),
(5, 'A'), (5, 'B'), (5, 'C'), (5, 'D'), (5, 'E'), (5, 'F'),
(6, 'A'), (6, 'B'), (6, 'C'), (6, 'D'), (6, 'E'), (6, 'F');
```

#### D. 取得 API Keys
1. 在 Supabase Dashboard 左側選單點擊 "Settings" → "API"
2. 複製以下三個值：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...` (很長的字串)
   - **service_role key**: `eyJhbGci...` (另一個很長的字串，標記為 secret)

---

### 2️⃣ Groq API Key 設定

1. 前往 https://console.groq.com
2. 註冊/登入帳號
3. 點擊 "API Keys" → "Create API Key"
4. 複製 API Key（格式：`gsk_xxxxx`）

**Groq 免費額度：** 每分鐘 30 次請求，足夠初期營運使用。

---

### 3️⃣ Vercel 環境變數設定

#### 方法 A：使用 Vercel CLI（推薦）

執行以下指令（替換為你的真實值）：

```bash
cd orbit-tower

# Supabase 設定
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 貼上：https://xxxxx.supabase.co

npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 貼上：eyJhbGci...

npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
# 貼上：eyJhbGci... (service_role key)

# Groq API
npx vercel env add GROQ_API_KEY production
# 貼上：gsk_xxxxx

# 管理員密鑰（自訂一個強密碼）
npx vercel env add ADMIN_SECRET production
# 貼上：your-super-secret-admin-key-change-this

# 網站 URL
npx vercel env add NEXT_PUBLIC_SITE_URL production
# 貼上：https://orbit-tower.vercel.app

# IndexNow
npx vercel env add INDEXNOW_KEY production
# 貼上：orbit-tower-indexnow-key-2026

# 金流設定（可選）
npx vercel env add BANK_OF_TAIWAN_BRANCH production
# 貼上：松山分行

npx vercel env add BANK_OF_TAIWAN_SWIFT production
# 貼上：BKTWTWTP

npx vercel env add BANK_OF_TAIWAN_CODE production
# 貼上：0040646

npx vercel env add BANK_OF_TAIWAN_ACCOUNT production
# 貼上：004-064004306448

npx vercel env add RAKUTEN_BANK_CODE production
# 貼上：826

npx vercel env add RAKUTEN_BANK_ACCOUNT production
# 貼上：81201001535981

npx vercel env add PAYONEER_URL production
# 貼上：https://link.payoneer.com/Token?t=YOUR-TOKEN-HERE
```

#### 方法 B：使用 Vercel Dashboard

1. 前往 https://vercel.com/xfls/orbit-tower/settings/environment-variables
2. 逐一新增上述環境變數
3. 選擇環境：`Production`

---

### 4️⃣ 重新部署

設定完環境變數後，重新部署：

```bash
cd orbit-tower
npx vercel deploy --prod --token "YOUR_VERCEL_TOKEN"
```

或直接在 Vercel Dashboard 點擊 "Redeploy"。

---

### 5️⃣ 測試管理後台

1. 訪問 https://orbit-tower.vercel.app/admin
2. 輸入你設定的 `ADMIN_SECRET`
3. 應該能看到管理員控制台（統計卡片、審核列表）

---

### 6️⃣ 完整功能測試清單

#### ✅ 訪客體驗
- [ ] 首頁 3D 大樓正常渲染
- [ ] 可以拖曳旋轉大樓
- [ ] 點擊樓層指示器可以聚焦
- [ ] 點擊空置戶別（藍色）顯示認領資訊
- [ ] 點擊已進駐戶別顯示品牌資訊
- [ ] FAQ 按鈕可以展開/收合
- [ ] AI 樓管可以對話
- [ ] 語言切換（中/英/日）正常

#### ✅ 認領流程
- [ ] 點擊「認領店面」開啟定價表
- [ ] 選擇方案後顯示金流資訊
- [ ] 銀行電匯資訊可以複製
- [ ] Payoneer 連結可以跳轉

#### ✅ API 端點
- [ ] `GET /api/stores` — 回傳店面列表
- [ ] `POST /api/checkout` — 認領店面
- [ ] `POST /api/drift/generate` — 生成漂流瓶
- [ ] `POST /api/receipts` — 上傳水單
- [ ] `POST /api/referral` — 生成推薦碼
- [ ] `POST /api/audit-release` — 管理員審核

#### ✅ 管理後台
- [ ] `/admin` 可以訪問
- [ ] 輸入 ADMIN_SECRET 可以登入
- [ ] 可以看到待審核列表
- [ ] 可以點擊「核准」或「拒絕」
- [ ] 統計卡片顯示正確數據

#### ✅ SEO & 搜尋引擎
- [ ] `robots.txt` 正常
- [ ] `sitemap.xml` 正常
- [ ] IndexNow 驗證檔存在
- [ ] Schema.org JSON-LD 正確
- [ ] Open Graph tags 正確

---

### 7️⃣ 上線後營運步驟

#### 立即執行
1. **提交 IndexNow**（已完成 ✅）
   ```bash
   curl -X POST https://orbit-tower.vercel.app/api/indexnow/submit \
     -H "Content-Type: application/json" \
     -d '{"urls":["https://orbit-tower.vercel.app/"],"type":"URLAdded"}'
   ```

2. **發布聲明**
   - LinkedIn: 「SNT 光躍星樞正式上線 — 3D Cyber Luxury 虛擬地產平台」
   - 附上 3D 展廳連結 + /drift 漂流瓶體驗

3. **啟動獵客引擎**
   - 生成目標品牌的 3D 影子展廳 Demo
   - 主動寄出認領邀請

#### 日常營運
1. **後台坐等收錢**
   - 收到匯款通知 → 登入 `/admin`
   - 檢查水單 → 點擊「一鍵放行」
   - 系統自動開通黃金樓層 + 產生 AI 廣告

2. **監控數據**
   - 查看認領數量
   - 追蹤營收
   - 分析轉換率

3. **內容更新**
   - 定期更新漂流瓶籤詩庫
   - 新增品牌案例
   - 優化 FAQ

---

## 🔧 疑難排解

### 問題 1：Stores API 回傳「查詢失敗」
**原因：** Supabase 環境變數未設定或錯誤  
**解決：** 檢查 Vercel 環境變數是否正確設定，並重新部署

### 問題 2：管理後台無法登入
**原因：** ADMIN_SECRET 未設定或輸入錯誤  
**解決：** 確認 Vercel 環境變數 `ADMIN_SECRET` 已設定，並使用正確的密鑰

### 問題 3：漂流瓶 API 回傳預設籤詩
**原因：** GROQ_API_KEY 未設定  
**解決：** 設定 Groq API Key 後重新部署

### 問題 4：3D 大樓渲染緩慢
**原因：** 手機效能不足  
**解決：** 降低 `dpr` 設定或減少粒子數量（需修改程式碼）

---

## 📞 技術支援

如有問題，請檢查：
1. Vercel Deployment Logs: https://vercel.com/xfls/orbit-tower/deployments
2. Supabase Logs: https://supabase.com/dashboard/project/xxxxx/logs
3. Groq API Usage: https://console.groq.com/usage

---

## ✅ 最終檢查清單

- [ ] Supabase 專案已建立
- [ ] 資料庫遷移已執行
- [ ] 36 個店面已初始化
- [ ] Vercel 環境變數已設定（至少 6 個必填）
- [ ] 網站已重新部署
- [ ] 管理後台可以登入
- [ ] 所有 API 端點正常運作
- [ ] IndexNow 已提交
- [ ] 社群發布聲明已發布

**恭喜！SNT 光躍星樞正式上線營運！** 🎉
