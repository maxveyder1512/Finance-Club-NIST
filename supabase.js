// NIST Finance Club - Database & Authentication Helper

// Pre-populated Mock Data for Demo Mode
const INITIAL_MOCK_POSTS = [
  {
    id: "post-1",
    title: "The Power of Compound Interest",
    excerpt: "Learn how your money grows exponentially over time and why starting early is the ultimate cheat code in wealth building.",
    body: `<h2>What is Compound Interest?</h2>
<p>Compound interest is the interest you earn on interest. This can be illustrated by a simple example: if you have $100 and it earns 5% interest each year, you'll have $105 at the end of the first year. In the second year, you'll earn 5% interest on $105, which is $5.25, giving you a total of $110.25. Over time, this compounding effect accelerates dramatically.</p>

<h3>The Compound Formula</h3>
<p>The mathematical formula for compound interest is:</p>
<p><strong>A = P(1 + r/n)^(nt)</strong></p>
<p>Where:
<ul>
  <li><strong>A</strong> = the future value of the investment/loan, including interest</li>
  <li><strong>P</strong> = the principal investment amount (initial deposit)</li>
  <li><strong>r</strong> = the annual interest rate (decimal)</li>
  <li><strong>n</strong> = the number of times that interest is compounded per unit t</li>
  <li><strong>t</strong> = the time the money is invested or borrowed for</li>
</ul>
</p>

<h3>Why Start Early?</h3>
<p>Consider two students: Alice and Bob. Alice starts investing $100 a month at age 15. Bob starts investing $100 a month at age 25. Assuming a 8% annual return, by age 65, Alice will have contributed $60,000 and have roughly $350,000. Bob will have contributed $48,000 but only have around $150,000. The extra 10 years gave Alice's money far more time to compound!</p>

<p><strong>NIST Finance Club Tip:</strong> Even saving a tiny fraction of your allowance today can secure a huge financial head start tomorrow. Start small, stay consistent, and let compounding do the heavy lifting!</p>`,
    type: "lesson",
    author: "Maximilian V. (NIST Finance Advisor)",
    published: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-lesson-balance-sheet",
    title: "Lesson 2: Reading a Balance Sheet",
    excerpt: "Decode the three building blocks of a company's financial health — assets, liabilities, and equity — and learn what they reveal about a business.",
    body: `<h2>The Snapshot of a Company</h2>
<p>A balance sheet is a financial snapshot that tells you what a company <strong>owns</strong>, what it <strong>owes</strong>, and what is left over for its owners at a single point in time. Every balance sheet is built on one simple equation.</p>

<h3>The Accounting Equation</h3>
<p><strong>Assets = Liabilities + Shareholders' Equity</strong></p>
<p>This equation must <em>always</em> balance — that is why it is called a balance sheet. If a company buys a $1,000 laptop using cash, one asset (cash) goes down while another asset (equipment) goes up, so the two sides stay equal.</p>

<h3>The Three Building Blocks</h3>
<ul>
  <li><strong>Assets:</strong> Everything the company owns that has value — cash, inventory, equipment, and buildings.</li>
  <li><strong>Liabilities:</strong> Everything the company owes to others — loans, unpaid bills, and bonds.</li>
  <li><strong>Shareholders' Equity:</strong> The owners' stake — what would remain if the company sold all assets and paid off all debts.</li>
</ul>

<h3>Why Students Should Care</h3>
<p>Before you invest a single virtual dollar in our simulator, glance at the balance sheet. A company drowning in liabilities with few assets is a red flag, while a business with healthy equity and manageable debt is often built to last.</p>

<p><strong>NIST Finance Club Tip:</strong> Compare a company's total debt to its total assets. A lower ratio usually means a more financially stable business.</p>`,
    type: "lesson",
    author: "Maximilian V. (NIST Finance Advisor)",
    published: true,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-lesson-diversification",
    title: "Lesson 3: Diversification 101",
    excerpt: "Why putting all your eggs in one basket is the fastest way to lose them — and how spreading risk protects your portfolio.",
    body: `<h2>Don't Put All Your Eggs in One Basket</h2>
<p>Diversification is the practice of spreading your investments across many different assets so that no single bad outcome can wipe you out. It is widely considered the only "free lunch" in investing — you reduce risk without necessarily reducing expected returns.</p>

<h3>How Diversification Works</h3>
<p>Imagine you invest your entire portfolio in one airline stock. If oil prices spike or travel demand collapses, your savings could plummet overnight. But if you hold airlines, technology, healthcare, and consumer goods, a downturn in one industry can be cushioned by stability or growth in another.</p>

<h3>Ways to Diversify</h3>
<ul>
  <li><strong>Across companies:</strong> Hold many different stocks instead of just one or two.</li>
  <li><strong>Across sectors:</strong> Mix industries like tech, energy, and healthcare.</li>
  <li><strong>Across asset classes:</strong> Combine stocks, bonds, and cash.</li>
  <li><strong>Across geographies:</strong> Include both domestic and international markets.</li>
</ul>

<h3>The Easiest Shortcut: Index Funds</h3>
<p>For beginners, a low-cost index fund instantly buys you a tiny slice of hundreds of companies at once — built-in diversification with a single purchase.</p>

<p><strong>NIST Finance Club Tip:</strong> In our simulator, our 20% single-stock cap is a diversification rule in disguise. It forces you to build a balanced, resilient portfolio.</p>`,
    type: "lesson",
    author: "Finance Club Executive Board",
    published: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-2",
    title: "Navigating the NIST Stock Market Simulator",
    excerpt: "A comprehensive guide on how to research companies, place trades, and manage risk in our upcoming quarterly club simulator.",
    body: `<h2>Ready to Trade?</h2>
<p>Welcome to the NIST Finance Club Stock Market Simulator! Every member is allocated $100,000 in virtual cash. Your goal is to construct a diversified portfolio and outperform the S&P 500 index over the next 8 weeks.</p>

<h3>Key Trading Rules</h3>
<p>To keep the simulator realistic and fair, we have established a few baseline rules:
<ol>
  <li><strong>Diversification Rule:</strong> You cannot invest more than 20% of your initial capital ($20,000) into a single stock. This prevents 'all-in' gambling on volatile penny stocks.</li>
  <li><strong>Trading Hours:</strong> Trades can be queued at any time but will execute during standard market hours (9:30 AM - 4:00 PM EST).</li>
  <li><strong>Short Selling:</strong> Allowed, but margin requirements will be enforced. Keep an eye on your maintenance margin!</li>
</ol>
</p>

<h3>Top Strategies for Beginners</h3>
<p>Before you place your first trade, consider these fundamental principles:
<ul>
  <li><strong>Invest in What You Know:</strong> Look at products and services you use daily. Do you like Apple, Microsoft, or Nike? Start your research there.</li>
  <li><strong>Read the Financials:</strong> Look at quarterly earnings reports, revenue growth, and debt-to-equity ratios. Don't buy purely based on social media hype.</li>
  <li><strong>Keep a Trading Journal:</strong> Write down exactly why you bought or sold each stock. Learning from your mistakes is how you become a successful investor.</li>
</ul>
</p>

<p>The leaderboard will be updated daily at 5:00 PM. Good luck to all participants!</p>`,
    type: "blog",
    author: "Finance Club Executive Board",
    published: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-3",
    title: "Market Commentary: Inflation and Interest Rates",
    excerpt: "An analysis of the Federal Reserve's latest macroeconomic interest rate decisions and what they mean for student investors.",
    body: `<h2>Macroeconomic Overview</h2>
<p>In our latest meeting, the Federal Reserve decided to adjust its benchmark interest rate to manage inflation levels. This decision has sent ripple effects across stock and bond markets globally, presenting unique opportunities and challenges for retail investors.</p>

<h3>What are Interest Rates and Why Do They Matter?</h3>
<p>Interest rates represent the cost of borrowing money. When inflation (the rate at which prices rise) is too high, the central bank raises rates to make borrowing more expensive, which cools economic activity. When the economy is sluggish, they lower rates to encourage spending.</p>

<h3>Impact on Assets</h3>
<p>Here is a quick cheat sheet on how rate adjustments typically affect different asset classes:
<ul>
  <li><strong>Growth Stocks:</strong> Typically react negatively to rate hikes, as higher rates reduce the present value of future cash flows and make corporate borrowing expensive.</li>
  <li><strong>Bonds:</strong> Bond prices move inversely to interest rates. When rates rise, existing bonds with lower yields drop in price.</li>
  <li><strong>Cash/Savings:</strong> Yields on High-Yield Savings Accounts (HYSAs) increase, making cash savings more attractive.</li>
</ul>
</p>

<p><strong>NIST Club Analysis:</strong> For student investors, the current environment emphasizes the importance of a balanced portfolio. Consider locking in high yields on risk-free assets while accumulating high-quality growth stocks at discount prices during market pullbacks.</p>`,
    type: "commentary",
    author: "Head of Market Research",
    published: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-blog-beginner-mistakes",
    title: "5 Beginner Mistakes in Stock Picking",
    excerpt: "From chasing hype to ignoring fees, here are the five rookie errors that quietly sink new investors — and how to sidestep every one.",
    body: `<h2>Learn From These Mistakes (Before You Make Them)</h2>
<p>Everyone makes mistakes when they start investing. The good news? The most common ones are also the most avoidable. Here are five traps we see new members fall into during our simulator — and how to dodge them.</p>

<h3>1. Chasing Hype</h3>
<p>Buying a stock just because it is trending on social media is gambling, not investing. By the time a stock is "the talk of the internet," the easy gains are usually gone. Do your own research before you buy.</p>

<h3>2. Ignoring Fees</h3>
<p>Small trading commissions and fund fees compound against you over time, just like interest compounds for you. Always know what you are paying.</p>

<h3>3. No Diversification</h3>
<p>Putting everything into one "sure thing" is the fastest way to a painful loss. Spread your money across companies and sectors.</p>

<h3>4. Panic Selling</h3>
<p>Markets dip — that is normal. Selling every time the price drops locks in your losses. Successful investors zoom out and stay calm.</p>

<h3>5. No Plan</h3>
<p>Investing without goals or rules leads to impulsive decisions. Decide <em>why</em> you are buying and <em>when</em> you would sell <strong>before</strong> you place the trade.</p>

<p><strong>NIST Finance Club Tip:</strong> Keep a trading journal in the simulator. Writing down your reasoning turns every mistake into a free lesson.</p>`,
    type: "blog",
    author: "Oscar De Pins (Co-Founder)",
    published: true,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-commentary-tech-rally",
    title: "Weekly Market Recap: Tech Rally Lifts the Market",
    excerpt: "A strong week for technology stocks pushed major indices higher. Here is what drove the rally and what student investors should watch next.",
    body: `<h2>Markets Close the Week Higher</h2>
<p>Major stock indices finished the week in positive territory, powered largely by a broad rally in technology shares. Enthusiasm around artificial intelligence and a batch of better-than-expected earnings reports lifted investor sentiment across the board.</p>

<h3>What Drove the Move?</h3>
<ul>
  <li><strong>Strong Earnings:</strong> Several large-cap tech companies beat analyst expectations on both revenue and profit, reassuring investors about future growth.</li>
  <li><strong>Cooling Inflation Data:</strong> A softer inflation reading raised hopes that interest rates may stabilise, which tends to benefit growth stocks.</li>
  <li><strong>Improving Sentiment:</strong> With fewer negative surprises this week, buyers stepped back into the market.</li>
</ul>

<h3>What to Watch Next Week</h3>
<p>Keep an eye on upcoming economic data and any commentary from central bank officials. A single surprise headline can quickly change the market's mood.</p>

<p><strong>NIST Club Analysis:</strong> Rallies feel exciting, but remember that markets move in both directions. Use weeks like this to review your simulator portfolio rather than chase the hottest stock of the moment.</p>`,
    type: "commentary",
    author: "Head of Market Research",
    published: true,
    created_at: new Date().toISOString()
  }
];

