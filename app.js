// NIST Future Financiers - Application Logic & Routing

// Global State
let currentUser = null;
let activeAdminTab = "members"; // 'members' or 'posts'
let activeTestsTab = "manage"; // 'manage' or 'scores'
let postBeingAssignedUser = null; // Store user profile for assignment modal

// Toast Notification Helper
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  // Set icons based on type
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "❌";
  if (type === "warning") icon = "⚠️";

  toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
  container.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 4000);
}

// Router System
async function handleRouting() {
  const hash = window.location.hash || "#home";

  // Dismiss any open sign-in gate modal when navigating between views.
  const signInGate = document.getElementById("signin-gate-modal");
  if (signInGate) signInGate.classList.remove("active");

  // Hide all views first
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  
  // Update nav links active state
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === hash) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Verify auth state for page access
  currentUser = await window.db.getCurrentUser();
  updateNavbar();
  updateConnectionStatusBadge();

  // Route handlers
  if (hash === "#home" || hash === "") {
    showView("home-view");
    renderFeaturedContent();
  } 
  else if (hash === "#positions") {
    showView("positions-view");
    renderPositions();
  } 
  else if (hash === "#about") {
    showView("about-view");
  } 
  else if (hash === "#login") {
    if (currentUser) {
      navigate("#profile");
    } else {
      showView("login-view");
      resetAuthForm();
    }
  } 
  else if (hash === "#profile") {
    if (!currentUser) {
      showToast("Please sign in to access your profile.", "warning");
      navigate("#login");
    } else {
      showView("profile-view");
      renderDashboard();
    }
  } 
  else if (hash === "#blog") {
    showView("blog-view");
    renderBlogList();
  } 
  else if (hash === "#lessons") {
    showView("lessons-view");
    renderLessonsList();
  } 
  else if (hash.startsWith("#post/")) {
    const postId = hash.split("/")[1];
    showView("post-detail-view");
    renderPostDetail(postId);
  } 
  else if (hash.startsWith("#admin-editor")) {
    // Role Guard: Check if admin
    if (!currentUser || currentUser.profile.role !== "admin") {
      showToast("Access denied: Only admins can access the editor.", "error");
      navigate("#home");
    } else {
      showView("editor-view");
      const parts = hash.split("/");
      const postId = parts.length > 1 ? parts[1] : null;
      setupEditorForm(postId);
    }
  }
  else if (hash === "#tests") {
    if (!currentUser) {
      showToast("Please sign in to view your tests.", "warning");
      navigate("#login");
    } else {
      showView("tests-view");
      renderStudentTests();
    }
  }
  else if (hash === "#admin-tests") {
    if (!currentUser || currentUser.profile.role !== "admin") {
      showToast("Access denied: Admin access required.", "error");
      navigate("#home");
    } else {
      showView("admin-tests-view");
      renderAdminTests();
    }
  }
  else if (hash.startsWith("#admin-test-editor")) {
    if (!currentUser || currentUser.profile.role !== "admin") {
      showToast("Access denied: Admin access required.", "error");
      navigate("#home");
    } else {
      showView("admin-test-editor-view");
      const parts = hash.split("/");
      const testId = parts.length > 1 ? parts[1] : null;
      setupTestEditorForm(testId);
    }
  }
  else {
    // 404 fallback
    showView("home-view");
  }
}

// Helper to show a specific view ID
function showView(viewId) {
  const el = document.getElementById(viewId);
  if (el) {
    el.classList.add("active");
    window.scrollTo(0, 0);
  }
}

// Navigational helper
function navigate(hash) {
  window.location.hash = hash;
}

// Update Supabase Connection Status Badge
function updateConnectionStatusBadge() {
  const badges = document.querySelectorAll(".status-badge-container");
  const isDemo = window.db.isDemoMode;
  
  const html = isDemo
    ? `<span class="status-badge status-demo">⚠️ Demo Mode</span>`
    : `<span class="status-badge status-live">Supabase Live</span>`;

  badges.forEach(b => {
    b.innerHTML = html;
  });
}

// Dynamic Navigation Header setup
function updateNavbar() {
  const authNav = document.getElementById("auth-nav-links");
  if (!authNav) return;

  if (currentUser) {
    const isAdmin = currentUser.profile.role === "admin";
    authNav.innerHTML = `
      <li><a href="#blog" class="nav-link">Blog</a></li>
      <li><a href="#lessons" class="nav-link">Lessons</a></li>
      <li><a href="#positions" class="nav-link">Positions</a></li>
      <li><a href="#about" class="nav-link">About Us</a></li>
      ${isAdmin
        ? '<li><a href="#admin-tests" class="nav-link">Tests</a></li>'
        : '<li><a href="#tests" class="nav-link">Tests</a></li>'
      }
      <li><a href="#profile" class="nav-link">Dashboard</a></li>
      ${isAdmin ? '<li><a href="#admin-editor" class="btn btn-secondary btn-sm">＋ Create Post</a></li>' : ''}
      <li><button id="logout-btn" class="btn btn-secondary btn-sm">Log Out</button></li>
    `;
    
    // Add logout event listener
    document.getElementById("logout-btn").addEventListener("click", async () => {
      try {
        await window.db.signOut();
        showToast("Logged out successfully.", "success");
        currentUser = null;
        // Public pages (#home, #positions) can re-render in place after logout.
        // Setting the same hash won't fire hashchange, so re-render manually.
        const currentHash = window.location.hash || "#home";
        if (currentHash === "#home" || currentHash === "#positions" || currentHash === "#about") {
          handleRouting();
        } else {
          navigate("#home");
        }
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  } else {
    authNav.innerHTML = `
      <li><a href="#blog" class="nav-link">Blog</a></li>
      <li><a href="#lessons" class="nav-link">Lessons</a></li>
      <li><a href="#positions" class="nav-link">Positions</a></li>
      <li><a href="#about" class="nav-link">About Us</a></li>
      <li><a href="#login" class="btn btn-primary btn-sm">Sign In / Join</a></li>
    `;
  }
  
  // Re-apply active class
  const hash = window.location.hash || "#home";
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === hash) {
      link.classList.add("active");
    }
  });
}

