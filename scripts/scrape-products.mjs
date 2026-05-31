import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const origin = "http://hsxwjzp.com";
const outDir = path.resolve("public/images/products");
const dataPath = path.resolve("src/data/products.json");

const pages = [
  `${origin}/product_lists_568.html`,
  ...Array.from({ length: 5 }, (_, index) => `${origin}/product_lists_568_p${index + 2}.html`),
];

const rules = [
  ["304", /304/],
  ["不锈钢", /不锈钢|不銹鋼/],
  ["内六角", /内六角/],
  ["外六角", /外六角|六角/],
  ["十字槽", /十字/],
  ["沉头", /沉头/],
  ["盘头", /盘头/],
  ["自攻", /自攻/],
  ["自钻", /自钻/],
  ["组合螺丝", /组合|組合/],
  ["防盗", /防盗/],
  ["非标定制", /非标|特殊|异形|定制/],
  ["螺母", /螺母|盖帽/],
  ["铆钉", /铆钉/],
  ["铜件", /铜/],
];

function cleanText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function inferTags(title) {
  const tags = rules.filter(([, pattern]) => pattern.test(title)).map(([tag]) => tag);
  if (/螺丝|螺钉|螺栓|螺絲/.test(title)) tags.unshift("螺丝螺钉");
  return [...new Set(tags)];
}

function getImageName(src, index) {
  const ext = path.extname(src).split("?")[0] || ".jpg";
  return `${String(index + 1).padStart(2, "0")}-${path.basename(src, ext).replace(/[^\w-]/g, "")}${ext}`;
}

async function download(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);
}

function fetchHtml(url) {
  return execFileSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; (Invoke-WebRequest -Uri '${url}' -UseBasicParsing -TimeoutSec 20).Content`,
    ],
    { encoding: "utf8", maxBuffer: 1024 * 1024 * 5 },
  );
}

await mkdir(outDir, { recursive: true });

const products = [];

for (const page of pages) {
  const html = fetchHtml(page);
  const pattern =
    /<a class="yjwi14057259287" href="(?<href>[^"]+)"[^>]*title="(?<title>[^"]+)"><img class="yjwi14057259288" src="(?<img>[^"]+)"/g;

  for (const match of html.matchAll(pattern)) {
    const title = cleanText(match.groups.title);
    const originalImage = `${origin}${match.groups.img}`;
    const fileName = getImageName(match.groups.img, products.length);
    await download(originalImage, path.join(outDir, fileName));

    products.push({
      id: String(products.length + 1).padStart(3, "0"),
      title,
      category: "五金螺丝螺母",
      tags: inferTags(title),
      image: `/public/images/products/${fileName}`,
      sourceUrl: `${origin}${match.groups.href}`,
      originalImage,
      inquirySubject: `询价：${title}`,
    });
  }
}

await writeFile(dataPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
console.log(`Saved ${products.length} products to ${dataPath}`);
