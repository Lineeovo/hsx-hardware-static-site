let products = [];
let currentFilter = "全部";
let currentQuery = "";

const email = "2295575218@qq.com";
const featuredTitles = [
  "304不锈钢内六角杯头长螺栓",
  "304不锈钢沉头内六角自攻螺丝",
  "圆柱头十字槽滚花螺丝",
  "外六角螺丝",
];

const featuredGrid = document.querySelector("#v2Featured");
const catalogGrid = document.querySelector("#v2Catalog");
const filterWrap = document.querySelector("#v2Filters");
const searchInput = document.querySelector("#v2Search");
const quoteDialog = document.querySelector("#v2QuoteDialog");
const closeQuote = document.querySelector("#v2CloseQuote");
const quoteForm = document.querySelector("#v2QuoteForm");
const quoteProduct = document.querySelector("#v2QuoteProduct");
const heroQuoteForm = document.querySelector("#heroQuoteForm");
const productDialog = document.querySelector("#v2ProductDialog");
const productBody = document.querySelector("#v2ProductBody");
const closeProduct = document.querySelector("#v2CloseProduct");
const navLinks = document.querySelectorAll("[data-nav-link]");

function mailtoFor({ product = "", message = "", drawing = "", name = "", phone = "" }) {
  const subject = encodeURIComponent(`询价：${product || "五金螺丝螺母产品"}`);
  const body = encodeURIComponent(
    `您好，我想咨询以下产品：\n${product}\n\n产品参数：\n${message}\n\n图纸 / 样品说明：\n${drawing}\n\n联系人：\n${name}\n\n联系电话：\n${phone}\n`,
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function openQuote(product = "") {
  quoteProduct.value = product;
  if (!quoteDialog.open) quoteDialog.showModal();
  setTimeout(() => quoteProduct.focus(), 0);
}

function card(product) {
  return `
    <article class="product-card">
      <button type="button" data-view="${product.id}" aria-label="查看${product.title}">
        <img src="${product.image}" alt="${product.title}" loading="lazy" />
      </button>
      <div class="body">
        <div class="tags">${product.tags.slice(0, 2).map((tag) => `<span>${tag}</span>`).join("")}</div>
        <h3>${product.title}</h3>
        <p>${product.tags.slice(0, 3).join(" / ") || "五金螺丝螺母"}，支持按需求沟通规格与数量。</p>
        <div class="card-actions">
          <button type="button" data-view="${product.id}">详情</button>
          <button type="button" data-quote="${product.title}">询价</button>
        </div>
      </div>
    </article>
  `;
}

function renderFeatured() {
  const items = featuredTitles.map((title) => products.find((product) => product.title === title)).filter(Boolean);
  featuredGrid.innerHTML = items.map(card).join("");
}

function productMatches(product) {
  const query = currentQuery.trim().toLowerCase();
  const text = `${product.title} ${product.tags.join(" ")}`.toLowerCase();
  return (!query || text.includes(query)) && (currentFilter === "全部" || product.tags.includes(currentFilter));
}

function renderCatalog() {
  catalogGrid.innerHTML = products.filter(productMatches).map(card).join("");
}

function renderFilters() {
  const tags = [...new Set(products.flatMap((product) => product.tags))].sort((a, b) =>
    a.localeCompare(b, "zh-CN"),
  );
  filterWrap.innerHTML = ["全部", ...tags]
    .map((tag) => `<button type="button" class="${tag === currentFilter ? "active" : ""}" data-filter="${tag}">${tag}</button>`)
    .join("");
}

function openProduct(product) {
  productBody.innerHTML = `
    <div class="product-dialog-layout">
      <img src="${product.image}" alt="${product.title}" />
      <div class="product-dialog-content">
        <div class="tags">${product.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <h2>${product.title}</h2>
        <p>类别：${product.category}</p>
        <p>可结合图纸、样品、数量、规格和应用场景咨询。相关描述依据原站产品分类与公司介绍整理。</p>
        <div class="card-actions">
          <button type="button" data-quote="${product.title}">打开报价单</button>
          <a class="btn primary" href="tel:13510862632">电话咨询</a>
        </div>
      </div>
    </div>
  `;
  productDialog.showModal();
}

function handleProductClick(event) {
  const view = event.target.closest("[data-view]");
  const quote = event.target.closest("[data-quote]");

  if (view) {
    const product = products.find((item) => item.id === view.dataset.view);
    if (product) openProduct(product);
  }

  if (quote) {
    productDialog.close();
    openQuote(quote.dataset.quote);
  }
}

function submitQuote(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  window.location.href = mailtoFor({
    product: formData.get("product") || "",
    message: formData.get("message") || "",
    drawing: formData.get("drawing") || "",
    name: formData.get("name") || "",
    phone: formData.get("phone") || "",
  });
}

function submitHeroQuote(event) {
  event.preventDefault();
  const formData = new FormData(heroQuoteForm);
  window.location.href = mailtoFor({
    message: formData.get("message") || "",
    name: formData.get("name") || "",
    phone: formData.get("phone") || "",
  });
}

function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveNav(visible.target.id);
  },
  { rootMargin: "-35% 0px -50% 0px", threshold: [0.15, 0.35, 0.6] },
);

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-open-quote]")) openQuote("");
});

featuredGrid.addEventListener("click", handleProductClick);
catalogGrid.addEventListener("click", handleProductClick);
productBody.addEventListener("click", handleProductClick);

filterWrap.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  currentFilter = button.dataset.filter;
  renderFilters();
  renderCatalog();
});

searchInput.addEventListener("input", (event) => {
  currentQuery = event.target.value;
  renderCatalog();
});

closeQuote.addEventListener("click", () => quoteDialog.close());
closeProduct.addEventListener("click", () => productDialog.close());
quoteDialog.addEventListener("click", (event) => {
  if (event.target === quoteDialog) quoteDialog.close();
});
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
});

quoteForm.addEventListener("submit", submitQuote);
heroQuoteForm.addEventListener("submit", submitHeroQuote);

async function init() {
  const response = await fetch("src/data/products.json");
  products = await response.json();
  renderFeatured();
  renderFilters();
  renderCatalog();
  ["top", "featured", "about", "catalog", "contact"].forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

init();
