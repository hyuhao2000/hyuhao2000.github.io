(function () {
  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function inlineMarkdown(value) {
    return escapeHTML(value)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown || "").trim().split(/\r?\n/);
    let html = "";
    let paragraph = [];
    let inCode = false;
    let codeLanguage = "";
    let codeLines = [];
    let inList = false;

    function flushParagraph() {
      if (!paragraph.length) return;
      html += `<p>${inlineMarkdown(paragraph.join(" "))}</p>`;
      paragraph = [];
    }

    function closeList() {
      if (!inList) return;
      html += "</ul>";
      inList = false;
    }

    lines.forEach((line) => {
      const codeFence = line.match(/^```(\w+)?\s*$/);
      if (codeFence) {
        flushParagraph();
        closeList();
        if (inCode) {
          html += `<pre><code class="language-${escapeHTML(codeLanguage)}">${escapeHTML(codeLines.join("\n"))}</code></pre>`;
          inCode = false;
          codeLanguage = "";
          codeLines = [];
        } else {
          inCode = true;
          codeLanguage = codeFence[1] || "text";
        }
        return;
      }

      if (inCode) {
        codeLines.push(line);
        return;
      }

      if (!line.trim()) {
        flushParagraph();
        closeList();
        return;
      }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        closeList();
        const level = heading[1].length + 1;
        html += `<h${level}>${inlineMarkdown(heading[2])}</h${level}>`;
        return;
      }

      const listItem = line.match(/^\s*[-*]\s+(.+)$/);
      if (listItem) {
        flushParagraph();
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${inlineMarkdown(listItem[1])}</li>`;
        return;
      }

      const quote = line.match(/^>\s+(.+)$/);
      if (quote) {
        flushParagraph();
        closeList();
        html += `<blockquote>${inlineMarkdown(quote[1])}</blockquote>`;
        return;
      }

      paragraph.push(line.trim());
    });

    if (inCode) {
      html += `<pre><code class="language-${escapeHTML(codeLanguage)}">${escapeHTML(codeLines.join("\n"))}</code></pre>`;
    }
    flushParagraph();
    closeList();
    return html;
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(`${value}T00:00:00`));
  }

  function readingMinutes(post) {
    const length = `${post.title} ${post.excerpt} ${post.content}`.replace(/\s+/g, "").length;
    return Math.max(1, Math.ceil(length / 500));
  }

  function sortPosts(posts) {
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function slugify(value) {
    const slug = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || `post-${new Date().toISOString().slice(0, 10)}`;
  }

  window.BlogCore = {
    escapeHTML,
    formatDate,
    inlineMarkdown,
    readingMinutes,
    renderMarkdown,
    slugify,
    sortPosts
  };
})();
