-- ============================================================================
-- NIST Future Financiers — Complete Supabase Setup Script
-- ============================================================================
-- Run this entire script in the Supabase SQL Editor (Dashboard -> SQL Editor).
-- It is IDEMPOTENT: safe to run multiple times. Tables use
-- `create table if not exists`, policies are dropped then recreated, and all
-- seed data is guarded so it is only inserted once.
--
-- It sets up FULL live parity for the website's features:
--   * profiles  (users, roles, assigned content)
--   * posts     (blog / lesson / commentary articles)
--   * tests     (quizzes / exams / assignments)
--   * test_scores (per-student graded results, supports upsert)
--   * positions (club leadership board)
--   * an auth trigger that auto-creates a profile row on signup
--   * Row Level Security (RLS) policies for every table
--   * seed data matching the in-app demo data
-- ============================================================================

-- Required for gen_random_uuid(). (Supabase normally has this enabled already.)
create extension if not exists "pgcrypto";


-- ============================================================================
-- 1. PROFILES TABLE  (linked to auth.users)
-- ============================================================================
-- One row per registered user. `role` gates admin features in the app, and
-- `assigned_content` holds an array of post ids individually assigned to a
-- student by an admin.
create table if not exists public.profiles (
  id               uuid primary key references auth.users on delete cascade,
  email            text not null,
  full_name        text,
  role             text not null default 'student' check (role in ('student', 'admin')),
  assigned_content uuid[] not null default '{}',
  created_at       timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ----------------------------------------------------------------------------
-- ADMIN HELPER FUNCTION (defined AFTER profiles so its body can reference it)
-- ----------------------------------------------------------------------------
-- A SECURITY DEFINER helper that checks whether the currently-authenticated
-- user has the 'admin' role. It is defined as SECURITY DEFINER so it bypasses
-- RLS when reading the profiles table — this AVOIDS the infinite-recursion
-- error you would otherwise hit if a profiles policy queried profiles directly.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Anyone may read profiles (the public leadership/member directory).
drop policy if exists "profiles_public_select" on public.profiles;
create policy "profiles_public_select" on public.profiles
  for select using (true);

-- A user may update their own profile row.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Admins may update any profile (role changes, content assignment).
drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update" on public.profiles
  for update using (public.is_admin());

-- Admins may delete any profile (remove a member).
drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete" on public.profiles
  for delete using (public.is_admin());


-- ============================================================================
-- 2. POSTS TABLE  (blog articles, lessons, market commentary)
-- ============================================================================
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text not null,
  excerpt     text,
  type        text not null default 'blog' check (type in ('blog', 'lesson', 'commentary')),
  author      text not null default 'NIST Finance Club',
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Everyone can read published posts.
drop policy if exists "posts_public_select_published" on public.posts;
create policy "posts_public_select_published" on public.posts
  for select using (published = true);

-- Admins have full access (incl. drafts, create, update, delete).
drop policy if exists "posts_admin_all" on public.posts;
create policy "posts_admin_all" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());


-- ============================================================================
-- 3. TESTS TABLE  (quizzes / exams / assignments)
-- ============================================================================
create table if not exists public.tests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  date        date,
  max_score   int,
  category    text check (category in ('Quiz', 'Exam', 'Assignment')),
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.tests enable row level security;

-- Everyone can read published tests (the upcoming-tests list).
drop policy if exists "tests_public_select_published" on public.tests;
create policy "tests_public_select_published" on public.tests
  for select using (published = true);

-- Admins have full access (incl. drafts, create, update, delete).
drop policy if exists "tests_admin_all" on public.tests;
create policy "tests_admin_all" on public.tests
  for all using (public.is_admin()) with check (public.is_admin());


-- ============================================================================
-- 4. TEST_SCORES TABLE  (per-student graded results)
-- ============================================================================
-- The unique constraint on (test_id, student_email) is what makes the app's
-- upsert (onConflict: "test_id,student_email") work — re-grading a student
-- updates their existing row instead of inserting a duplicate.
create table if not exists public.test_scores (
  id            uuid primary key default gen_random_uuid(),
  test_id       uuid references public.tests(id) on delete cascade,
  student_email text not null,
  score         int,
  max_score     int,
  passed        boolean,
  graded_at     timestamptz not null default now(),
  unique (test_id, student_email)
);