const INITIAL_MOCK_PROFILES = [
  {
    id: "user-student",
    email: "student@nist.ac.th",
    full_name: "Aidan Taylor",
    role: "student",
    assigned_content: ["post-1"], // Pre-assign the Compound Interest post
    created_at: new Date().toISOString()
  },
  {
    id: "user-admin",
    email: "admin@nist.ac.th",
    full_name: "Mrs. Sarah Jenkins (NIST Faculty Advisor)",
    role: "student",
    assigned_content: [],
    created_at: new Date().toISOString()
  },
  {
    id: "user-oscar",
    email: "oscar.depins@nist.ac.th",
    full_name: "Oscar De Pins De Caucaliers",
    role: "admin",
    assigned_content: [],
    created_at: new Date().toISOString()
  }
];

const INITIAL_MOCK_TESTS = [
  { id: "t1", name: "Investment Basics Quiz", description: "Covers stocks, bonds, and diversification fundamentals.", date: "2026-06-10", max_score: 100, category: "Quiz", published: true, created_at: "2026-06-01" },
  { id: "t2", name: "Market Analysis Exam", description: "In-depth market analysis and valuation techniques.", date: "2026-07-15", max_score: 100, category: "Exam", published: true, created_at: "2026-06-05" },
  { id: "t3", name: "Financial Statements Assignment", description: "Read and interpret a real company's financial statements.", date: "2026-08-01", max_score: 50, category: "Assignment", published: true, created_at: "2026-06-08" }
];

