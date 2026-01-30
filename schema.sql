-- Create a table for products
create table products (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  sku text unique not null,
  category text,
  price numeric not null,
  quantity integer default 0,
  user_id uuid references auth.users not null
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;

-- Create Policy: Users can only see their own products
create policy "Users can see own products"
  on products for select
  using ( auth.uid() = user_id );

create policy "Users can insert own products"
  on products for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own products"
  on products for update
  using ( auth.uid() = user_id );

create policy "Users can delete own products"
  on products for delete
  using ( auth.uid() = user_id );
