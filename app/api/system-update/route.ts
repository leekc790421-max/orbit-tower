import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

// 系統更新設定
const UPDATE_CONFIG = {
  // 自動更新間隔（毫秒）- 預設 30 天
  autoUpdateInterval: 30 * 24 * 60 * 60 * 1000,
  // 上次更新時間
  lastUpdateFile: path.join(process.cwd(), 'data', 'last-update.json'),
};

interface UpdateRecord {
  disclaimer: string;
  terms: string;
  privacy: string;
  lastAutoUpdate: string;
  updateCount: number;
}

// 確保 data 目錄存在
async function ensureDataDir() {
  const { mkdir } = await import('fs/promises');
  try {
    await mkdir(path.join(process.cwd(), 'data'), { recursive: true });
  } catch (error) {
    // 目錄已存在
  }
}

// 讀取更新記錄
async function getUpdateRecord(): Promise<UpdateRecord> {
  try {
    await ensureDataDir();
    const data = await readFile(UPDATE_CONFIG.lastUpdateFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    // 返回預設記錄
    return {
      disclaimer: '2026-10-09',
      terms: '2026-10-09',
      privacy: '2026-10-09',
      lastAutoUpdate: new Date().toISOString(),
      updateCount: 0,
    };
  }
}

// 儲存更新記錄
async function saveUpdateRecord(record: UpdateRecord) {
  await ensureDataDir();
  await writeFile(UPDATE_CONFIG.lastUpdateFile, JSON.stringify(record, null, 2));
}

// 檢查是否需要自動更新
function needsAutoUpdate(lastUpdate: string): boolean {
  const lastDate = new Date(lastUpdate).getTime();
  const now = Date.now();
  return (now - lastDate) >= UPDATE_CONFIG.autoUpdateInterval;
}

// 取得今天的日期字串
function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// GET - 取得更新狀態
export async function GET() {
  try {
    const record = await getUpdateRecord();
    const needsUpdate = needsAutoUpdate(record.lastAutoUpdate);
    
    return NextResponse.json({
      success: true,
      data: {
        ...record,
        needsAutoUpdate: needsUpdate,
        nextAutoUpdate: new Date(new Date(record.lastAutoUpdate).getTime() + UPDATE_CONFIG.autoUpdateInterval).toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get update status' },
      { status: 500 }
    );
  }
}

// POST - 觸發更新
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, force } = body;
    
    // 驗證類型
    const validTypes = ['disclaimer', 'terms', 'privacy', 'all'];
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    const record = await getUpdateRecord();
    const today = getTodayString();
    
    // 檢查是否需要更新
    if (!force) {
      if (type === 'all') {
        // 檢查是否所有都需要更新
        const allUpToDate = record.disclaimer === today && record.terms === today && record.privacy === today;
        if (allUpToDate) {
          return NextResponse.json({
            success: true,
            message: 'All documents are already up to date',
            data: record,
          });
        }
      } else if (type) {
        // 檢查特定類型是否已更新
        if (record[type as keyof UpdateRecord] === today) {
          return NextResponse.json({
            success: true,
            message: `${type} is already up to date`,
            data: record,
          });
        }
      }
    }
    
    // 執行更新
    if (type === 'all' || !type) {
      record.disclaimer = today;
      record.terms = today;
      record.privacy = today;
    } else {
      const key = type as 'disclaimer' | 'terms' | 'privacy';
      record[key] = today;
    }
    
    record.lastAutoUpdate = new Date().toISOString();
    record.updateCount += 1;
    
    await saveUpdateRecord(record);
    
    return NextResponse.json({
      success: true,
      message: 'Update completed successfully',
      data: record,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update' },
      { status: 500 }
    );
  }
}

// DELETE - 重置更新記錄（僅供管理員使用）
export async function DELETE(request: NextRequest) {
  try {
    // 這裡應該加入身份驗證檢查
    // 為簡單起見，暫時省略
    
    const defaultRecord: UpdateRecord = {
      disclaimer: '2026-10-09',
      terms: '2026-10-09',
      privacy: '2026-10-09',
      lastAutoUpdate: new Date().toISOString(),
      updateCount: 0,
    };
    
    await saveUpdateRecord(defaultRecord);
    
    return NextResponse.json({
      success: true,
      message: 'Update record reset successfully',
      data: defaultRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to reset' },
      { status: 500 }
    );
  }
}