const INITIAL_MOCK_TEST_SCORES = [
  { id: "s1", test_id: "t1", student_email: "student@nist.ac.th", score: 87, max_score: 100, passed: true, graded_at: "2026-06-11" }
];

// Bump POSTS_VERSION whenever INITIAL_MOCK_POSTS changes so existing users get
// the fresh seed in LocalStorage without manually clearing it. This ONLY resets
// posts — profiles, tests, scores, and positions are left untouched.
const POSTS_VERSION = "2";

// Bump POSITIONS_VERSION whenever INITIAL_MOCK_POSITIONS changes so existing
// users get the fresh seed in LocalStorage without manually clearing it.
const POSITIONS_VERSION = "2";

// Bump PROFILES_VERSION whenever INITIAL_MOCK_PROFILES changes (e.g. seeded
// roles) so existing users get the fresh seed in LocalStorage without manually
// clearing it. This ONLY resets the seeded profiles — posts, positions, tests,
// and scores are left untouched.
const PROFILES_VERSION = "2";

const INITIAL_MOCK_POSITIONS = [
  { id: "p1a", title: "Founder & Club Leader", holder: "Max Veyder", public: true, lockable: false, locked: false, order: 1 },
  { id: "p1b", title: "Founder & Club Leader", holder: "Oscar De Pins", public: true, lockable: false, locked: false, order: 2 },
  { id: "p2", title: "Secretary", holder: "Bea Naumann", public: true, lockable: false, locked: false, order: 3 },
  { id: "p3", title: "Social Media Team", holder: "TBA", public: false, lockable: true, locked: true, order: 4 },
  { id: "p4", title: "Events Coordinator", holder: "TBA", public: false, lockable: true, locked: true, order: 5 }
];

