-- ============================================================================
-- Orbit Tower — Supabase Database Functions & RLS Policies
-- 
-- 功能：
-- 1. claim_store() — 原子性認領店面 (防止 Race Condition)
-- 2. RLS Policies — Row-Level Security
-- 3. Indexes — 效能優化
-- ============================================================================

-- ============================================================================
-- 1. 原子性認領函式 (使用 SELECT FOR UPDATE)
-- ============================================================================

CREATE OR REPLACE FUNCTION claim_store(
  p_store_id UUID,
  p_brand_name TEXT,
  p_email TEXT,
  p_plan TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- 以擁有者權限執行 (繞過 RLS)
AS $$
DECLARE
  v_store RECORD;
  v_result JSON;
BEGIN
  -- 開始 Transaction (自動)
  
  -- 1. 鎖定並檢查 Store (SELECT FOR UPDATE 防止 Race Condition)
  SELECT * INTO v_store
  FROM stores
  WHERE id = p_store_id
  FOR UPDATE; -- 鎖定這行，防止其他 Transaction 修改
  
  -- 2. 檢查 Store 是否存在且未被認領
  IF v_store IS NULL THEN
    v_result := json_build_object(
      'success', false,
      'error', '店面不存在'
    );
    RETURN v_result;
  END IF;
  
  IF v_store.is_claimed = true THEN
    v_result := json_build_object(
      'success', false,
      'error', '認領衝突',
      'message', '此店面已被其他使用者認領，請選擇其他店面',
      'conflict', true
    );
    RETURN v_result;
  END IF;
  
  -- 3. 更新 Store 狀態 (原子性)
  UPDATE stores
  SET
    is_claimed = true,
    brand_name = p_brand_name,
    owner_email = p_email,
    plan = p_plan,
    claimed_at = NOW(),
    updated_at = NOW(),
    version = version + 1 -- Optimistic Locking
  WHERE id = p_store_id;
  
  -- 4. 建立 Claim Record
  INSERT INTO claims (
    store_id,
    brand_name,
    email,
    plan,
    status,
    created_at
  ) VALUES (
    p_store_id,
    p_brand_name,
    p_email,
    p_plan,
    'pending',
    NOW()
  );
  
  -- 5. 回傳成功
  v_result := json_build_object(
    'success', true,
    'claim_id', p_store_id,
    'message', '認領成功'
  );
  
  RETURN v_result;
  
  -- Transaction 自動 Commit (如果沒有錯誤)
  -- 如果有錯誤，自動 Rollback
  
EXCEPTION
  WHEN OTHERS THEN
    -- 發生錯誤，回傳錯誤訊息
    v_result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN v_result;
END;
$$;

-- ============================================================================
-- 2. Row-Level Security (RLS) Policies
-- ============================================================================

-- 啟用 RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Stores: 所有人可以讀取，只有擁有者可以更新
CREATE POLICY "stores_select_all"
  ON stores FOR SELECT
  USING (true);

CREATE POLICY "stores_update_owner"
  ON stores FOR UPDATE
  USING (auth.uid()::text = owner_email);

-- Claims: 只有擁有者可以讀取和更新
CREATE POLICY "claims_select_owner"
  ON claims FOR SELECT
  USING (auth.uid()::text = email);

CREATE POLICY "claims_insert_authenticated"
  ON claims FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "claims_update_owner"
  ON claims FOR UPDATE
  USING (auth.uid()::text = email);

-- Payments: 只有擁有者可以讀取
CREATE POLICY "payments_select_owner"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM claims
      WHERE claims.id = payments.claim_id
      AND claims.email = auth.uid()::text
    )
  );

CREATE POLICY "payments_insert_authenticated"
  ON payments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Receipts: 只有擁有者可以讀取和上傳
CREATE POLICY "receipts_select_owner"
  ON receipts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM claims
      WHERE claims.id = receipts.claim_id
      AND claims.email = auth.uid()::text
    )
  );

CREATE POLICY "receipts_insert_owner"
  ON receipts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM claims
      WHERE claims.id = receipts.claim_id
      AND claims.email = auth.uid()::text
    )
  );

-- ============================================================================
-- 3. Indexes (效能優化)
-- ============================================================================

-- Stores
CREATE INDEX IF NOT EXISTS idx_stores_is_claimed ON stores(is_claimed);
CREATE INDEX IF NOT EXISTS idx_stores_owner_email ON stores(owner_email);
CREATE INDEX IF NOT EXISTS idx_stores_plan ON stores(plan);

-- Claims
CREATE INDEX IF NOT EXISTS idx_claims_store_id ON claims(store_id);
CREATE INDEX IF NOT EXISTS idx_claims_email ON claims(email);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON claims(created_at);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_claim_id ON payments(claim_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Receipts
CREATE INDEX IF NOT EXISTS idx_receipts_claim_id ON receipts(claim_id);
CREATE INDEX IF NOT EXISTS idx_receipts_uploaded_at ON receipts(uploaded_at);

-- ============================================================================
-- 4. 資料表結構 (如果尚未建立)
-- ============================================================================

-- Stores 表
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor INTEGER NOT NULL,
  face TEXT NOT NULL CHECK (face IN ('A', 'B', 'C', 'D', 'E', 'F')),
  is_claimed BOOLEAN DEFAULT false,
  brand_name TEXT,
  owner_email TEXT,
  plan TEXT CHECK (plan IN ('landing', 'growth', 'scale')),
  slug TEXT UNIQUE,
  claimed_at TIMESTAMPTZ,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claims 表
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  brand_name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments 表
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_channel TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Receipts 表
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id),
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ============================================================================
-- 5. 觸發器 (自動更新 updated_at)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. 測試資料 (可選)
-- ============================================================================

-- 插入測試店面 (6 層 x 6 面 = 36 個店面)
-- INSERT INTO stores (floor, face) VALUES
-- (1, 'A'), (1, 'B'), (1, 'C'), (1, 'D'), (1, 'E'), (1, 'F'),
-- (2, 'A'), (2, 'B'), (2, 'C'), (2, 'D'), (2, 'E'), (2, 'F'),
-- ... (省略，實際使用時再插入)
-- ;