alter table public.test_scores enable row level security;

-- A student may read only their own scores (matched by their auth email).
drop policy if exists "test_scores_select_own" on public.test_scores;
create policy "test_scores_select_own" on public.test_scores
  for select using (
    lower(student_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Admins have full access (read every score, grade/insert, update, delete).
drop policy if exists "test_scores_admin_all" on public.test_scores;
create policy "test_scores_admin_all" on public.test_scores
  for all using (public.is_admin()) with check (public.is_admin());


-- ============================================================================
-- 5. POSITIONS TABLE  (club leadership board)
-- ============================================================================
-- `order` is a reserved SQL word, so it must always be quoted as "order".
-- `public` here is a column flag meaning "show this position publicly",
-- separate from the `public` schema name.
create table if not exists public.positions (
  id        text primary key,
  title     text not null,
  holder    text,
  public    boolean not null default true,
  lockable  boolean not null default false,
  locked    boolean not null default false,
  "order"   int
);

alter table public.positions enable row level security;

-- Everyone can read positions flagged public; authenticated users can read all.
drop policy if exists "positions_public_select" on public.positions;
create policy "positions_public_select" on public.positions
  for select using (public = true or auth.role() = 'authenticated');

-- Admins may update positions (assign holders, lock/unlock).
drop policy if exists "positions_admin_update" on public.positions;
create policy "positions_admin_update" on public.positions
  for update using (public.is_admin()) with check (public.is_admin());

-- Admins may insert/delete positions (full management, future-proofing).
drop policy if exists "positions_admin_insert" on public.positions;
create policy "positions_admin_insert" on public.positions
  for insert with check (public.is_admin());

drop policy if exists "positions_admin_delete" on public.positions;
create policy "positions_admin_delete" on public.positions
  for delete using (public.is_admin());


-- ============================================================================
-- 6. AUTH TRIGGER  (auto-create a profile row on new signup)
-- ============================================================================
-- When a new user is created in auth.users, copy their full_name and role from
-- the signup metadata into a fresh profiles row (defaulting role to 'student').
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Student Member'),
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================================
-- 7. SEED DATA  (idempotent — matches the in-app demo data)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 7a. Positions  (id is a stable text PK, so we can use ON CONFLICT)
-- ----------------------------------------------------------------------------
insert into public.positions (id, title, holder, public, lockable, locked, "order") values
  ('p1a', 'Founder & Club Leader', 'Max Veyder',   true,  false, false, 1),
  ('p1b', 'Founder & Club Leader', 'Oscar De Pins', true,  false, false, 2),
  ('p2',  'Secretary',             'Bea Naumann',   true,  false, false, 3),
  ('p3',  'Social Media Team',     'TBA',           false, true,  true,  4),
  ('p4',  'Events Coordinator',    'TBA',           false, true,  true,  5)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 7b. Posts  (uuid PK, so guard each insert by unique title via NOT EXISTS)
--     Bodies use dollar-quoting ($post$...$post$) so the HTML/apostrophes
--     need no escaping.
-- ----------------------------------------------------------------------------
insert into public.posts (title, excerpt, body, type, author, published)
select
  'The Power of Compound Interest',
  'Learn how your money grows exponentially over time and why starting early is the ultimate cheat code in wealth building.',
  $post$<h2>What is Compound Interest?</h2>
<p>Compound interest is the interest you earn on interest. This can be illustrated by a simple example: if you have $100 and it earns 5% interest each year, you'll have $105 at the end of the first year. In the second year, you'll earn 5% interest on $105, which is $5.25, giving you a total of $110.25. Over time, this compounding effect accelerates dramatically.</p>
<h3>Why Start Early?</h3>
<p>The earlier you start, the more time your money has to compound. Even small, consistent contributions made early can outgrow much larger contributions made later.</p>
<p><strong>NIST Finance Club Tip:</strong> Even saving a tiny fraction of your allowance today can secure a huge financial head start tomorrow.</p>$post$,
  'lesson',
  'Maximilian V. (NIST Finance Advisor)',
  true
where not exists (select 1 from public.posts where title = 'The Power of Compound Interest');

insert into public.posts (title, excerpt, body, type, author, published)
select
  'Lesson 2: Reading a Balance Sheet',
  'Decode the three building blocks of a company''s financial health — assets, liabilities, and equity — and learn what they reveal about a business.',
  $post$<h2>The Snapshot of a Company</h2>
<p>A balance sheet tells you what a company <strong>owns</strong>, what it <strong>owes</strong>, and what is left over for its owners at a single point in time.</p>
<h3>The Accounting Equation</h3>
<p><strong>Assets = Liabilities + Shareholders' Equity</strong></p>
<p>This equation must always balance — that is why it is called a balance sheet.</p>
<p><strong>NIST Finance Club Tip:</strong> Compare a company's total debt to its total assets. A lower ratio usually means a more financially stable business.</p>$post$,
  'lesson',
  'Maximilian V. (NIST Finance Advisor)',
  true
where not exists (select 1 from public.posts where title = 'Lesson 2: Reading a Balance Sheet');

insert into public.posts (title, excerpt, body, type, author, published)
select
  'Lesson 3: Diversification 101',
  'Why putting all your eggs in one basket is the fastest way to lose them — and how spreading risk protects your portfolio.',
  $post$<h2>Don't Put All Your Eggs in One Basket</h2>
<p>Diversification is the practice of spreading your investments across many different assets so that no single bad outcome can wipe you out.</p>
<h3>Ways to Diversify</h3>
<ul>
  <li><strong>Across companies:</strong> Hold many different stocks instead of just one or two.</li>
  <li><strong>Across sectors:</strong> Mix industries like tech, energy, and healthcare.</li>
  <li><strong>Across asset classes:</strong> Combine stocks, bonds, and cash.</li>
</ul>
<p><strong>NIST Finance Club Tip:</strong> In our simulator, our 20% single-stock cap is a diversification rule in disguise.</p>$post$,
  'lesson',
  'Finance Club Executive Board',
  true
where not exists (select 1 from public.posts where title = 'Lesson 3: Diversification 101');

insert into public.posts (title, excerpt, body, type, author, published)
select
  'Navigating the NIST Stock Market Simulator',
  'A comprehensive guide on how to research companies, place trades, and manage risk in our upcoming quarterly club simulator.',
  $post$<h2>Ready to Trade?</h2>
<p>Welcome to the NIST Finance Club Stock Market Simulator! Every member is allocated $100,000 in virtual cash. Your goal is to construct a diversified portfolio and outperform the S&P 500 index over the next 8 weeks.</p>
<h3>Key Trading Rules</h3>
<ol>
  <li><strong>Diversification Rule:</strong> You cannot invest more than 20% of your initial capital into a single stock.</li>
  <li><strong>Trading Hours:</strong> Trades execute during standard market hours.</li>
  <li><strong>Short Selling:</strong> Allowed, but margin requirements will be enforced.</li>
</ol>
<p>The leaderboard will be updated daily. Good luck to all participants!</p>$post$,
  'blog',
  'Finance Club Executive Board',
  true
where not exists (select 1 from public.posts where title = 'Navigating the NIST Stock Market Simulator');

insert into public.posts (title, excerpt, body, type, author, published)
select
  'Market Commentary: Inflation and Interest Rates',
  'An analysis of the Federal Reserve''s latest macroeconomic interest rate decisions and what they mean for student investors.',
  $post$<h2>Macroeconomic Overview</h2>
<p>The Federal Reserve adjusts its benchmark interest rate to manage inflation levels. This decision sends ripple effects across stock and bond markets globally.</p>
<h3>Impact on Assets</h3>
<ul>
  <li><strong>Growth Stocks:</strong> Typically react negatively to rate hikes.</li>
  <li><strong>Bonds:</strong> Bond prices move inversely to interest rates.</li>
  <li><strong>Cash/Savings:</strong> Yields on savings accounts increase.</li>
</ul>
<p><strong>NIST Club Analysis:</strong> The current environment emphasizes the importance of a balanced portfolio.</p>$post$,
  'commentary',
  'Head of Market Research',
  true
where not exists (select 1 from public.posts where title = 'Market Commentary: Inflation and Interest Rates');

insert into public.posts (title, excerpt, body, type, author, published)
select
  '5 Beginner Mistakes in Stock Picking',
  'From chasing hype to ignoring fees, here are the five rookie errors that quietly sink new investors — and how to sidestep every one.',
  $post$<h2>Learn From These Mistakes (Before You Make Them)</h2>
<p>The most common investing mistakes are also the most avoidable. Here are five traps we see new members fall into.</p>
<h3>1. Chasing Hype</h3>
<p>Buying a stock just because it is trending is gambling, not investing.</p>
<h3>2. Ignoring Fees</h3>
<p>Small fees compound against you over time.</p>
<h3>3. No Diversification</h3>
<p>Spread your money across companies and sectors.</p>
<h3>4. Panic Selling</h3>
<p>Selling every time the price drops locks in your losses.</p>
<h3>5. No Plan</h3>
<p>Decide why you are buying and when you would sell before you place the trade.</p>$post$,
  'blog',
  'Oscar De Pins (Co-Founder)',
  true
where not exists (select 1 from public.posts where title = '5 Beginner Mistakes in Stock Picking');

insert into public.posts (title, excerpt, body, type, author, published)
select
  'Weekly Market Recap: Tech Rally Lifts the Market',
  'A strong week for technology stocks pushed major indices higher. Here is what drove the rally and what student investors should watch next.',
  $post$<h2>Markets Close the Week Higher</h2>
<p>Major stock indices finished the week in positive territory, powered largely by a broad rally in technology shares.</p>
<h3>What Drove the Move?</h3>
<ul>
  <li><strong>Strong Earnings:</strong> Several large-cap tech companies beat expectations.</li>
  <li><strong>Cooling Inflation Data:</strong> A softer inflation reading raised hopes that rates may stabilise.</li>
  <li><strong>Improving Sentiment:</strong> Buyers stepped back into the market.</li>
</ul>
<p><strong>NIST Club Analysis:</strong> Rallies feel exciting, but remember that markets move in both directions.</p>$post$,
  'commentary',
  'Head of Market Research',
  true
where not exists (select 1 from public.posts where title = 'Weekly Market Recap: Tech Rally Lifts the Market');

-- ----------------------------------------------------------------------------
-- 7c. Tests  (uuid PK, so guard each insert by unique name via NOT EXISTS)
-- ----------------------------------------------------------------------------
insert into public.tests (name, description, date, max_score, category, published)
select 'Investment Basics Quiz', 'Covers stocks, bonds, and diversification fundamentals.', date '2026-06-10', 100, 'Quiz', true
where not exists (select 1 from public.tests where name = 'Investment Basics Quiz');

insert into public.tests (name, description, date, max_score, category, published)
select 'Market Analysis Exam', 'In-depth market analysis and valuation techniques.', date '2026-07-15', 100, 'Exam', true
where not exists (select 1 from public.tests where name = 'Market Analysis Exam');

insert into public.tests (name, description, date, max_score, category, published)
select 'Financial Statements Assignment', 'Read and interpret a real company''s financial statements.', date '2026-08-01', 50, 'Assignment', true
where not exists (select 1 from public.tests where name = 'Financial Statements Assignment');

-- ----------------------------------------------------------------------------
-- 7d. Test scores
-- ----------------------------------------------------------------------------
-- Sample scores are intentionally NOT seeded: they reference real student
-- accounts (by email) that only exist after a user signs up through Supabase
-- Auth. Admins create scores from the dashboard once members have registered.

-- ============================================================================
-- Done. The database now has full live parity with the website.
-- ============================================================================
