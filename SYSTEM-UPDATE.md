# 系統自動更新說明

## 功能概述

Orbit Tower 現在支援法律文件（免責聲明、服務條款、隱私權政策）的自動更新機制。

## 路由頁面

- `/disclaimer` - 免責聲明（13 章節）
- `/terms` - 服務條款（7 章節）
- `/privacy` - 隱私權政策（8 章節）

## 系統更新管理

### 管理介面

訪問 `/admin/updates` 可以：

1. 查看系統更新狀態
2. 查看各文件最後更新日期
3. 手動觸發個別文件更新
4. 手動觸發全部文件更新

### API 端點

#### GET `/api/system-update`

取得更新狀態。

**回應範例：**
```json
{
  "success": true,
  "data": {
    "disclaimer": "2026-10-09",
    "terms": "2026-10-09",
    "privacy": "2026-10-09",
    "lastAutoUpdate": "2026-10-09T12:00:00.000Z",
    "updateCount": 0,
    "needsAutoUpdate": false,
    "nextAutoUpdate": "2026-11-08T12:00:00.000Z"
  }
}
```

#### POST `/api/system-update`

觸發更新。

**請求內容：**
```json
{
  "type": "disclaimer|terms|privacy|all",
  "force": true|false
}
```

**參數說明：**
- `type`: 要更新的類型（disclaimer/terms/privacy/all）
- `force`: 是否強制更新（即使已是最新）

**回應範例：**
```json
{
  "success": true,
  "message": "Update completed successfully",
  "data": {
    "disclaimer": "2026-10-09",
    "terms": "2026-10-09",
    "privacy": "2026-10-09",
    "lastAutoUpdate": "2026-10-09T12:00:00.000Z",
    "updateCount": 1
  }
}
```

## 自動更新機制

### 更新間隔

系統預設每 30 天檢查一次是否需要更新。

### 檢查邏輯

1. 系統會記錄上次更新時間
2. 當距離上次更新超過 30 天時，標記為「需要更新」
3. 管理員可以手動觸發更新
4. 更新後，頁面上顯示的日期會自動更新為今天

### 設定 Cron Job（Vercel）

在 `vercel.json` 中加入：

```json
{
  "crons": [
    {
      "path": "/api/system-update",
      "schedule": "0 0 1 * *"
    }
  ]
}
```

這會在每月 1 號 00:00 自動檢查並更新。

**Cron 表達式說明：**
- `0 0 1 * *` = 每月 1 號 00:00
- `0 0 * * 0` = 每週日 00:00
- `0 0 1 1 *` = 每年 1 月 1 日 00:00

## 三語支援

所有頁面都支援中文、英文、日文三語切換。

## 資料儲存

更新記錄儲存在 `data/last-update.json`：

```json
{
  "disclaimer": "2026-10-09",
  "terms": "2026-10-09",
  "privacy": "2026-10-09",
  "lastAutoUpdate": "2026-10-09T12:00:00.000Z",
  "updateCount": 0
}
```

## 使用流程

### 手動更新

1. 訪問 `/admin/updates`
2. 點擊「立即更新」更新個別文件
3. 或點擊「全部更新」更新所有文件
4. 系統會自動更新頁面上顯示的日期

### 自動更新

1. 設定 Vercel Cron Job
2. 系統會定期檢查是否需要更新
3. 當需要更新時，可以在管理介面看到提示
4. 管理員可以手動確認並執行更新

## 注意事項

- 更新後，所有頁面的「最後更新日期」會自動更新
- 更新記錄會永久保存
- 建議定期檢查更新狀態
- 重要變更建議手動更新並通知用戶
