# 国内上线说明

这个项目是纯静态网站，不依赖 Vercel 或 Node 服务端。上线时把整个目录里的静态文件上传到国内可访问的静态托管或对象存储即可。

## 推荐方案

1. 阿里云 OSS + CDN
   - 适合正式上线，国内访问稳定。
   - OSS 开启静态网站托管，默认首页设置为 `index.html`。
   - CDN 回源到 OSS Bucket，绑定已备案域名。
   - 官方文档：https://help.aliyun.com/zh/oss/overview-71

2. 腾讯云 COS + CDN
   - 同样适合国内访问。
   - COS 开启静态网站功能，索引文档设置为 `index.html`。
   - CDN 绑定域名并回源 COS。
   - 官方文档：https://cloud.tencent.com/document/product/436/14984

3. 华为云 OBS + CDN
   - 流程类似，开启静态网站托管后绑定 CDN。
   - 官方文档：https://support.huaweicloud.com/intl/zh-cn/usermanual-obs/zh-cn_topic_0045829093.html

## 上传内容

上传这些文件和目录：

- `index.html`
- `v1-enhanced.html`
- `v2.html`
- `src/`
- `public/`

`scripts/` 和 `package.json` 是本地开发/抓取用的，上线时可以不上传。

## 邮箱询盘

站内询盘当前使用 `mailto:2295575218@qq.com`。用户点击提交后会打开自己的邮件客户端，并自动带上询盘内容。

如果后续需要网页内直接提交、不依赖用户邮件客户端，需要再接一个国内可用的后端接口，例如云函数、轻量服务器接口或企业邮箱 SMTP 转发接口。

## 对齐后上线前检查

1. 本地运行：

```bash
npm run dev
```

2. 浏览器打开：

```text
http://localhost:5173
```

3. 确认首页、产品图、搜索筛选、询盘弹窗、邮箱链接都正常。
