-- Orbit Tower 核心資料庫結構
-- 1. 核心店家資料表 (Stores Table)
create table if not exists public.stores (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    name text not null,
    claim_token uuid default gen_random_uuid(),
    is_claimed boolean default false,
    owner_email text,
    current_floor int default 99,
    score numeric(10, 2) default 0.00,
    backlink_verified boolean default false,
    is_floor_locked boolean default false, -- 升級付費鎖定 1F-2F 黃金樓層
    stripe_customer_id text,
    stripe_account_id text,               -- Stripe Connect 帳號
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. 每日流量與互動指標表 (Traffic Metrics Table)
create table if not exists public.traffic_metrics (
    id bigint generated always as identity primary key,
    store_id uuid references public.stores(id) on delete cascade,
    external_clicks int default 0,
    internal_dwell_seconds int default 0,
    conversions int default 0,
    metric_date date default current_date,
    constraint unique_store_date unique (store_id, metric_date)
);

-- 索引優化
create index if not exists idx_stores_current_floor on public.stores(current_floor);
create index if not exists idx_stores_score on public.stores(score desc);

-- 3. 每日樓層重排函數 (Floor Ranking RPC)
create or replace function public.recalculate_floor_rankings()
returns void as $$
begin
    with calculated_scores as (
        select
            s.id,
            (
                (coalesce(sum(tm.external_clicks), 0) * 0.5) +
                (coalesce(avg(tm.internal_dwell_seconds), 0) * 0.2) +
                (coalesce(sum(tm.conversions), 0) * 0.3)
            ) * (case when s.backlink_verified then 1.5 else 1.0 end) as new_score
        from public.stores s
        left join public.traffic_metrics tm
            on s.id = tm.store_id
            and tm.metric_date >= current_date - interval '7 days'
        where s.is_floor_locked = false
        group by s.id
    ),
    ranked_stores as (
        select
            id,
            new_score,
            ntile(10) over (order by new_score desc) as floor_zone
        from calculated_scores
    )
    update public.stores s
    set
        score = rs.new_score,
        current_floor = rs.floor_zone,
        updated_at = now()
    from ranked_stores rs
    where s.id = rs.id;
end;
$$ language plpgsql;
