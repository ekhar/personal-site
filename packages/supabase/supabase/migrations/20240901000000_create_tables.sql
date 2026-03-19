-- Car maintenance
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  make text not null,
  model text not null,
  year int not null,
  vin text,
  mileage int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table maintenance_records (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null default auth.uid(),
  type text not null,
  description text not null default '',
  cost numeric(10,2) not null default 0,
  mileage int not null default 0,
  date date not null,
  created_at timestamptz not null default now()
);

create table fuel_logs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null default auth.uid(),
  gallons numeric(10,3) not null,
  cost_per_gallon numeric(10,3) not null,
  total_cost numeric(10,2) generated always as (gallons * cost_per_gallon) stored,
  mileage int not null,
  date date not null,
  created_at timestamptz not null default now()
);

-- Budget
create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  name text not null,
  type text not null, -- checking, savings, credit
  balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  name text not null,
  color text,
  created_at timestamptz not null default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  account_id uuid references accounts(id) on delete cascade not null,
  category_id uuid references categories(id) on delete set null,
  amount numeric(12,2) not null,
  description text not null default '',
  date date not null,
  type text not null, -- income, expense, transfer
  created_at timestamptz not null default now()
);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  category_id uuid references categories(id) on delete cascade not null,
  amount numeric(12,2) not null,
  month date not null, -- first of month
  created_at timestamptz not null default now()
);

-- Tax
create table tax_years (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  year int not null,
  status text not null default 'in_progress', -- in_progress, filed, accepted
  total_income numeric(12,2) not null default 0,
  total_deductions numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table tax_documents (
  id uuid primary key default gen_random_uuid(),
  tax_year_id uuid references tax_years(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null default auth.uid(),
  name text not null,
  type text not null, -- w2, 1099, receipt, etc
  storage_path text,
  created_at timestamptz not null default now()
);

create table deductions (
  id uuid primary key default gen_random_uuid(),
  tax_year_id uuid references tax_years(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null default auth.uid(),
  category text not null,
  description text not null default '',
  amount numeric(12,2) not null,
  created_at timestamptz not null default now()
);

-- RLS policies: all tables scoped to auth.uid()
alter table vehicles enable row level security;
alter table maintenance_records enable row level security;
alter table fuel_logs enable row level security;
alter table accounts enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;
alter table tax_years enable row level security;
alter table tax_documents enable row level security;
alter table deductions enable row level security;

-- Generic RLS: owner can do everything
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'vehicles','maintenance_records','fuel_logs',
    'accounts','categories','transactions','budgets',
    'tax_years','tax_documents','deductions'
  ]) loop
    execute format('create policy "Users can manage own %1$s" on %1$s for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;
