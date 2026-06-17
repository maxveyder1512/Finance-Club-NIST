# NIST Finance Club Website

Welcome to the **NIST Finance Club Website**, a premium Single Page Application (SPA) designed to teach students basic financial literacy, share market commentary, and manage assigned reading material. 

The website supports two core personas:
1. **Students**: Sign up, log in, view their dashboard, and read financial lessons specifically assigned to them by administrators.
2. **Admins / Advisors**: Create, edit, publish, and delete blog articles or lessons, view the member directory, and assign content to individual students.

To make testing and deployment seamless, the application features an automatic **Demo Mode** fallback. If no database configuration is entered, the website runs entirely in the browser using LocalStorage with pre-populated lessons and student/admin accounts. If you enter your Supabase credentials, the site connects to your live cloud database instantly.

---

## 🚀 Getting Started

### 1. Run Locally
Since this is a lightweight frontend application with no compilation step, you can serve it using any local web server. Python 3 is pre-installed on this system, so you can start a server with a single command:

```bash
python3 -m http.server 8000
```

Once running, open your browser and navigate to:
**[http://localhost:8000](http://localhost:8000)**

Alternatively, you can open `index.html` directly in your web browser (`file:///` path) and it will work perfectly!

---

## 👥 Demo Logins (Sandbox Mode)
If running in **Demo Mode** (Supabase not configured), you can log in immediately using these pre-configured accounts:

| Role | Email | Password | Assigned Initial Content |
| --- | --- | --- | --- |
| **Student** | `student@nist.ac.th` | `password123` | *The Power of Compound Interest* |
| **Admin** | `admin@nist.ac.th` | `password123` | *Full Dashboard Access & Editor* |

*Note: New accounts created via the **Register** tab are always students. To sign in as an admin, tick **"Sign in as admin"** on the **Sign In** tab and enter the admin access code: `nepobaby123`. (The demo admin account above also requires this code to unlock admin privileges.)*

---

## ⚡ Connecting a Live Supabase Database
To connect the application to a live cloud database:

1. Create a free project at **[supabase.com](https://supabase.com)**.
2. Go to the **SQL Editor** tab in your Supabase dashboard and run the SQL setup script provided below.
3. On the NIST Finance Club website, navigate to the **Sign In** screen.
4. Scroll down to the **Supabase Integration** panel.
5. Paste your Supabase **Project URL** and **Anon Key** (found under Project Settings -> API) and click **Connect Live Backend**.
6. The connection badge in the top-right corner will change to `⚡ Supabase Live`.

### Supabase SQL Database Script
Run this script in the SQL editor to create the tables, trigger auth syncing, and configure Row Level Security (RLS) policies:

```sql
-- 1. Create Profiles Table (linked to Auth.Users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text default 'student' check (role in ('student', 'admin')),
  assigned_content uuid[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Allow public read of profiles" on public.profiles
  for select using (true);

create policy "Allow users to update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Allow admins to update all profiles" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 2. Create Posts Table (articles, lessons, commentaries)
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  excerpt text,
  type text default 'blog' check (type in ('blog', 'lesson', 'commentary')),
  author text not null,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Posts
alter table public.posts enable row level security;

-- Policies for Posts
create policy "Allow public read of published posts" on public.posts
  for select using (published = true);

create policy "Allow admins full access to posts" on public.posts
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 3. Trigger to Auto-create Profile records on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Student Member'),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 🛠️ Testing Guide
To verify the features of the site:

1. **Verify Home Landing Page**: Load the homepage and click the **Join the Club** button to route to `#login`.
2. **Verify Student Sign-up**: Register a new student account. Log in. Go to **Dashboard** and confirm you see an empty assigned lessons section.
3. **Verify Blog List & Read**: Click **Blog & Lessons** to view the default posts. Select a post card and read the full article.
4. **Verify Admin Role Restriction**: Try to manually enter `#admin-editor` in your URL bar while logged in as a student. You should be redirected back to the home page with an "Access denied" warning.
5. **Verify Admin Dashboard**: Log out and log back in as `admin@nist.ac.th`, ticking **"Sign in as admin"** and entering the admin access code `nepobaby123`. Go to **Dashboard**. Notice the administrative tabs: **Member Directory** and **Manage Posts**.
6. **Verify Create/Publish Post**: Click **Manage Posts** -> **New Post**. Fill in the fields, set category to "Lesson", toggle published, and save. Check that it is visible under **Blog & Lessons**.
7. **Verify Content Assignment**: Go to **Member Directory** in the admin dashboard. Find your registered student, click **Assign Content**, check the checkbox for your new lesson, and save.
8. **Verify Student Dashboard Update**: Log out, log in as the student. Go to **Dashboard**; your newly assigned lesson will now be displayed prominently in your workspace list!