// Hardcoded live Supabase credentials. The anon key is a public client key
// (safe to expose in frontend code and to commit — access is protected by RLS).
// These act as defaults; any credentials saved via the on-page Supabase panel
// (LocalStorage) take precedence so the site can still be re-pointed at runtime.
const SUPABASE_URL = "https://oxzccemwszcshqusrmti.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94emNjZW13c3pjc2hxdXNybXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0Nzk5ODYsImV4cCI6MjA5NzA1NTk4Nn0.XP6e261N8ivCYHjXe8xPTsQv-Iw2m82RuwF35aFlUyg";

// Helper to handle client-side database layer
class SupabaseService {
  constructor() {
    this.isDemoMode = true;
    this.client = null;
    this.init();
  }

  // Initialize service
  init() {
    const url = localStorage.getItem("nist_supabase_url") || SUPABASE_URL;
    const key = localStorage.getItem("nist_supabase_key") || SUPABASE_ANON_KEY;

    if (url && key && window.supabase) {
      try {
        this.client = window.supabase.createClient(url, key);
        this.isDemoMode = false;
        console.log("Successfully connected to live Supabase backend.");
      } catch (err) {
        console.error("Failed to initialize live Supabase client, falling back to Demo Mode:", err);
        this.isDemoMode = true;
      }
    } else {
      this.isDemoMode = true;
      console.log("Supabase credentials not configured. Running in Demo Mode.");
    }

    // Prepopulate localStorage if running in Demo Mode
    if (this.isDemoMode) {
      // Posts use a versioned seed: if the stored version is missing or out of
      // date, overwrite ONLY the posts data with the fresh seed so the latest
      // exemplar posts show up on reload. Other data (profiles, tests, scores,
      // positions) is left untouched.
      const storedPostsVersion = localStorage.getItem("nist_posts_version");
      if (!localStorage.getItem("demo_posts") || storedPostsVersion !== POSTS_VERSION) {
        localStorage.setItem("demo_posts", JSON.stringify(INITIAL_MOCK_POSTS));
        localStorage.setItem("nist_posts_version", POSTS_VERSION);
      }
      // Profiles use a versioned seed: if the stored version is missing or out
      // of date, overwrite ONLY the seeded profiles with the fresh seed so the
      // latest seeded roles show up on reload. Other data (posts, positions,
      // tests, scores) is left untouched.
      const storedProfilesVersion = localStorage.getItem("nist_profiles_version");
      if (!localStorage.getItem("demo_profiles") || storedProfilesVersion !== PROFILES_VERSION) {
        localStorage.setItem("demo_profiles", JSON.stringify(INITIAL_MOCK_PROFILES));
        localStorage.setItem("nist_profiles_version", PROFILES_VERSION);
      }
      if (!localStorage.getItem("demo_users")) {
        // Mock authentication credentials for demo users (passwords are 'password123')
        localStorage.setItem("demo_users", JSON.stringify([
          { id: "user-student", email: "student@nist.ac.th", password: "password123" },
          { id: "user-admin", email: "admin@nist.ac.th", password: "password123" },
          { id: "user-oscar", email: "oscar.depins@nist.ac.th", password: "password123" }
        ]));
      }
      if (!localStorage.getItem("nist_tests")) {
        localStorage.setItem("nist_tests", JSON.stringify(INITIAL_MOCK_TESTS));
      }
      if (!localStorage.getItem("nist_test_scores")) {
        localStorage.setItem("nist_test_scores", JSON.stringify(INITIAL_MOCK_TEST_SCORES));
      }
      // Positions use a versioned seed: if the stored version is missing or out
      // of date, overwrite ONLY the positions data with the fresh seed so the
      // latest layout shows up on reload. Other data (posts, profiles, tests,
      // scores) is left untouched.
      const storedPositionsVersion = localStorage.getItem("nist_positions_version");
      if (!localStorage.getItem("nist_positions") || storedPositionsVersion !== POSITIONS_VERSION) {
        localStorage.setItem("nist_positions", JSON.stringify(INITIAL_MOCK_POSITIONS));
        localStorage.setItem("nist_positions_version", POSITIONS_VERSION);
      }
    }
  }

