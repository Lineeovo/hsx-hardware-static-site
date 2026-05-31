# HSX Hardware Static Site

静态企业官网项目，可直接部署到 Vercel、GitHub Pages、对象存储静态网站托管等平台。

## 本地预览

```bash
npm run dev
```

打开：

```text
http://localhost:5173
```

## Vercel 部署

项目为纯静态站，不需要构建产物。Vercel 导入 GitHub 仓库后保持默认设置即可：

- Framework Preset: Other
- Build Command: 留空或使用 `npm run build`
- Output Directory: `.`

询价表单当前使用 `mailto:2295575218@qq.com`。如需网页内直接发送邮件，需要额外接入后端接口或云函数。

