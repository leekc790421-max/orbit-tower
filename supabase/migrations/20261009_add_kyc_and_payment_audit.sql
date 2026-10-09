-- Orbit Tower KYC & Payment Migration
-- 新增交易與實名制驗證欄位
-- Date: 2026-10-09

-- 1. 在 stores 資料表中擴充實名制與交易狀態欄位
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS tax_id TEXT,                    -- 公司統編/證件號
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending',  -- pending, awaiting_proof, verified, rejected
ADD COLUMN IF NOT EXISTS kyc_type TEXT DEFAULT 'domain',     -- domain, social, enterprise
ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'stripe', -- stripe, bank_wire, payoneer
ADD COLUMN IF NOT EXISTS verify_token TEXT,              -- 驗證 Token (orbit-verify-xxxxx)
ADD COLUMN IF NOT EXISTS is_floor_locked BOOLEAN DEFAULT FALSE, -- Gold 方案黃金樓層鎖定
ADD COLUMN IF NOT EXISTS widget_installed BOOLEAN DEFAULT FALSE, -- Widget 外鏈安裝狀態
ADD COLUMN IF NOT EXISTS traffic_multiplier NUMERIC(3,2) DEFAULT 1.00; -- 流量積分加成

-- 2. 建立交易與實名審核紀錄表
CREATE TABLE IF NOT EXISTS public.payment_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL,  -- 'bank_wire', 'payoneer', 'stripe'
    transaction_ref TEXT,          -- 匯款後五碼或 Payoneer 交易號
    proof_document_url TEXT,       -- 水單/憑證截圖 URL
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    reviewer_note TEXT,            -- 審核備註
    reviewed_by TEXT,              -- 審核者
    reviewed_at TIMESTAMPTZ,       -- 審核時間
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 建立 KYC 審核紀錄表
CREATE TABLE IF NOT EXISTS public.kyc_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    kyc_type TEXT NOT NULL,        -- domain, social, enterprise
    verify_token TEXT,             -- 驗證 Token
    domain_verified BOOLEAN DEFAULT FALSE,
    social_handle TEXT,
    social_platform TEXT,
    company_name TEXT,
    tax_id TEXT,
    document_url TEXT,
    ocr_result JSONB,              -- OCR 辨識結果
    status TEXT DEFAULT 'pending', -- pending, verified, rejected
    reviewer_note TEXT,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 建立索引
CREATE INDEX IF NOT EXISTS idx_payment_audit_store_id ON public.payment_audit_logs(store_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_status ON public.payment_audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_kyc_audit_store_id ON public.kyc_audit_logs(store_id);
CREATE INDEX IF NOT EXISTS idx_kyc_audit_status ON public.kyc_audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_stores_kyc_status ON public.stores(kyc_status);
CREATE INDEX IF NOT EXISTS idx_stores_verify_token ON public.stores(verify_token);

-- 5. 建立自動更新 updated_at 的觸發器
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_audit_updated_at ON public.payment_audit_logs;
CREATE TRIGGER update_payment_audit_updated_at
    BEFORE UPDATE ON public.payment_audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_kyc_audit_updated_at ON public.kyc_audit_logs;
CREATE TRIGGER update_kyc_audit_updated_at
    BEFORE UPDATE ON public.kyc_audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 6. RLS (Row Level Security) 策略
ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_audit_logs ENABLE ROW LEVEL SECURITY;

-- 允許 authenticated users 讀取自己的紀錄
CREATE POLICY "Users can view own payment logs"
    ON public.payment_audit_logs FOR SELECT
    USING (auth.uid()::TEXT = (SELECT owner_id FROM stores WHERE id = store_id));

CREATE POLICY "Users can view own kyc logs"
    ON public.kyc_audit_logs FOR SELECT
    USING (auth.uid()::TEXT = (SELECT owner_id FROM stores WHERE id = store_id));

-- 允許 service_role 完整存取
CREATE POLICY "Service role full access payment logs"
    ON public.payment_audit_logs FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access kyc logs"
    ON public.kyc_audit_logs FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');
