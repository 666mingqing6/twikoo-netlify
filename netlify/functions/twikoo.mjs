// Twikoo Netlify 函数入口（Modern Netlify Functions / ESM）
// 说明：Twikoo 2.x 起改用 ESM 默认入口，以便通过 context.waitUntil()
//      异步执行 POST_SUBMIT，避免邮件等后置通知阻塞评论提交。
//      要求 Node.js >= 22.12.0（见 package.json 的 engines 与 .node-version）
export { default } from "twikoo-netlify"