  // Save/Change Supabase Keys
  setCredentials(url, key) {
    if (url && key) {
      localStorage.setItem("nist_supabase_url", url);
      localStorage.setItem("nist_supabase_key", key);
    } else {
      localStorage.removeItem("nist_supabase_url");
      localStorage.removeItem("nist_supabase_key");
    }
    this.init();
    return !this.isDemoMode;
  }

  getCredentials() {
    return {
      url: localStorage.getItem("nist_supabase_url") || "",
      key: localStorage.getItem("nist_supabase_key") || ""
    };
  }

  // AUTHENTICATION
  async signUp(email, password, fullName, role = "student") {
    if (this.isDemoMode) {
      const users = JSON.parse(localStorage.getItem("demo_users") || "[]");
      const profiles = JSON.parse(localStorage.getItem("demo_profiles") || "[]");

      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("User with this email already exists.");
      }

      const newId = "user-" + Math.random().toString(36).substr(2, 9);
      
      // Save credentials
      users.push({ id: newId, email, password });
      localStorage.setItem("demo_users", JSON.stringify(users));

      // Save profile
      const newProfile = {
        id: newId,
        email,
        full_name: fullName || "Student Member",
        role: role,
        assigned_content: [],
        created_at: new Date().toISOString()
      };
      profiles.push(newProfile);
      localStorage.setItem("demo_profiles", JSON.stringify(profiles));

      const session = { user: { id: newId, email, user_metadata: { full_name: fullName, role } } };
      localStorage.setItem("demo_session", JSON.stringify(session));
      return { data: session, error: null };
    } else {
      // Live Supabase Auth
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      return { data, error };
    }
  }

  // `asAdmin` is the gate for admin privileges. It is only true when the
  // correct admin access code was supplied on the Sign In form. The resulting
  // role is derived from this flag, NOT from any stale stored profile role.
  async signIn(email, password, asAdmin = false) {
    if (this.isDemoMode) {
      const users = JSON.parse(localStorage.getItem("demo_users") || "[]");
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (!user) {
        throw new Error("Invalid login credentials.");
      }

      const role = asAdmin ? "admin" : "student";

      const profiles = JSON.parse(localStorage.getItem("demo_profiles") || "[]");
      const idx = profiles.findIndex(p => p.id === user.id);

      let profile;
      if (idx !== -1) {
        // Persist the session's role on the stored profile so that anyone
        // signing in without the code is always a student, even if a stale
        // admin role was left over from a previous admin-code session.
        profiles[idx].role = role;
        profile = profiles[idx];
      } else {
        // No stored profile exists for this credential (e.g. it was wiped by a
        // profiles re-seed). Build one AND add it to the store so the role we
        // set here actually survives — getCurrentUser() reads the role back
        // from demo_profiles, so an un-persisted profile would silently fall
        // back to a default "student" and drop the admin grant.
        profile = {
          id: user.id,
          email: user.email,
          full_name: "Student Member",
          role,
          assigned_content: [],
          created_at: new Date().toISOString()
        };
        profiles.push(profile);
      }
      localStorage.setItem("demo_profiles", JSON.stringify(profiles));

      const session = { user: { id: user.id, email: user.email, profile } };
      localStorage.setItem("demo_session", JSON.stringify(session));
      return { data: session, error: null };
    } else {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password
      });

      // Keep the live backend coherent: the admin access code is the gate, so
      // promote the signed-in user's profile to admin when it was supplied.
      if (!error && asAdmin && data?.user) {
        try {
          await this.client
            .from("profiles")
            .update({ role: "admin" })
            .eq("id", data.user.id);
        } catch (err) {
          console.error("Failed to elevate profile to admin:", err);
        }
      }
      return { data, error };
    }
  }

  async signOut() {
    if (this.isDemoMode) {
      localStorage.removeItem("demo_session");
      return { error: null };
    } else {
      const { error } = await this.client.auth.signOut();
      return { error };
    }
  }

  async getCurrentUser() {
    if (this.isDemoMode) {
      const session = JSON.parse(localStorage.getItem("demo_session") || "null");
      if (!session) return null;

      // Ensure fresh profile data. Prefer the persisted profile, but fall back
      // to the profile captured on the session at sign-in (which carries the
      // role granted by the admin access code) before defaulting to student —
      // so an admin grant is never silently downgraded.
      const profiles = JSON.parse(localStorage.getItem("demo_profiles") || "[]");
      const profile = profiles.find(p => p.id === session.user.id);

      return {
        id: session.user.id,
        email: session.user.email,
        profile: profile || session.user.profile || { role: "student", full_name: "Student Member", assigned_content: [] }
      };
    } else {
      const { data: { user }, error } = await this.client.auth.getUser();
      if (error || !user) return null;

      // Fetch user profile from profiles table
      const { data: profile, error: profileErr } = await this.client
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return {
        id: user.id,
        email: user.email,
        profile: profile || { role: "student", full_name: "Student Member", assigned_content: [] }
      };
    }
  }

  // POSTS DATABASE OPERATIONS
  async getPosts() {
    if (this.isDemoMode) {
      const posts = JSON.parse(localStorage.getItem("demo_posts") || "[]");
      // Sort newest first
      return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      const { data, error } = await this.client
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  }

  async getAdminPosts() {
    // Admins can see draft/unpublished posts
    if (this.isDemoMode) {
      return JSON.parse(localStorage.getItem("demo_posts") || "[]").sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      const { data, error } = await this.client
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
  }

  async getPost(id) {
    if (this.isDemoMode) {
      const posts = JSON.parse(localStorage.getItem("demo_posts") || "[]");
      const post = posts.find(p => p.id === id);
      if (!post) throw new Error("Post not found");
      return post;
    } else {
      const { data, error } = await this.client
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    }
  }

  async createPost(postData) {
    const newPost = {
      title: postData.title,
      body: postData.body,
      excerpt: postData.excerpt || postData.body.replace(/<[^>]*>/g, '').substring(0, 150) + "...",
      type: postData.type || "blog",
      author: postData.author || "NIST Finance Club",
      published: postData.published !== undefined ? postData.published : true,
      created_at: new Date().toISOString()
    };

    if (this.isDemoMode) {
      const posts = JSON.parse(localStorage.getItem("demo_posts") || "[]");
      newPost.id = "post-" + Math.random().toString(36).substr(2, 9);
      posts.push(newPost);
      localStorage.setItem("demo_posts", JSON.stringify(posts));
      return newPost;
    } else {
      const { data, error } = await this.client
        .from("posts")
        .insert([newPost])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }

  async updatePost(id, postData) {
    if (this.isDemoMode) {
      const posts = JSON.parse(localStorage.getItem("demo_posts") || "[]");
      const idx = posts.findIndex(p => p.id === id);
      if (idx === -1) throw new Error("Post not found");

      posts[idx] = {
        ...posts[idx],
        title: postData.title,
        body: postData.body,
        excerpt: postData.excerpt || postData.body.replace(/<[^>]*>/g, '').substring(0, 150) + "...",
        type: postData.type,
        author: postData.author,
        published: postData.published,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem("demo_posts", JSON.stringify(posts));
      return posts[idx];
    } else {
      const { data, error } = await this.client
        .from("posts")
        .update({
          title: postData.title,
          body: postData.body,
          excerpt: postData.excerpt || postData.body.replace(/<[^>]*>/g, '').substring(0, 150) + "...",
          type: postData.type,
          author: postData.author,
          published: postData.published,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }

  async deletePost(id) {
    if (this.isDemoMode) {
      let posts = JSON.parse(localStorage.getItem("demo_posts") || "[]");
      posts = posts.filter(p => p.id !== id);
      localStorage.setItem("demo_posts", JSON.stringify(posts));
      return true;
    } else {
      const { error } = await this.client
        .from("posts")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return true;
    }
  }

  // PROFILES / MEMBERS OPERATIONS (ADMIN ONLY)
  async getProfiles() {
    if (this.isDemoMode) {
      return JSON.parse(localStorage.getItem("demo_profiles") || "[]");
    } else {
      const { data, error } = await this.client
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
  }

  async getProfile(userId) {
    if (this.isDemoMode) {
      const profiles = JSON.parse(localStorage.getItem("demo_profiles") || "[]");
      const profile = profiles.find(p => p.id === userId);
      if (!profile) throw new Error("Profile not found");
      return profile;
    } else {
      const { data, error } = await this.client
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    }
  }

  async assignContent(studentId, assignedContentIds) {
    if (this.isDemoMode) {
      const profiles = JSON.parse(localStorage.getItem("demo_profiles") || "[]");
      const idx = profiles.findIndex(p => p.id === studentId);
      if (idx === -1) throw new Error("Student profile not found");

      profiles[idx].assigned_content = assignedContentIds;
      localStorage.setItem("demo_profiles", JSON.stringify(profiles));
      return profiles[idx];
    } else {
      const { data, error } = await this.client
        .from("profiles")
        .update({
          assigned_content: assignedContentIds
        })
        .eq("id", studentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Update a profile's stored role (e.g. flip between "student" and "admin"
  // from the admin Member Directory). This only changes the persisted role
  // field — it does NOT alter the sign-in access-code gate that grants
  // login-time admin privileges.
  async setProfileRole(id, role) {
    if (this.isDemoMode) {
      const profiles = JSON.parse(localStorage.getItem("demo_profiles") || "[]");
      const idx = profiles.findIndex(p => p.id === id);
      if (idx === -1) throw new Error("Profile not found");

      profiles[idx].role = role;
      localStorage.setItem("demo_profiles", JSON.stringify(profiles));
      return profiles[idx];
    } else {
      const { data, error } = await this.client
        .from("profiles")
        .update({ role })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async deleteProfile(id) {
    if (this.isDemoMode) {
      let profiles = JSON.parse(localStorage.getItem("demo_profiles") || "[]");
      const target = profiles.find(p => p.id === id);
      profiles = profiles.filter(p => p.id !== id);
      localStorage.setItem("demo_profiles", JSON.stringify(profiles));

      // Best-effort cleanup of related data: remove the user's login
      // credentials and any test scores tied to their email.
      let users = JSON.parse(localStorage.getItem("demo_users") || "[]");
      users = users.filter(u => u.id !== id);
      localStorage.setItem("demo_users", JSON.stringify(users));

      if (target && target.email) {
        let scores = JSON.parse(localStorage.getItem("nist_test_scores") || "[]");
        scores = scores.filter(s => s.student_email.toLowerCase() !== target.email.toLowerCase());
        localStorage.setItem("nist_test_scores", JSON.stringify(scores));
      }
      return true;
    } else {
      // Best-effort cleanup of related test scores before removing the profile.
      try {
        const { data: target } = await this.client
          .from("profiles")
          .select("email")
          .eq("id", id)
          .single();
        if (target && target.email) {
          await this.client
            .from("test_scores")
            .delete()
            .eq("student_email", target.email);
        }
      } catch (err) {
        console.error("Failed to clean up related data for profile:", err);
      }

      const { error } = await this.client
        .from("profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    }
  }

  // TESTS OPERATIONS
  async getTests() {
    if (this.isDemoMode) {
      const tests = JSON.parse(localStorage.getItem("nist_tests") || "[]");
      return tests.filter(t => t.published).sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      const { data, error } = await this.client
        .from("tests")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    }
  }

  async getAdminTests() {
    if (this.isDemoMode) {
      return JSON.parse(localStorage.getItem("nist_tests") || "[]")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      const { data, error } = await this.client
        .from("tests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  }

  async getTest(id) {
    if (this.isDemoMode) {
      const tests = JSON.parse(localStorage.getItem("nist_tests") || "[]");
      const test = tests.find(t => t.id === id);
      if (!test) throw new Error("Test not found");
      return test;
    } else {
      const { data, error } = await this.client
        .from("tests")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    }
  }

  async createTest(testData) {
    const newTest = {
      name: testData.name,
      description: testData.description || "",
      date: testData.date,
      max_score: parseInt(testData.max_score) || 100,
      category: testData.category || "Quiz",
      published: testData.published !== undefined ? testData.published : true,
      created_at: new Date().toISOString().split("T")[0]
    };

    if (this.isDemoMode) {
      const tests = JSON.parse(localStorage.getItem("nist_tests") || "[]");
      newTest.id = "t" + Math.random().toString(36).substr(2, 9);
      tests.push(newTest);
      localStorage.setItem("nist_tests", JSON.stringify(tests));
      return newTest;
    } else {
      const { data, error } = await this.client
        .from("tests")
        .insert([newTest])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }

  async updateTest(id, testData) {
    if (this.isDemoMode) {
      const tests = JSON.parse(localStorage.getItem("nist_tests") || "[]");
      const idx = tests.findIndex(t => t.id === id);
      if (idx === -1) throw new Error("Test not found");
      tests[idx] = {
        ...tests[idx],
        name: testData.name,
        description: testData.description || "",
        date: testData.date,
        max_score: parseInt(testData.max_score) || 100,
        category: testData.category || "Quiz",
        published: testData.published !== undefined ? testData.published : true,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem("nist_tests", JSON.stringify(tests));
      return tests[idx];
    } else {
      const { data, error } = await this.client
        .from("tests")
        .update({
          name: testData.name,
          description: testData.description,
          date: testData.date,
          max_score: parseInt(testData.max_score),
          category: testData.category,
          published: testData.published,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }

  async deleteTest(id) {
    if (this.isDemoMode) {
      let tests = JSON.parse(localStorage.getItem("nist_tests") || "[]");
      tests = tests.filter(t => t.id !== id);
      localStorage.setItem("nist_tests", JSON.stringify(tests));
      return true;
    } else {
      const { error } = await this.client
        .from("tests")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return true;
    }
  }

  async getTestScores(studentEmail) {
    if (this.isDemoMode) {
      const scores = JSON.parse(localStorage.getItem("nist_test_scores") || "[]");
      return scores.filter(s => s.student_email.toLowerCase() === studentEmail.toLowerCase());
    } else {
      const { data, error } = await this.client
        .from("test_scores")
        .select("*")
        .eq("student_email", studentEmail);
      if (error) throw error;
      return data;
    }
  }

  async getAllTestScores() {
    if (this.isDemoMode) {
      return JSON.parse(localStorage.getItem("nist_test_scores") || "[]");
    } else {
      const { data, error } = await this.client
        .from("test_scores")
        .select("*");
      if (error) throw error;
      return data;
    }
  }

  async upsertTestScore(scoreData) {
    if (this.isDemoMode) {
      const scores = JSON.parse(localStorage.getItem("nist_test_scores") || "[]");
      const idx = scores.findIndex(
        s => s.test_id === scoreData.test_id &&
             s.student_email.toLowerCase() === scoreData.student_email.toLowerCase()
      );
      if (idx !== -1) {
        scores[idx] = { ...scores[idx], ...scoreData };
      } else {
        scores.push({ id: "s" + Math.random().toString(36).substr(2, 9), ...scoreData });
      }
      localStorage.setItem("nist_test_scores", JSON.stringify(scores));
      return scoreData;
    } else {
      const { data, error } = await this.client
        .from("test_scores")
        .upsert([scoreData], { onConflict: "test_id,student_email" })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }

  // CLUB POSITIONS OPERATIONS
  async getPositions() {
    if (this.isDemoMode) {
      const positions = JSON.parse(localStorage.getItem("nist_positions") || "[]");
      return positions.sort((a, b) => (a.order || 0) - (b.order || 0));
    } else {
      const { data, error } = await this.client
        .from("positions")
        .select("*")
        .order("order", { ascending: true });
      if (error) throw error;
      return data;
    }
  }

  async updatePosition(id, data) {
    if (this.isDemoMode) {
      const positions = JSON.parse(localStorage.getItem("nist_positions") || "[]");
      const idx = positions.findIndex(p => p.id === id);
      if (idx === -1) throw new Error("Position not found");
      positions[idx] = { ...positions[idx], ...data };
      localStorage.setItem("nist_positions", JSON.stringify(positions));
      return positions[idx];
    } else {
      const { data: updated, error } = await this.client
        .from("positions")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return updated;
    }
  }
}

// Instantiate and export database service globally
window.db = new SupabaseService();
