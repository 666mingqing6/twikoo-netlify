# twikoo-netlify

Twikoo 评论系统的 Netlify 后端（自建部署）。

| 项目 | 地址 |
|---|---|
| 云函数地址 | `https://comment.646474.xyz/.netlify/functions/twikoo` |
| 博客站点 | `https://blog.646474.xyz` |
| 前端调用位置 | `blog-hugo` 仓库的 `layouts/_partials/comments.html` |

## 仓库结构

```
.
├── netlify/functions/twikoo.mjs   # 函数入口（Modern Netlify Functions / ESM）
├── package.json                   # 依赖 twikoo-netlify（锁定具体版本号）
├── .node-version                  # 指定 Node 版本（24）
├── .github/workflows/
│   └── update-twikoo.yml          # 自动更新工作流
├── index.html                     # 部署后访问根路径的健康检查页
└── .gitignore
```

## 自动更新

`.github/workflows/update-twikoo.yml` 会：

1. **每周一 UTC 03:00**（北京时间 11:00）自动检查 npm 上 `twikoo-netlify` 的最新版本
2. 与 `package.json` 里锁定的版本比对
3. 有新版本时**自动改写 `package.json` 并提交**
4. 提交后 Netlify 检测到 `package.json` 变化，**自动重新部署**（依赖版本变了会重新安装，不命中旧缓存）

也可以在 Actions 页面点 **Run workflow** 手动触发检查。

### 为什么锁定具体版本号，而不是官方建议的 `latest`

`latest` 看似省事，但 Netlify 的构建缓存命中时**不会重新解析 `latest`**，需要人工去控制台点
「Clear cache and deploy」。锁定具体版本号后，版本一变 `package.json` 就变，能可靠触发重新安装；
而版本号本身由工作流自动维护，效果与 `latest` 等价且更可控。

## 手动更新（不使用工作流时）

```bash
# 1. 改 package.json 里的版本号
# 2. 提交推送
git add package.json && git commit -m "chore: 更新 twikoo-netlify" && git push
# 3. 若 Netlify 没有自动部署，到控制台 Deploys → Trigger deploy → Clear cache and deploy
```

## 升级注意事项（2.x 不兼容变更）

Twikoo 2.x 起，Netlify 部署模板有三处**必须同时满足**的变更，只改一项会失败：

| 项目 | 旧 | 新 |
|---|---|---|
| 函数入口 | `netlify/functions/twikoo.js`（CommonJS `exports.handler`） | `netlify/functions/twikoo.mjs`（ESM 默认导出） |
| 入口内容 | `exports.handler = require('twikoo-netlify').handler` | `export { default } from "twikoo-netlify"` |
| Node 版本 | 18 / 20 | **≥ 22.12.0**（本仓库用 24，见 `.node-version`） |

**升级后记得**：Netlify 控制台 → Deploys → Trigger deploy → **Clear cache and deploy site**，
然后访问云函数地址确认显示「Twikoo 云函数运行正常」。

**另外**：云函数版本更新后，需要同步把博客前端 `comments.html` 里 Twikoo CDN 的版本号改成相同版本
（官方要求前后端版本号一致）。

## 参考

- [Twikoo 后端部署文档](https://twikoo.js.org/backend.html)
- [Twikoo 版本更新文档](https://twikoo.js.org/update.html)