// LANDING PAGE - Render Featured Content
async function renderFeaturedContent() {
  try {
    const posts = await window.db.getPosts();
    const featuredGrid = document.getElementById("featured-posts-grid");
    if (!featuredGrid) return;

    if (posts.length === 0) {
      featuredGrid.innerHTML = `<p class="text-muted">No content available at the moment.</p>`;
      return;
    }

    // Grab first 3 published posts
    const featured = posts.slice(0, 3);
    featuredGrid.innerHTML = featured.map(post => `
      <div class="card blog-card" onclick="navigate('#post/${post.id}')" style="cursor: pointer;">
        <span class="post-type-badge badge-${post.type}">${post.type}</span>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
        <div class="blog-card-meta">
          <span class="blog-card-author">${post.author}</span>
          <span>${new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
  }
}

// LANDING PAGE - Render Club Positions / Leadership
function positionInitials(holder) {
  if (!holder) return "★";
  const cleaned = holder.split("&")[0].trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "★";
  return parts.map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

async function renderPositions() {
  const grid = document.getElementById("positions-grid");
  if (!grid) return;

  try {
    const positions = await window.db.getPositions();
    const isLoggedIn = !!currentUser;
    const isAdmin = isLoggedIn && currentUser.profile.role === "admin";

    // Visibility: logged out sees only public positions; logged in sees all.
    const visible = isLoggedIn ? positions : positions.filter(p => p.public);

    if (visible.length === 0) {
      grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align:center;">No positions to display.</p>`;
      return;
    }

    grid.innerHTML = visible.map(pos => {
      const isFounder = pos.id === "p1a" || pos.id === "p1b" || pos.id === "p1";
      // A position appears locked to non-admins when it is lockable and currently locked.
      const showLocked = pos.lockable && pos.locked && !isAdmin;

      const cardClasses = [
        "position-card",
        showLocked ? "locked" : "",
        isFounder ? "founder" : ""
      ].filter(Boolean).join(" ");

      const founderPhoto = pos.id === "p1a"
        ? { src: "founder-max.png", alt: "Max Veyder" }
        : pos.id === "p1b"
          ? { src: "founder-oscar.png", alt: "Oscar De Pins" }
          : pos.id === "p2"
            ? { src: "secretary-bea.png", alt: "Bea Naumann" }
            : null;

      const avatar = showLocked
        ? `<div class="position-avatar">🔒</div>`
        : founderPhoto
          ? `<div class="position-avatar position-avatar--photo"><img src="${founderPhoto.src}" alt="${founderPhoto.alt}" class="position-avatar-img"></div>`
          : `<div class="position-avatar">${positionInitials(pos.holder)}</div>`;

      const holderBlock = showLocked
        ? `<span class="position-locked-label">🔒 Locked</span>`
        : `<p class="position-holder">${pos.holder}</p>`;

      // Admin-only inline controls for lockable positions
      let adminControls = "";
      if (isAdmin && pos.lockable) {
        const lockBtnClass = pos.locked ? "lock-toggle locked" : "lock-toggle unlocked";
        const lockBtnLabel = pos.locked ? "🔒 Locked" : "🔓 Unlocked";
        adminControls = `
          <div class="position-admin-controls">
            <button class="${lockBtnClass}" onclick="togglePositionLock('${pos.id}')">${lockBtnLabel}</button>
            <button class="position-edit-btn" onclick="editPosition('${pos.id}')">✎ Edit</button>
          </div>
        `;
      }

      return `
        <div class="${cardClasses}">
          ${avatar}
          <h3 class="position-title">${pos.title}</h3>
          ${holderBlock}
          ${adminControls}
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="text-danger" style="grid-column: 1/-1; text-align:center;">Failed to load positions.</p>`;
  }
}

// ADMIN — Toggle lock state of a position
window.togglePositionLock = async function(id) {
  if (!currentUser || currentUser.profile.role !== "admin") {
    showToast("Only admins can change position locks.", "error");
    return;
  }
  try {
    const positions = await window.db.getPositions();
    const pos = positions.find(p => p.id === id);
    if (!pos) throw new Error("Position not found");
    const updated = await window.db.updatePosition(id, { locked: !pos.locked });
    showToast(`"${pos.title}" is now ${updated.locked ? "locked" : "unlocked"}.`, "success");
    renderPositions();
  } catch (err) {
    showToast("Failed to update position: " + err.message, "error");
  }
};

// ADMIN — Edit holder name of a position
window.editPosition = async function(id) {
  if (!currentUser || currentUser.profile.role !== "admin") {
    showToast("Only admins can edit positions.", "error");
    return;
  }
  try {
    const positions = await window.db.getPositions();
    const pos = positions.find(p => p.id === id);
    if (!pos) throw new Error("Position not found");

    const newHolder = prompt(`Edit holder name for "${pos.title}":`, pos.holder);
    if (newHolder === null) return; // Cancelled
    const trimmed = newHolder.trim();
    if (!trimmed) {
      showToast("Holder name cannot be empty.", "warning");
      return;
    }

    await window.db.updatePosition(id, { holder: trimmed });
    showToast(`Updated holder for "${pos.title}".`, "success");
    renderPositions();
  } catch (err) {
    showToast("Failed to update position: " + err.message, "error");
  }
};

// AUTHENTICATION SCREEN CONTROLS
function resetAuthForm() {
  const authTitle = document.getElementById("auth-title");
  const authSubmitBtn = document.getElementById("auth-submit-btn");
  const nameGroup = document.getElementById("auth-name-group");
  const adminSigninGroup = document.getElementById("auth-admin-signin-group");
  const loginTab = document.getElementById("tab-login");
  const signupTab = document.getElementById("tab-signup");
  
  // Default to Login Tab
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  authTitle.innerText = "Welcome Back";
  authSubmitBtn.innerText = "Sign In";
  nameGroup.style.display = "none";
  // The admin access option is only available on the Sign In tab.
  adminSigninGroup.style.display = "block";
  
  document.getElementById("auth-email").value = "";
  document.getElementById("auth-password").value = "";
  document.getElementById("auth-name").value = "";
  document.getElementById("auth-admin-toggle").checked = false;
  document.getElementById("auth-admin-code-group").style.display = "none";
  document.getElementById("auth-admin-code").value = "";
}

// DASHBOARD RENDERING
async function renderDashboard() {
  const profileDetails = document.getElementById("profile-details-card");
  const dashboardContent = document.getElementById("dashboard-content-area");

  if (!profileDetails || !dashboardContent) return;

  const profile = currentUser.profile;
  const initials = profile.full_name ? profile.full_name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "ST";
  
  // Render Left Side Profile Info
  profileDetails.innerHTML = `
    <div class="profile-avatar">${initials}</div>
    <h3 class="profile-name">${profile.full_name}</h3>
    <p class="profile-email">${currentUser.email}</p>
    <span class="role-badge role-${profile.role}">${profile.role}</span>
    
    <div style="margin-top: 30px; border-top: 1px solid var(--border-color); padding-top: 20px;">
      <p style="font-size: 0.85rem; color: var(--text-secondary);">Registered On: ${new Date(profile.created_at || Date.now()).toLocaleDateString()}</p>
    </div>
  `;

  // Render Right Side Dashboard based on role
  if (profile.role === "student") {
    // Render Student View (Assigned content)
    dashboardContent.innerHTML = `
      <div class="dashboard-section">
        <div class="dashboard-title">
          <h2>Your Assigned Financial Lessons</h2>
        </div>
        <div id="assigned-content-list" class="assigned-list">
          <p class="text-muted">Loading assigned content...</p>
        </div>
      </div>
    `;
    renderStudentAssignedContent();
  } else if (profile.role === "admin") {
    // Render Admin View
    dashboardContent.innerHTML = `
      <div class="dashboard-section">
        <div class="dashboard-title">
          <h2>Admin Control Centre</h2>
        </div>
        
        <div class="admin-tabs">
          <button class="admin-tab ${activeAdminTab === 'members' ? 'active' : ''}" onclick="switchAdminTab('members')">👥 Member Directory</button>
          <button class="admin-tab ${activeAdminTab === 'posts' ? 'active' : ''}" onclick="switchAdminTab('posts')">📝 Manage Posts</button>
        </div>

        <div id="admin-tab-content">
          <!-- Dynamically Rendered -->
        </div>
      </div>
    `;
    renderAdminTabContent();
  }
}

// STUDENT DASHBOARD - Load assigned articles
async function renderStudentAssignedContent() {
  const listContainer = document.getElementById("assigned-content-list");
  if (!listContainer) return;

  try {
    const posts = await window.db.getPosts();
    const assignedIds = currentUser.profile.assigned_content || [];

    const assignedPosts = posts.filter(post => assignedIds.includes(post.id));

    if (assignedPosts.length === 0) {
      listContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px; border-style: dashed;">
          <p class="text-secondary" style="margin-bottom: 15px;">You do not have any assigned lessons yet.</p>
          <p class="text-muted" style="font-size: 0.9rem;">Check back later! The club administrators will assign study modules based on your progress.</p>
          <button class="btn btn-secondary btn-sm" style="margin-top: 15px;" onclick="navigate('#blog')">Explore General Blog</button>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = assignedPosts.map(post => `
      <div class="assigned-card" onclick="navigate('#post/${post.id}')" style="cursor: pointer;">
        <div class="assigned-info">
          <span class="post-type-badge badge-${post.type}" style="margin-bottom: 6px;">${post.type}</span>
          <h4>${post.title}</h4>
          <div class="assigned-meta">
            <span>By ${post.author}</span>
            <span>•</span>
            <span>Published ${new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <button class="btn btn-primary btn-sm">Read Lesson</button>
      </div>
    `).join("");
  } catch (err) {
    listContainer.innerHTML = `<p class="text-danger">Failed to load content: ${err.message}</p>`;
  }
}

// ADMIN TABS SWITCHING
window.switchAdminTab = function(tabName) {
  activeAdminTab = tabName;
  renderAdminTabContent();
};

async function renderAdminTabContent() {
  const tabContent = document.getElementById("admin-tab-content");
  if (!tabContent) return;

  tabContent.innerHTML = `<p class="text-muted">Loading...</p>`;

  if (activeAdminTab === "members") {
    try {
      const profiles = await window.db.getProfiles();
      const posts = await window.db.getPosts();

      tabContent.innerHTML = `
        <p class="text-muted" style="margin-bottom: 16px;">View all registered students and assign literacy modules or commentaries to their dashboards.</p>
        <div class="directory-table-container">
          <table class="directory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Assigned Items</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${profiles.map(p => {
                const count = p.assigned_content ? p.assigned_content.length : 0;
                const badgeClass = p.role === "admin" ? "role-admin" : "role-student";
                const isSelf = currentUser && p.id === currentUser.id;

                // Build the row's action buttons. Admins can assign content to
                // students, toggle any other member's stored role, and remove
                // student accounts. An admin's own row is never given role/remove
                // controls to avoid disrupting the active session.
                const actions = [];
                if (p.role === 'student') {
                  actions.push(`<button class="btn btn-primary btn-sm" onclick="openAssignmentModal('${p.id}')">Assign Content</button>`);
                }
                if (!isSelf) {
                  const toggleLabel = p.role === 'admin' ? 'Remove Admin' : 'Make Admin';
                  actions.push(`<button class="btn btn-secondary btn-sm" onclick="toggleMemberRole('${p.id}')">${toggleLabel}</button>`);
                }
                if (p.role === 'student' && !isSelf) {
                  actions.push(`<button class="btn btn-danger btn-sm" onclick="deleteMember('${p.id}')">Remove</button>`);
                }
                if (actions.length === 0) {
                  actions.push(`<span class="text-muted">N/A (You)</span>`);
                }

                return `
                  <tr>
                    <td><strong>${p.full_name || 'N/A'}</strong></td>
                    <td>${p.email}</td>
                    <td><span class="role-badge ${badgeClass}" style="margin:0; font-size:0.75rem;">${p.role}</span></td>
                    <td>${count} articles</td>
                    <td>
                      <div class="directory-actions">
                        ${actions.join("")}
                      </div>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      tabContent.innerHTML = `<p class="text-danger">Error loading members: ${err.message}</p>`;
    }
  } else if (activeAdminTab === "posts") {
    try {
      const posts = await window.db.getAdminPosts();

      tabContent.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <p class="text-muted" style="margin:0;">Manage all published articles, lessons, and commentaries.</p>
          <button class="btn btn-primary btn-sm" onclick="navigate('#admin-editor')">＋ New Post</button>
        </div>
        <div class="post-manager-list">
          ${posts.length === 0 ? '<p class="text-muted">No posts found.</p>' : posts.map(post => `
            <div class="post-manager-item">
              <div class="post-manager-info">
                <span class="post-type-badge badge-${post.type}" style="margin-bottom:6px;">${post.type}</span>
                <h4>${post.title}</h4>
                <div class="post-manager-meta">
                  <span>Author: ${post.author}</span>
                  <span>•</span>
                  <span>Date: ${new Date(post.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span style="color: ${post.published ? 'var(--accent)' : 'var(--warning)'}; font-weight:600;">
                    ${post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <div class="post-manager-actions">
                <button class="btn btn-secondary btn-sm" onclick="navigate('#admin-editor/${post.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deletePost('${post.id}')">Delete</button>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    } catch (err) {
      tabContent.innerHTML = `<p class="text-danger">Error loading posts: ${err.message}</p>`;
    }
  }
}

// DELETE POST handler
window.deletePost = async function(postId) {
  if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
    try {
      await window.db.deletePost(postId);
      showToast("Post deleted successfully.", "success");
      renderAdminTabContent();
    } catch (err) {
      showToast(err.message, "error");
    }
  }
};

// DELETE MEMBER handler (admin removes a student from the Member Directory)
window.deleteMember = async function(memberId) {
  // Guard: only admins can remove members.
  if (!currentUser || currentUser.profile.role !== "admin") {
    showToast("Access denied: Only admins can remove members.", "error");
    return;
  }

  // Guard: never let an admin delete their own currently-logged-in account.
  if (memberId === currentUser.id) {
    showToast("You cannot remove your own account.", "warning");
    return;
  }

  try {
    const profile = await window.db.getProfile(memberId);

    // Guard: only students can be removed from the directory.
    if (profile.role !== "student") {
      showToast("Only student accounts can be removed.", "warning");
      return;
    }

    if (confirm(`Are you sure you want to remove ${profile.full_name || "this member"}? This action cannot be undone.`)) {
      await window.db.deleteProfile(memberId);
      showToast("Member removed successfully.", "success");
      renderAdminTabContent();
    }
  } catch (err) {
    showToast(err.message, "error");
  }
};

// TOGGLE MEMBER ROLE handler (admin flips a member's stored role between
// student and admin in the Member Directory). This only changes the persisted
// `role` field shown by the directory — login-time admin powers are still gated
// solely by the access code in the sign-in flow.
window.toggleMemberRole = async function(memberId) {
  // Guard: only admins can change member roles.
  if (!currentUser || currentUser.profile.role !== "admin") {
    showToast("Access denied: Only admins can change member roles.", "error");
    return;
  }

  // Guard: never let an admin change their own currently-logged-in role, to
  // avoid confusing the active session.
  if (memberId === currentUser.id) {
    showToast("You cannot change your own role here.", "warning");
    return;
  }

  try {
    const profile = await window.db.getProfile(memberId);
    const newRole = profile.role === "admin" ? "student" : "admin";

    await window.db.setProfileRole(memberId, newRole);

    const name = profile.full_name || "Member";
    showToast(`${name} is now ${newRole === "admin" ? "an admin" : "a student"}.`, "success");
    renderAdminTabContent();
  } catch (err) {
    showToast(err.message, "error");
  }
};

// ASSIGNMENT MODAL CONTROL
window.openAssignmentModal = async function(studentId) {
  try {
    postBeingAssignedUser = await window.db.getProfile(studentId);
    const posts = await window.db.getPosts(); // Only assign published posts
    
    const modal = document.getElementById("assignment-modal");
    const modalTitle = document.getElementById("modal-student-name");
    const modalBody = document.getElementById("assignment-list-container");

    if (!modal || !modalBody) return;

    modalTitle.innerText = postBeingAssignedUser.full_name;
    const assignedIds = postBeingAssignedUser.assigned_content || [];

    modalBody.innerHTML = posts.map(post => {
      const isChecked = assignedIds.includes(post.id) ? "checked" : "";
      return `
        <div class="assignment-item" onclick="toggleCheckbox('chk-${post.id}')">
          <input type="checkbox" id="chk-${post.id}" value="${post.id}" ${isChecked} onclick="event.stopPropagation()">
          <label for="chk-${post.id}">
            <strong>[${post.type.toUpperCase()}]</strong> ${post.title}
          </label>
        </div>
      `;
    }).join("");

    modal.classList.add("active");
  } catch (err) {
    showToast("Error loading assignment options: " + err.message, "error");
  }
};

window.toggleCheckbox = function(checkboxId) {
  const cb = document.getElementById(checkboxId);
  if (cb) cb.checked = !cb.checked;
};

window.closeAssignmentModal = function() {
  const modal = document.getElementById("assignment-modal");
  if (modal) modal.classList.remove("active");
  postBeingAssignedUser = null;
};

// Handle Assignment Save
document.getElementById("btn-save-assignments")?.addEventListener("click", async () => {
  if (!postBeingAssignedUser) return;
  
  const selectedIds = [];
  document.querySelectorAll("#assignment-list-container input[type='checkbox']").forEach(cb => {
    if (cb.checked) {
      selectedIds.push(cb.value);
    }
  });

  try {
    await window.db.assignContent(postBeingAssignedUser.id, selectedIds);
    showToast("Content assignments updated successfully.", "success");
    closeAssignmentModal();
    renderDashboard(); // Re-render directory count
  } catch (err) {
    showToast("Failed to update assignments: " + err.message, "error");
  }
});

// SIGN-IN GATE MODAL (prompts logged-out users to sign in before viewing lessons)
window.openSignInGateModal = function() {
  const modal = document.getElementById("signin-gate-modal");
  if (modal) modal.classList.add("active");
};

window.closeSignInGateModal = function() {
  const modal = document.getElementById("signin-gate-modal");
  if (modal) modal.classList.remove("active");
};

window.goToSignInFromGate = function() {
  closeSignInGateModal();
  navigate("#login");
};

// Card-level guard: called when a logged-out visitor clicks a lesson card.
// Shows the sign-in prompt instead of opening the lesson.
window.requireSignInForLesson = function() {
  openSignInGateModal();
};

// Allow Esc to dismiss the sign-in gate modal, leaving the user on the page.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("signin-gate-modal");
    if (modal && modal.classList.contains("active")) {
      closeSignInGateModal();
    }
  }
});

// BLOG LIST RENDER (with Filter & Search)
let allPosts = [];
let currentCategoryFilter = "all";

async function renderBlogList() {
  const grid = document.getElementById("posts-grid");
  if (!grid) return;

  grid.innerHTML = `<p class="text-muted">Loading posts...</p>`;

  try {
    // The Blog page shows Articles (blog) and Market Updates (commentary) only.
    // Lessons live on their own dedicated #lessons page.
    const posts = await window.db.getPosts();
    allPosts = posts.filter(p => p.type === "blog" || p.type === "commentary");
    applyBlogFiltersAndRender();
  } catch (err) {
    grid.innerHTML = `<p class="text-danger">Failed to load blog posts: ${err.message}</p>`;
  }
}

window.filterCategory = function(category, buttonEl) {
  currentCategoryFilter = category;
  
  // Update button active state (scoped to the blog view so the Lessons page
  // pill keeps its own active state).
  document.querySelectorAll("#blog-view .filter-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  if (buttonEl) buttonEl.classList.add("active");

  applyBlogFiltersAndRender();
};

function applyBlogFiltersAndRender() {
  const grid = document.getElementById("posts-grid");
  const searchQuery = document.getElementById("blog-search").value.toLowerCase();
  
  if (!grid) return;

  let filtered = allPosts;

  // Apply category filter
  if (currentCategoryFilter !== "all") {
    filtered = filtered.filter(p => p.type === currentCategoryFilter);
  }

  // Apply search query
  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchQuery) || 
      p.excerpt.toLowerCase().includes(searchQuery) ||
      p.author.toLowerCase().includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">No articles match your search criteria.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(post => `
    <div class="card blog-card" onclick="navigate('#post/${post.id}')" style="cursor: pointer;">
      <span class="post-type-badge badge-${post.type}">${post.type}</span>
      <h3 class="blog-card-title">${post.title}</h3>
      <p class="blog-card-excerpt">${post.excerpt}</p>
      <div class="blog-card-meta">
        <span class="blog-card-author">${post.author}</span>
        <span>${new Date(post.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  `).join("");
}

// Add event listener to search input
document.getElementById("blog-search")?.addEventListener("input", applyBlogFiltersAndRender);

// LESSONS LIST RENDER (Lessons-only page with live Search)
let allLessons = [];

async function renderLessonsList() {
  const grid = document.getElementById("lessons-grid");
  if (!grid) return;

  grid.innerHTML = `<p class="text-muted">Loading lessons...</p>`;

  try {
    // The Lessons page shows ONLY posts of type 'lesson'.
    const posts = await window.db.getPosts();
    allLessons = posts.filter(p => p.type === "lesson");
    applyLessonsFiltersAndRender();
  } catch (err) {
    grid.innerHTML = `<p class="text-danger">Failed to load lessons: ${err.message}</p>`;
  }
}

function applyLessonsFiltersAndRender() {
  const grid = document.getElementById("lessons-grid");
  if (!grid) return;

  const searchInput = document.getElementById("lessons-search");
  const searchQuery = searchInput ? searchInput.value.toLowerCase() : "";

  let filtered = allLessons;

  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchQuery) ||
      p.excerpt.toLowerCase().includes(searchQuery) ||
      p.author.toLowerCase().includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">No lessons match your search criteria.</p>`;
    return;
  }

  // Lessons are members-only: logged-out visitors get a sign-in prompt on click
  // instead of navigating to the single-post view. Logged-in users open lessons
  // normally.
  const isLoggedIn = !!currentUser;

  grid.innerHTML = filtered.map(post => {
    const clickHandler = isLoggedIn
      ? `navigate('#post/${post.id}')`
      : `requireSignInForLesson()`;
    const lockBadge = isLoggedIn
      ? ""
      : `<span class="lesson-lock-hint">🔒 Members only</span>`;
    return `
    <div class="card blog-card" onclick="${clickHandler}" style="cursor: pointer;">
      <span class="post-type-badge badge-${post.type}">${post.type}</span>
      <h3 class="blog-card-title">${post.title}</h3>
      <p class="blog-card-excerpt">${post.excerpt}</p>
      <div class="blog-card-meta">
        <span class="blog-card-author">${post.author}</span>
        <span>${new Date(post.created_at).toLocaleDateString()}</span>
      </div>
      ${lockBadge}
    </div>
  `;
  }).join("");
}

// Add event listener to lessons search input
document.getElementById("lessons-search")?.addEventListener("input", applyLessonsFiltersAndRender);

// SINGLE POST DETAIL RENDER
async function renderPostDetail(postId) {
  const container = document.getElementById("post-detail-container");
  if (!container) return;

  container.innerHTML = `<p class="text-muted">Loading post details...</p>`;

  try {
    const post = await window.db.getPost(postId);

    // Route guard: lessons are members-only. If a logged-out visitor navigates
    // directly to a lesson URL, do NOT render the lesson body. Show a sign-in
    // prompt instead. Blog articles and market commentary stay public.
    if (post.type === "lesson" && !currentUser) {
      container.innerHTML = `
        <a href="#lessons" class="post-back-btn">← Back to Lessons</a>
        <div class="card" style="text-align:center; padding: 40px;">
          <div style="font-size:2.4rem; margin-bottom: 12px;">🔒</div>
          <p style="font-size:1.3rem; font-weight:700; color:var(--sbux-house); margin-bottom: 10px;">Sign in to view this lesson</p>
          <p class="text-muted" style="margin-bottom: 24px;">Our financial literacy lessons are reserved for NIST Future Financiers members.</p>
          <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
            <a href="#lessons" class="btn btn-secondary">Back to Lessons</a>
            <a href="#login" class="btn btn-primary">Sign In</a>
          </div>
        </div>
      `;
      openSignInGateModal();
      return;
    }

    // Check if current user is assigned to this post (if student)
    let assignedBanner = "";
    if (currentUser && currentUser.profile.role === "student") {
      const assigned = currentUser.profile.assigned_content || [];
      if (assigned.includes(post.id)) {
        assignedBanner = `
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 24px; color: #34d399; font-size: 0.9rem; font-weight:600; display:flex; align-items:center; gap:8px;">
            🎓 This module has been officially assigned to you by a NIST Advisor.
          </div>
        `;
      }
    }

    // Lessons return to the Lessons page; articles/commentary return to the Blog page.
    const backHref = post.type === "lesson" ? "#lessons" : "#blog";
    const backLabel = post.type === "lesson" ? "← Back to Lessons" : "← Back to Blog";

    container.innerHTML = `
      <a href="${backHref}" class="post-back-btn">${backLabel}</a>
      ${assignedBanner}
      <article class="card">
        <header class="post-header">
          <span class="post-type-badge badge-${post.type}">${post.type}</span>
          <h1 class="post-title">${post.title}</h1>
          <div class="post-meta-details">
            <span>By <strong>${post.author}</strong></span>
            <span>•</span>
            <span>Published ${new Date(post.created_at).toLocaleDateString()}</span>
            ${!post.published ? '<span style="color:var(--warning); font-weight:bold;">(DRAFT)</span>' : ''}
          </div>
        </header>
        <div class="post-body">
          ${post.body}
        </div>
      </article>
    `;
  } catch (err) {
    container.innerHTML = `
      <a href="#blog" class="post-back-btn">← Back to Blog</a>
      <div class="card" style="text-align:center; padding: 40px;">
        <p class="text-danger" style="font-size:1.2rem; margin-bottom: 10px;">Post Not Found</p>
        <p class="text-muted">The article or lesson you are trying to view does not exist or has been removed.</p>
      </div>
    `;
  }
}

// ADMIN POST EDITOR SETUP
let currentEditingPostId = null;

async function setupEditorForm(postId) {
  const titleInput = document.getElementById("editor-title-field");
  const authorInput = document.getElementById("editor-author-field");
  const typeInput = document.getElementById("editor-type-field");
  const bodyInput = document.getElementById("editor-body-field");
  const publishedInput = document.getElementById("editor-publish-field");
  const viewTitle = document.getElementById("editor-view-title");

  currentEditingPostId = postId;

  if (postId) {
    viewTitle.innerText = "Edit Published Content";
    try {
      const post = await window.db.getPost(postId);
      titleInput.value = post.title;
      authorInput.value = post.author;
      typeInput.value = post.type;
      bodyInput.value = post.body;
      publishedInput.checked = post.published;
    } catch (err) {
      showToast("Error loading post for editing: " + err.message, "error");
      navigate("#profile");
    }
  } else {
    viewTitle.innerText = "Create New Content";
    titleInput.value = "";
    authorInput.value = currentUser.profile.full_name || "NIST Advisor";
    typeInput.value = "lesson";
    bodyInput.value = "";
    publishedInput.checked = true;
  }
}

// Handle Editor Submit
document.getElementById("editor-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const postData = {
    title: document.getElementById("editor-title-field").value,
    author: document.getElementById("editor-author-field").value,
    type: document.getElementById("editor-type-field").value,
    body: document.getElementById("editor-body-field").value,
    published: document.getElementById("editor-publish-field").checked
  };

  if (!postData.title.trim() || !postData.body.trim()) {
    showToast("Title and Body are required fields.", "warning");
    return;
  }

  try {
    if (currentEditingPostId) {
      await window.db.updatePost(currentEditingPostId, postData);
      showToast("Post updated successfully.", "success");
    } else {
      await window.db.createPost(postData);
      showToast("New post published successfully.", "success");
    }
    navigate("#profile");
  } catch (err) {
    showToast("Save failed: " + err.message, "error");
  }
});

// Setup Settings credentials panel
document.getElementById("btn-save-credentials")?.addEventListener("click", () => {
  const url = document.getElementById("setup-url").value.trim();
  const key = document.getElementById("setup-key").value.trim();

  if (!url || !key) {
    // Revert to Demo Mode
    window.db.setCredentials(null, null);
    showToast("Reverted to local Demo Mode fallback.", "warning");
  } else {
    const connected = window.db.setCredentials(url, key);
    if (connected) {
      showToast("Connected to live Supabase backend!", "success");
    } else {
      showToast("Credentials saved but initialization failed. Running in Demo Mode.", "error");
    }
  }
  updateConnectionStatusBadge();
  updateNavbar();
  handleRouting(); // Reload content
});

// Initialize form settings inputs
function loadSettingsInputs() {
  const creds = window.db.getCredentials();
  const urlInput = document.getElementById("setup-url");
  const keyInput = document.getElementById("setup-key");
  
  if (urlInput && keyInput) {
    urlInput.value = creds.url;
    keyInput.value = creds.key;
  }
}

// AUTHENTICATION FORMS SUBMISSIONS
document.getElementById("auth-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value;
  const name = document.getElementById("auth-name").value.trim();
  const adminCode = document.getElementById("auth-admin-code").value.trim();
  
  const isSignUp = document.getElementById("tab-signup").classList.contains("active");

  if (!email || !password) {
    showToast("Please fill in email and password fields.", "warning");
    return;
  }

  // Admin access code is the only way to obtain admin privileges, and it is
  // available exclusively on the Sign In flow.
  const ADMIN_ACCESS_CODE = "nepobaby123";

  try {
    if (isSignUp) {
      if (!name) {
        showToast("Please enter your name.", "warning");
        return;
      }

      // All new registrations are created as students. There is no way to
      // register as an admin.
      await window.db.signUp(email, password, name, "student");
      showToast("Account created successfully!", "success");
    } else {
      // If an admin access code is supplied it must match exactly. A blank
      // code signs the user in as a regular student.
      let asAdmin = false;
      if (adminCode) {
        if (adminCode !== ADMIN_ACCESS_CODE) {
          showToast("Incorrect admin access code.", "error");
          return;
        }
        asAdmin = true;
      }

      await window.db.signIn(email, password, asAdmin);
      showToast(asAdmin ? "Welcome back, Admin!" : "Welcome back!", "success");
    }
    
    // Refresh session and redirect
    currentUser = await window.db.getCurrentUser();
    navigate("#profile");
  } catch (err) {
    showToast(err.message, "error");
  }
});

// Handle Auth Tabs toggling
document.getElementById("tab-login")?.addEventListener("click", () => {
  resetAuthForm();
});

document.getElementById("tab-signup")?.addEventListener("click", () => {
  const authTitle = document.getElementById("auth-title");
  const authSubmitBtn = document.getElementById("auth-submit-btn");
  const nameGroup = document.getElementById("auth-name-group");
  const adminSigninGroup = document.getElementById("auth-admin-signin-group");
  
  document.getElementById("tab-signup").classList.add("active");
  document.getElementById("tab-login").classList.remove("active");
  
  authTitle.innerText = "Create Your Account";
  authSubmitBtn.innerText = "Sign Up";
  nameGroup.style.display = "block";
  // Admin access is a Sign In only option — hide and reset it on Register.
  adminSigninGroup.style.display = "none";
  document.getElementById("auth-admin-toggle").checked = false;
  document.getElementById("auth-admin-code-group").style.display = "none";
  document.getElementById("auth-admin-code").value = "";
});

// Admin sign-in toggle: reveal/hide the admin access code field.
document.getElementById("auth-admin-toggle")?.addEventListener("change", (e) => {
  const adminCodeGroup = document.getElementById("auth-admin-code-group");
  if (e.target.checked) {
    adminCodeGroup.style.display = "block";
  } else {
    adminCodeGroup.style.display = "none";
    document.getElementById("auth-admin-code").value = "";
  }
});

// Global Event Listeners
window.addEventListener("hashchange", handleRouting);

window.addEventListener("DOMContentLoaded", () => {
  updateConnectionStatusBadge();
  loadSettingsInputs();
  handleRouting();
});

// ============================================================
// TESTS FEATURE
// ============================================================

// STUDENT TESTS VIEW
async function renderStudentTests() {
  const container = document.getElementById("tests-view");
  if (!container) return;

  container.innerHTML = `<div class="container view-body"><p class="text-muted">Loading tests...</p></div>`;

  try {
    const [tests, scores] = await Promise.all([
      window.db.getTests(),
      window.db.getTestScores(currentUser.email)
    ]);

    const scoredMap = {};
    scores.forEach(s => { scoredMap[s.test_id] = s; });

    const myScoreTests = tests.filter(t => scoredMap[t.id]);
    const upcomingTests = tests
      .filter(t => !scoredMap[t.id])
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const todayStr = new Date().toISOString().split("T")[0];

    const myScoresHtml = myScoreTests.length === 0
      ? `<div class="card" style="text-align:center;padding:40px;border-style:dashed;"><p class="text-muted">No test scores yet. Check back after your first test!</p></div>`
      : myScoreTests.map(test => {
          const s = scoredMap[test.id];
          const pct = Math.round((s.score / s.max_score) * 100);
          return `
            <div class="test-score-card">
              <div class="test-score-left">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                  <span class="pill-${test.category.toLowerCase()}">${test.category}</span>
                  <h4 style="font-size:1rem;font-weight:700;color:var(--sbux-house);margin:0;">${test.name}</h4>
                </div>
                <div class="score-bar-track">
                  <div class="score-bar" data-width="${pct}" style="width:0%;"></div>
                </div>
                <p style="font-size:0.82rem;color:var(--text-secondary);margin-top:6px;">
                  <strong>${s.score}</strong> / ${s.max_score} &mdash; ${pct}%
                </p>
              </div>
              <div class="test-score-right">
                <span class="score-badge ${s.passed ? 'pass' : 'fail'}">${s.passed ? 'Passed' : 'Failed'}</span>
                <p style="font-size:0.72rem;color:var(--text-muted);margin-top:8px;text-align:right;">
                  Graded<br>${new Date(s.graded_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          `;
        }).join("")
    ;

    const upcomingHtml = upcomingTests.length === 0
      ? `<div class="card" style="text-align:center;padding:40px;border-style:dashed;"><p class="text-muted">No upcoming tests at the moment.</p></div>`
      : upcomingTests.map(test => {
          const testDate = new Date(test.date + "T00:00:00");
          const isPast = test.date < todayStr;
          const month = testDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
          const day = testDate.getDate();
          return `
            <div class="upcoming-test-card">
              <div class="upcoming-date-badge">
                <span class="date-month">${month}</span>
                <span class="date-day">${day}</span>
              </div>
              <div class="upcoming-test-info">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                  <span class="pill-${test.category.toLowerCase()}">${test.category}</span>
                  ${isPast ? '<span class="missed-badge">Missed</span>' : ''}
                </div>
                <h4 style="font-size:1rem;font-weight:700;color:var(--sbux-house);margin-bottom:4px;">${test.name}</h4>
                <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.55;">${test.description}</p>
              </div>
            </div>
          `;
        }).join("")
    ;

    container.innerHTML = `
      <div class="container view-body">
        <h2 class="section-header" style="margin-bottom:var(--space-6);">My Tests</h2>

        <div style="margin-bottom:var(--space-7);">
          <h3 class="tests-section-heading">My Scores</h3>
          <div class="tests-list">${myScoresHtml}</div>
        </div>

        <div>
          <h3 class="tests-section-heading">Upcoming Tests</h3>
          <div class="tests-list">${upcomingHtml}</div>
        </div>
      </div>
    `;

    // Animate score bars after render
    requestAnimationFrame(() => {
      document.querySelectorAll(".score-bar[data-width]").forEach(bar => {
        bar.style.width = bar.dataset.width + "%";
      });
    });
  } catch (err) {
    container.innerHTML = `<div class="container view-body"><p class="text-danger">Failed to load tests: ${err.message}</p></div>`;
  }
}

// ADMIN TESTS VIEW
async function renderAdminTests() {
  const container = document.getElementById("admin-tests-view");
  if (!container) return;

  container.innerHTML = `
    <div class="container view-body">
      <div class="dashboard-section">
        <div class="dashboard-title">
          <h2>Tests Management</h2>
        </div>

        <div class="admin-tabs" style="margin-top:var(--space-4);">
          <button class="admin-tab ${activeTestsTab === 'manage' ? 'active' : ''}" onclick="switchTestsTab('manage')">📋 Manage Tests</button>
          <button class="admin-tab ${activeTestsTab === 'scores' ? 'active' : ''}" onclick="switchTestsTab('scores')">📊 Assign Scores</button>
        </div>

        <div id="tests-tab-content">
          <p class="text-muted">Loading...</p>
        </div>
      </div>
    </div>
  `;

  renderTestsTabContent();
}

window.switchTestsTab = function(tabName) {
  activeTestsTab = tabName;
  renderAdminTests();
};

async function renderTestsTabContent() {
  const tabContent = document.getElementById("tests-tab-content");
  if (!tabContent) return;

  tabContent.innerHTML = `<p class="text-muted">Loading...</p>`;

  try {
    if (activeTestsTab === "manage") {
      const tests = await window.db.getAdminTests();

      tabContent.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;margin-top:var(--space-3);">
          <p class="text-muted" style="margin:0;">Manage all published tests, quizzes, and assignments.</p>
          <button class="btn btn-primary btn-sm" onclick="navigate('#admin-test-editor')">＋ New Test</button>
        </div>
        <div class="post-manager-list">
          ${tests.length === 0
            ? '<p class="text-muted">No tests found. Create your first test above.</p>'
            : tests.map(test => `
                <div class="admin-test-row">
                  <div class="post-manager-info">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                      <span class="pill-${test.category.toLowerCase()}">${test.category}</span>
                      <span style="font-size:0.78rem;font-weight:600;color:${test.published ? 'var(--sbux-accent)' : 'var(--warning)'};">
                        ${test.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h4 style="font-size:0.96rem;font-weight:700;margin-bottom:4px;color:var(--sbux-house);">${test.name}</h4>
                    <div class="post-manager-meta">
                      <span>Date: ${new Date(test.date + "T00:00:00").toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Max Score: ${test.max_score}</span>
                    </div>
                  </div>
                  <div class="post-manager-actions">
                    <button class="btn btn-secondary btn-sm" onclick="navigate('#admin-test-editor/${test.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTest('${test.id}')">Delete</button>
                  </div>
                </div>
              `).join("")
          }
        </div>
      `;
    } else if (activeTestsTab === "scores") {
      const [profiles, tests, allScores] = await Promise.all([
        window.db.getProfiles(),
        window.db.getAdminTests(),
        window.db.getAllTestScores()
      ]);

      const students = profiles.filter(p => p.role === "student");

      tabContent.innerHTML = `
        <div style="margin-top:var(--space-3);">
          <p class="text-muted" style="margin-bottom:var(--space-4);">Select a student and a test to record or update their score.</p>
          <div class="score-assign-form card">
            <form id="assign-score-form">
              <div class="editor-form-row">
                <div class="form-group">
                  <label for="score-student">Student</label>
                  <select id="score-student" class="form-control">
                    <option value="">— Select Student —</option>
                    ${students.map(s => `<option value="${s.email}">${s.full_name} (${s.email})</option>`).join("")}
                  </select>
                </div>
                <div class="form-group">
                  <label for="score-test">Test</label>
                  <select id="score-test" class="form-control">
                    <option value="">— Select Test —</option>
                    ${tests.map(t => `<option value="${t.id}" data-max="${t.max_score}">${t.name}</option>`).join("")}
                  </select>
                </div>
              </div>
              <div class="editor-form-row">
                <div class="form-group">
                  <label for="score-value">Score</label>
                  <input type="number" id="score-value" class="form-control" min="0" placeholder="e.g. 87">
                </div>
                <div class="form-group">
                  <label for="score-max-display">Max Score</label>
                  <input type="text" id="score-max-display" class="form-control" readonly placeholder="Select a test first" style="background:var(--bg-inset);cursor:default;">
                </div>
              </div>
              <div class="form-group checkbox-group" style="margin-bottom:var(--space-4);">
                <input type="checkbox" id="score-passed">
                <label for="score-passed" style="font-size:0.9rem;">Mark as Passed</label>
              </div>
              <div id="score-saved-banner" class="score-saved-banner" style="display:none;">
                ✅ Score saved successfully!
              </div>
              <div style="display:flex;justify-content:flex-start;margin-top:var(--space-3);">
                <button type="submit" class="btn btn-primary btn-sm">Save Score</button>
              </div>
            </form>
          </div>
        </div>
      `;

      function autoFillExistingScore() {
        const studentEmail = document.getElementById("score-student")?.value;
        const testId = document.getElementById("score-test")?.value;
        if (!studentEmail || !testId) return;
        const existing = allScores.find(
          s => s.student_email.toLowerCase() === studentEmail.toLowerCase() && s.test_id === testId
        );
        if (existing) {
          document.getElementById("score-value").value = existing.score;
          document.getElementById("score-passed").checked = existing.passed;
        } else {
          document.getElementById("score-value").value = "";
          document.getElementById("score-passed").checked = false;
        }
      }

      document.getElementById("score-test")?.addEventListener("change", (e) => {
        const option = e.target.selectedOptions[0];
        document.getElementById("score-max-display").value =
          option?.dataset?.max ? `${option.dataset.max} points` : "";
        autoFillExistingScore();
      });

      document.getElementById("score-student")?.addEventListener("change", autoFillExistingScore);

      document.getElementById("assign-score-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const studentEmail = document.getElementById("score-student").value;
        const testId = document.getElementById("score-test").value;
        const scoreVal = parseInt(document.getElementById("score-value").value);
        const passed = document.getElementById("score-passed").checked;

        if (!studentEmail || !testId || isNaN(scoreVal)) {
          showToast("Please fill in all required fields.", "warning");
          return;
        }

        const selectedTest = tests.find(t => t.id === testId);

        try {
          await window.db.upsertTestScore({
            test_id: testId,
            student_email: studentEmail,
            score: scoreVal,
            max_score: selectedTest?.max_score || 100,
            passed,
            graded_at: new Date().toISOString().split("T")[0]
          });
          showToast("Score saved successfully.", "success");
          const banner = document.getElementById("score-saved-banner");
          if (banner) {
            banner.style.display = "block";
            setTimeout(() => { banner.style.display = "none"; }, 3000);
          }
        } catch (err) {
          showToast("Failed to save score: " + err.message, "error");
        }
      });
    }
  } catch (err) {
    tabContent.innerHTML = `<p class="text-danger">Error loading content: ${err.message}</p>`;
  }
}

window.deleteTest = async function(testId) {
  if (confirm("Are you sure you want to delete this test? This action cannot be undone.")) {
    try {
      await window.db.deleteTest(testId);
      showToast("Test deleted successfully.", "success");
      renderTestsTabContent();
    } catch (err) {
      showToast(err.message, "error");
    }
  }
};

// ADMIN TEST EDITOR
let currentEditingTestId = null;

async function setupTestEditorForm(testId) {
  const container = document.getElementById("admin-test-editor-view");
  if (!container) return;

  currentEditingTestId = testId;

  container.innerHTML = `
    <div class="container view-body">
      <div class="editor-container card">
        <h2 class="editor-title">${testId ? 'Edit Test' : 'Create New Test'}</h2>
        <form id="test-editor-form">
          <div class="form-group">
            <label for="test-name-field">Test Name</label>
            <input type="text" id="test-name-field" class="form-control" placeholder="e.g. Investment Basics Quiz" required>
          </div>

          <div class="form-group">
            <label for="test-description-field">Description</label>
            <textarea id="test-description-field" class="form-control" rows="3" placeholder="Brief description of what this test covers..."></textarea>
          </div>

          <div class="editor-form-row">
            <div class="form-group">
              <label for="test-date-field">Test Date</label>
              <input type="date" id="test-date-field" class="form-control" required>
            </div>

            <div class="form-group">
              <label for="test-max-score-field">Max Score</label>
              <input type="number" id="test-max-score-field" class="form-control" min="1" value="100" required>
            </div>
          </div>

          <div class="form-group">
            <label for="test-category-field">Category</label>
            <select id="test-category-field" class="form-control">
              <option value="Quiz">Quiz</option>
              <option value="Exam">Exam</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>

          <div class="form-group checkbox-group" style="margin-top:15px;">
            <input type="checkbox" id="test-published-field" checked>
            <label for="test-published-field">Publish immediately (visible to students)</label>
          </div>

          <div class="editor-actions">
            <a href="#admin-tests" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">${testId ? 'Update Test' : 'Create Test'}</button>
          </div>
        </form>
      </div>
    </div>
  `;

  if (testId) {
    try {
      const test = await window.db.getTest(testId);
      document.getElementById("test-name-field").value = test.name;
      document.getElementById("test-description-field").value = test.description || "";
      document.getElementById("test-date-field").value = test.date;
      document.getElementById("test-max-score-field").value = test.max_score;
      document.getElementById("test-category-field").value = test.category;
      document.getElementById("test-published-field").checked = test.published;
    } catch (err) {
      showToast("Error loading test for editing: " + err.message, "error");
      navigate("#admin-tests");
      return;
    }
  }

  document.getElementById("test-editor-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const testData = {
      name: document.getElementById("test-name-field").value.trim(),
      description: document.getElementById("test-description-field").value.trim(),
      date: document.getElementById("test-date-field").value,
      max_score: document.getElementById("test-max-score-field").value,
      category: document.getElementById("test-category-field").value,
      published: document.getElementById("test-published-field").checked
    };

    if (!testData.name || !testData.date) {
      showToast("Test name and date are required.", "warning");
      return;
    }

    try {
      if (currentEditingTestId) {
        await window.db.updateTest(currentEditingTestId, testData);
        showToast("Test updated successfully.", "success");
      } else {
        await window.db.createTest(testData);
        showToast("Test created successfully.", "success");
      }
      navigate("#admin-tests");
    } catch (err) {
      showToast("Save failed: " + err.message, "error");
    }
  });
}
