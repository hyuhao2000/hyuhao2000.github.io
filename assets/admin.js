(function () {
  const form = document.querySelector("#postForm");
  const fields = {
    title: document.querySelector("#title"),
    slug: document.querySelector("#slug"),
    date: document.querySelector("#date"),
    tags: document.querySelector("#tags"),
    excerpt: document.querySelector("#excerpt"),
    content: document.querySelector("#content")
  };
  const preview = document.querySelector("#preview");
  const output = document.querySelector("#output");
  const draftKey = "hyh.qd.je.postDraft";

  fields.date.value = new Date().toISOString().slice(0, 10);

  function readPost() {
    return {
      slug: fields.slug.value.trim() || BlogCore.slugify(fields.title.value),
      title: fields.title.value.trim(),
      date: fields.date.value,
      tags: fields.tags.value.split(",").map((tag) => tag.trim()).filter(Boolean),
      excerpt: fields.excerpt.value.trim(),
      content: fields.content.value.trim()
    };
  }

  function renderPreview() {
    const post = readPost();
    preview.innerHTML = `
      <h2>${BlogCore.escapeHTML(post.title || "Untitled")}</h2>
      <p class="preview-meta">${BlogCore.escapeHTML(post.date || "")} · ${(post.tags || []).map(BlogCore.escapeHTML).join(" / ")}</p>
      ${BlogCore.renderMarkdown(post.content || post.excerpt || "")}
    `;
  }

  function generateEntry() {
    const post = readPost();
    output.value = `  ${JSON.stringify(post, null, 2).replace(/\n/g, "\n  ")}`;
    renderPreview();
  }

  function saveDraft() {
    localStorage.setItem(draftKey, JSON.stringify(readPost()));
  }

  function restoreDraft() {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      Object.keys(fields).forEach((key) => {
        if (key === "tags") {
          fields.tags.value = (draft.tags || []).join(", ");
        } else {
          fields[key].value = draft[key] || fields[key].value;
        }
      });
      renderPreview();
    } catch (error) {
      localStorage.removeItem(draftKey);
    }
  }

  fields.title.addEventListener("input", () => {
    if (!fields.slug.dataset.touched) {
      fields.slug.value = BlogCore.slugify(fields.title.value);
    }
  });

  fields.slug.addEventListener("input", () => {
    fields.slug.dataset.touched = "true";
  });

  form.addEventListener("input", renderPreview);
  document.querySelector("#previewBtn").addEventListener("click", renderPreview);
  document.querySelector("#saveDraftBtn").addEventListener("click", saveDraft);
  document.querySelector("#generateBtn").addEventListener("click", generateEntry);
  document.querySelector("#copyBtn").addEventListener("click", async (event) => {
    if (!output.value.trim()) generateEntry();
    try {
      if (!navigator.clipboard || !window.isSecureContext) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(output.value);
    } catch (error) {
      output.focus();
      output.select();
      document.execCommand("copy");
    }
    event.target.textContent = "Copied";
    window.setTimeout(() => {
      event.target.textContent = "Copy Entry";
    }, 1200);
  });

  restoreDraft();
  renderPreview();
})();
