# Orbit Tower — 安全與邊界例外測試指南

## 📋 目錄

- [概述](#概述)
- [安全機制](#安全機制)
- [測試項目](#測試項目)
- [快速開始](#快速開始)
- [測試場景說明](#測試場景說明)
- [API 安全規格](#api-安全規格)
- [資料庫安全](#資料庫安全)
- [疑難排解](#疑難排解)

---

## 概述

本指南說明 Orbit Tower 的安全防護機制，以及如何執行安全測試來驗證這些機制。

**三大安全防護：**
1. **Race Condition 防護** — 防止多重認領衝突
2. **Rate Limiting** — 防止 API 濫用與爬蟲攻擊
3. **File Validation** — 防止惡意檔案上傳

---

## 安全機制

### 1. Race Condition 防護 (多重認領衝突)

**問題：** 兩名使用者同時點擊認領同一間店面

**解決方案：**
- 使用 Supabase Database Function 實作原子性 Transaction
- `SELECT ... FOR UPDATE` 鎖定資料列
- Optimistic Locking (version 欄位)
- 衝突時回傳 HTTP 409 Conflict

**程式碼位置：**
- `lib/supabase/client.ts` — Transaction 處理
- `app/api/checkout/route.ts` — 認領 API
- `supabase/migrations/001_security_functions.sql` — Database Function

### 2. Rate Limiting (API 濫用防護)

**問題：** 惡意爬蟲快速請求 API

**解決方案：**
- Memory-based Rate Limiter (可替換為 Redis)
- IP-based 限制
- 各 API 獨立配額：
  - `/api/drift/generate` — 每分鐘 30 次
  - `/api/checkout` — 每分鐘 5 次
  - `/api/receipts` — 每分鐘 10 次
- 超過限制回傳 HTTP 429 Too Many Requests
- 包含 `Retry-After` 和 `X-RateLimit-*` Headers

**程式碼位置：**
- `lib/rate-limit/rate-limiter.ts` — Rate Limiter 實作
- 各 API Route 中使用 `withRateLimit()` 函式

### 3. File Validation (水單上傳防護)

**問題：** 上傳惡意檔案、超大檔案、偽裝副檔名

**解決方案：**
- 檔案大小限制 (10MB)
- MIME 類型驗證 (僅允許 JPEG, PNG, WebP, GIF)
- 檔案簽名驗證 (Magic Numbers)
- 防止偽裝副檔名 (實際內容與副檔名不符)
- 前端 + 後端雙重驗證

**程式碼位置：**
- `lib/validation/validator.ts` — 檔案驗證
- `app/api/receipts/route.ts` — 水單上傳 API

---

## 測試項目

### 場景 1: Race Condition 測試

**目標：** 驗證多重認領衝突防護

**測試方法：**
- 10 個 VUs 同時嘗試認領同一個店面
- 每個 VU 執行 5 次迭代
- 預期結果：只有 1 個成功，其餘回傳 409 Conflict

**通過標準：**
- ✅ 檢測到至少 1 次衝突 (HTTP 409)
- ✅ 衝突訊息正確
- ✅ 無 HTTP 5xx 錯誤

### 場景 2: Rate Limiting 測試

**目標：** 驗證 API 濫用防護

**測試方法：**
- 每秒 50 個請求持續 30 秒
- 針對 `/api/drift/generate`, `/api/checkout`, `/api/receipts`
- 預期結果：觸發 HTTP 429 Too Many Requests

**通過標準：**
- ✅ 檢測到至少 1 次 Rate Limit (HTTP 429)
- ✅ 包含 `Retry-After` Header
- ✅ 包含 `X-RateLimit-*` Headers
- ✅ 無 HTTP 5xx 錯誤

### 場景 3: File Validation 測試

**目標：** 驗證惡意檔案上傳防護

**測試方法：**
- 上傳超大檔案 (50MB)
- 上傳無效類型 (PDF)
- 上傳偽裝副檔名 (文字檔改副檔名為 .jpg)
- 上傳空檔案
- 缺少必要欄位

**通過標準：**
- ✅ 超大檔案被拒絕 (HTTP 413)
- ✅ 無效類型被拒絕 (HTTP 415)
- ✅ 偽裝檔案被拒絕 (HTTP 400)
- ✅ 空檔案被拒絕 (HTTP 400)
- ✅ 缺少欄位被拒絕 (HTTP 400)
- ✅ 無 HTTP 5xx 錯誤

---

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

```bash
cp .env.example .env.local
# 編輯 .env.local 填入實際值
```

### 3. 執行資料庫遷移

```bash
# 使用 Supabase CLI
supabase db push

# 或手動執行 SQL
# 將 supabase/migrations/001_security_functions.sql 的內容
# 貼到 Supabase Dashboard → SQL Editor
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

### 5. 執行安全測試

```bash
# 執行完整安全測試
npm run test:security

# 對 Production 執行
npm run test:security:prod
```

---

## 測試場景說明

### 執行安全測試

```bash
npm run test:security
```

**測試流程：**
1. **場景 1 (0:00 - 1:00)** — Race Condition 測試
   - 10 VUs × 5 iterations = 50 次認領請求
   - 所有請求針對同一個店面
   
2. **場景 2 (1:10 - 1:40)** — Rate Limiting 測試
   - 每秒 50 個請求
   - 持續 30 秒
   - 針對 3 個 API 端點
   
3. **場景 3 (1:50 - 2:50)** — File Validation 測試
   - 5 VUs × 10 iterations = 50 次上傳請求
   - 測試各種惡意檔案

**預期輸出：**

```
═══════════════════════════════════════════════════════════
  Orbit Tower — 安全測試報告摘要
═══════════════════════════════════════════════════════════

  🛡️  安全防護檢測
     Race Condition 檢測  : 9 次
     Rate Limit 觸發      : 150 次
     File Validation 阻擋 : 45 次

  🎯 安全防護狀態
     ✅ Race Condition 防護  : 正常
     ✅ Rate Limiting 防護   : 正常
     ✅ File Validation 防護 : 正常

  🎉 ALL SECURITY CHECKS PASSED
═══════════════════════════════════════════════════════════
```

---

## API 安全規格

### POST /api/checkout

**Rate Limit:** 每分鐘 5 次

**請求格式：**
```json
{
  "store_id": "uuid",
  "brand_name": "string (max 200)",
  "slug": "string (max 100, lowercase, hyphens)",
  "email": "string (valid email)",
  "tax_id": "string (8 digits, optional)",
  "plan": "landing | growth | scale",
  "payment_channel": "rakuten | bank_of_taiwan | payoneer"
}
```

**回應：**
- `201 Created` — 認領成功
- `400 Bad Request` — 輸入驗證失敗
- `409 Conflict` — 認領衝突 (已被其他人認領)
- `429 Too Many Requests` — Rate Limit
- `500 Internal Server Error` — 伺服器錯誤

### POST /api/drift/generate

**Rate Limit:** 每分鐘 30 次

**請求格式：**
```json
{
  "action": "throw | catch | generate",
  "user_id": "string (max 100)",
  "message": "string (max 500, optional)",
  "locale": "zh-TW | en | ja"
}
```

**回應：**
- `200 OK` — 成功
- `400 Bad Request` — 輸入驗證失敗
- `429 Too Many Requests` — Rate Limit
- `500 Internal Server Error` — 伺服器錯誤

### POST /api/receipts

**Rate Limit:** 每分鐘 10 次

**請求格式：** `multipart/form-data`
- `file` — 圖片檔案 (JPEG, PNG, WebP, GIF, max 10MB)
- `claim_id` — 認領 ID
- `payment_channel` — 付款通道

**回應：**
- `200 OK` — 上傳成功
- `400 Bad Request` — 檔案驗證失敗
- `413 Payload Too Large` — 檔案過大
- `415 Unsupported Media Type` — 不支援的檔案類型
- `429 Too Many Requests` — Rate Limit
- `500 Internal Server Error` — 伺服器錯誤

---

## 資料庫安全

### Row-Level Security (RLS)

所有資料表都啟用了 RLS：

- **stores** — 所有人可以讀取，只有擁有者可以更新
- **claims** — 只有擁有者可以讀取和更新
- **payments** — 只有擁有者可以讀取
- **receipts** — 只有擁有者可以讀取和上傳

### Atomic Transaction

`claim_store()` Database Function 使用：
- `SELECT ... FOR UPDATE` — 鎖定資料列
- Transaction 自動 Commit/Rollback
- 衝突時回傳 JSON 錯誤訊息

### Optimistic Locking

`stores` 表包含 `version` 欄位：
- 每次更新時 `version + 1`
- 更新時檢查 `version` 是否匹配
- 防止 Concurrent Update

---

## 疑難排解

### 問題 1: 測試未檢測到 Race Condition

**可能原因：**
- 資料庫尚未建立 `claim_store()` Function
- 測試的店面已被認領

**解決：**
```bash
# 1. 確認 Database Function 已建立
# 在 Supabase Dashboard → Database → Functions 檢查

# 2. 重置測試店面
UPDATE stores SET is_claimed = false WHERE id = 'test-store-race-condition';
```

### 問題 2: Rate Limit 未觸發

**可能原因：**
- Rate Limiter 使用 Memory Store，重啟後會重置
- 請求速度不夠快

**解決：**
```bash
# 增加請求速度
k6 run --env K6_DURATION=10s tests/security-test.js
```

### 問題 3: File Validation 未阻擋

**可能原因：**
- 檔案驗證邏輯有誤
- 測試檔案不符合預期

**解決：**
```bash
# 檢查 API 回應
curl -X POST http://localhost:3000/api/receipts \
  -F "file=@test.pdf" \
  -F "claim_id=test" \
  -F "payment_channel=rakuten" \
  -v
```

### 問題 4: 資料庫遷移失敗

**解決：**
```bash
# 手動執行 SQL
# 1. 開啟 Supabase Dashboard → SQL Editor
# 2. 貼上 supabase/migrations/001_security_functions.sql 的內容
# 3. 點擊 Run
```

---

## 參考資源

- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL SELECT FOR UPDATE](https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE)
- [k6 文件](https://k6.io/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**最後更新：** 2026-10-06  
**維護者：** SNT Nexus Team  
**版本：** v1.0.0
