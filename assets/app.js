(function () {
  const posts = BlogCore.sortPosts(window.BLOG_POSTS || []);
  const app = document.querySelector("#app");
  const state = {
    query: "",
    tag: "All"
  };

  function getActivePost() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("post");
    return posts.find((post) => post.slug === slug);
  }

  function uniqueTags() {
    return ["All", ...new Set(posts.flatMap((post) => post.tags || []))];
  }

  function filteredPosts() {
    const query = state.query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = state.tag === "All" || (post.tags || []).includes(state.tag);
      const haystack = `${post.title} ${post.excerpt} ${(post.tags || []).join(" ")}`.toLowerCase();
      return matchesTag && (!query || haystack.includes(query));
    });
  }

  function renderShell() {
    const tags = uniqueTags()
      .map((tag) => {
        const active = tag === state.tag ? " active" : "";
        return `<button class="tag-button${active}" type="button" data-tag="${BlogCore.escapeHTML(tag)}">${BlogCore.escapeHTML(tag)}</button>`;
      })
      .join("");

    app.innerHTML = `
      <section class="layout-grid">
        <aside class="profile-panel">
          <img class="avatar" src="https://github.com/hyuhao2000.png" alt="hyuhao2000 avatar" width="88" height="88">
          <p class="eyebrow">$ whoami</p>
          <h1>Han YH</h1>
          <p class="profile-copy">记录工程实践、部署笔记、系统设计和日常 debugging。偏实用，少玄学。</p>
          <div class="stat-grid">
            <div>
              <strong>${posts.length}</strong>
              <span>posts</span>
            </div>
            <div>
              <strong id="busuanzi_site_pv">...</strong>
              <span>site pv</span>
            </div>
            <div>
              <strong id="busuanzi_page_pv">...</strong>
              <span>page pv</span>
            </div>
          </div>
          <div class="link-stack">
            <a href="https://github.com/hyuhao2000" rel="noreferrer">github.com/hyuhao2000</a>
            <a href="admin.html">write a post</a>
          </div>
        </aside>

        <section class="feed-section">
          <div class="terminal-line">
            <span class="prompt">$</span>
            <span>ls posts --sort=date --style=programmer</span>
          </div>
          <div class="search-row">
            <input id="searchInput" type="search" placeholder="Search posts, tags, notes" value="${BlogCore.escapeHTML(state.query)}">
          </div>
          <div class="tag-row" aria-label="Post tags">${tags}</div>
          <div id="postList" class="post-list"></div>
          <section id="archive" class="archive-section"></section>
        </section>
      </section>
    `;

    renderPostList();
    bindListEvents();
  }

  function renderPostList() {
    const list = document.querySelector("#postList");
    const archive = document.querySelector("#archive");
    const matches = filteredPosts();

    list.innerHTML = matches.length
      ? matches.map(renderPostCard).join("")
      : `<div class="empty-state">No matching posts.</div>`;

    archive.innerHTML = `
      <div class="section-title">
        <span class="prompt">#</span>
        <h2>Archive</h2>
      </div>
      <ol class="archive-list">
        ${posts.map((post) => `
          <li>
            <time datetime="${BlogCore.escapeHTML(post.date)}">${BlogCore.formatDate(post.date)}</time>
            <a href="?post=${encodeURIComponent(post.slug)}">${BlogCore.escapeHTML(post.title)}</a>
          </li>
        `).join("")}
      </ol>
    `;
  }

  function renderPostCard(post) {
    const tagList = (post.tags || [])
      .map((tag) => `<span>${BlogCore.escapeHTML(tag)}</span>`)
      .join("");
    return `
      <article class="post-card">
        <div class="post-card-meta">
          <time datetime="${BlogCore.escapeHTML(post.date)}">${BlogCore.formatDate(post.date)}</time>
          <span>${BlogCore.readingMinutes(post)} min read</span>
        </div>
        <h2><a href="?post=${encodeURIComponent(post.slug)}">${BlogCore.escapeHTML(post.title)}</a></h2>
        <p>${BlogCore.escapeHTML(post.excerpt)}</p>
        <div class="post-tags">${tagList}</div>
      </article>
    `;
  }

  function renderPost(post) {
    document.title = `${post.title} · Han YH Dev Blog`;
    const tagList = (post.tags || [])
      .map((tag) => `<span>${BlogCore.escapeHTML(tag)}</span>`)
      .join("");

    app.innerHTML = `
      <article class="article-shell">
        <a class="back-link" href="./">← Back to posts</a>
        <header class="article-header">
          <div class="terminal-line">
            <span class="prompt">$</span>
            <span>cat posts/${BlogCore.escapeHTML(post.slug)}.md</span>
          </div>
          <h1>${BlogCore.escapeHTML(post.title)}</h1>
          <div class="article-meta">
            <time datetime="${BlogCore.escapeHTML(post.date)}">${BlogCore.formatDate(post.date)}</time>
            <span>${BlogCore.readingMinutes(post)} min read</span>
            <span><span id="busuanzi_page_pv">...</span> views</span>
          </div>
          <div class="post-tags">${tagList}</div>
        </header>
        <section class="post-body">${BlogCore.renderMarkdown(post.content)}</section>
      </article>
    `;
  }

  function bindListEvents() {
    document.querySelector("#searchInput").addEventListener("input", (event) => {
      state.query = event.target.value;
      renderPostList();
    });

    document.querySelectorAll("[data-tag]").forEach((button) => {
      button.addEventListener("click", () => {
        state.tag = button.dataset.tag;
        renderShell();
      });
    });
  }

  const activePost = getActivePost();
  if (activePost) {
    renderPost(activePost);
  } else {
    renderShell();
  }
})();
