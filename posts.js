window.BLOG_POSTS = [
  {
    slug: "hello-hyh-qd-je",
    title: "Hello, hyh.qd.je",
    date: "2026-04-23",
    tags: ["Meta", "GitHub Pages"],
    excerpt: "这个站点从一个空白 GitHub Pages 仓库开始，逐步变成一个可以长期记录技术笔记的个人博客。",
    content: `
# Hello, hyh.qd.je

这是博客的第一篇文章。

这个站点运行在 GitHub Pages 上，域名使用 \`hyh.qd.je\`。页面本身是静态文件，但结构已经留好了：

- \`posts.js\` 保存文章数据
- \`admin.html\` 用来起草、预览和生成文章条目
- 首页支持搜索、标签筛选、文章归档和阅读量统计

后续写文章时，把生成的新文章对象放到 \`posts.js\` 数组最前面，提交并推送到 GitHub，GitHub Pages 就会自动发布。
`
  },
  {
    slug: "github-pages-dns-notes",
    title: "GitHub Pages 与自定义域名配置笔记",
    date: "2026-04-22",
    tags: ["DNS", "GitHub Pages", "Operations"],
    excerpt: "记录一次把 hyh.qd.je 绑定到 GitHub Pages 的过程，包括 NS、A 记录、CNAME 和 HTTPS 证书状态。",
    content: `
# GitHub Pages 与自定义域名配置笔记

GitHub Pages 的自定义域名配置可以拆成两层。

第一层是 DNS。根域名需要用 A 记录指向 GitHub Pages 的入口 IP，常见配置是四条：

\`\`\`txt
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
\`\`\`

第二层是仓库设置。仓库根目录的 \`CNAME\` 文件声明这个 Pages 站点要响应哪个域名：

\`\`\`txt
hyh.qd.je
\`\`\`

这两个条件满足后，GitHub 会根据请求里的 \`Host\` 头把访问路由到对应的 Pages 站点。HTTPS 证书通常会在 DNS 生效后由 GitHub 自动签发，证书生成前不要强行开启 HTTPS enforcement。
`
  },
  {
    slug: "static-blog-architecture",
    title: "一个纯静态博客的最小架构",
    date: "2026-04-23",
    tags: ["JavaScript", "Static Site", "Architecture"],
    excerpt: "不用数据库、不跑后端，也能做出可维护的个人博客：文章数据、渲染逻辑、写作工具各自独立。",
    content: `
# 一个纯静态博客的最小架构

GitHub Pages 不运行服务端语言，所以个人博客最好把动态能力收敛到浏览器侧。

这个站点的结构很直接：

- 数据层：\`posts.js\` 暴露 \`window.BLOG_POSTS\`
- 渲染层：\`assets/app.js\` 负责列表、详情、搜索和标签筛选
- 内容层：文章正文使用 Markdown-like 文本
- 写作层：\`admin.html\` 生成可以粘贴进数据文件的文章对象
- 统计层：前端计数器记录站点和页面浏览量

这种方式的好处是部署成本低、迁移简单、可读性强。缺点也很明确：没有真正的在线数据库，发布仍然要通过 Git 提交完成。
`
  }
];
