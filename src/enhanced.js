const contact = {
  email: "2295575218@qq.com",
  phone: "13510862632",
};

let products = [];
let tags = [];
let featuredPage = 0;
const featuredPageSize = 4;
const state = { filter: "全部", query: "" };

const featuredTitles = [
  "304不锈钢内六角杯头长螺栓",
  "304不锈钢沉头内六角自攻螺丝",
  "圆柱头十字槽滚花螺丝",
  "外六角螺丝",
  "十字小盘头三组合螺丝",
  "防盗螺丝",
  "内六角杯头螺丝",
  "六角螺栓 DIN933",
  "国标螺母",
  "十字沉头自攻",
  "非标内六角杯头螺丝定制",
  "耐落防松螺丝",
];

const catalog = document.querySelector("#enhancedCatalog");
const featured = document.querySelector("#enhancedFeatured");
const filters = document.querySelector("#enhancedFilters");
const search = document.querySelector("#enhancedSearch");
const count = document.querySelector("#enhancedCount");
const clear = document.querySelector("#enhancedClear");
const productDialog = document.querySelector("#enhancedProductDialog");
const productBody = document.querySelector("#enhancedProductBody");
const closeProduct = document.querySelector("#enhancedCloseProduct");
const quoteDialog = document.querySelector("#enhancedQuoteDialog");
const closeQuote = document.querySelector("#enhancedCloseQuote");
const quoteForm = document.querySelector("#enhancedQuoteForm");
const heroQuoteForm = document.querySelector("#enhancedHeroQuoteForm");
const quoteProduct = document.querySelector("#enhancedQuoteProduct");
const contactMenuTrigger = document.querySelector("#contactMenuTrigger");
const contactMenu = document.querySelector("#contactMenu");
const navLinks = document.querySelectorAll("[data-nav-link]");

function mailtoFor(productTitle, details = {}) {
  const { message = "", drawing = "", name = "", phone = "" } = details;
  const subject = encodeURIComponent(`询价：${productTitle || "五金螺丝螺母产品"}`);
  const body = encodeURIComponent(
    `您好，我想咨询以下产品：\n${productTitle || ""}\n\n产品参数：\n${message}\n\n图纸 / 样品说明：\n${drawing}\n\n联系人：\n${name}\n\n联系电话：\n${phone}\n`,
  );
  return `mailto:${contact.email}?subject=${subject}&body=${body}`;
}

function openQuote(productTitle = "") {
  quoteProduct.value = productTitle;
  if (!quoteDialog.open) quoteDialog.showModal();
  setTimeout(() => quoteProduct.focus(), 0);
}

function productMatches(product) {
  const query = state.query.trim().toLowerCase();
  const text = `${product.title} ${product.tags.join(" ")}`.toLowerCase();
  return (!query || text.includes(query)) && (state.filter === "全部" || product.tags.includes(state.filter));
}

function renderFilters() {
  filters.innerHTML = ["全部", ...tags]
    .map((tag) => `<button type="button" class="${tag === state.filter ? "active" : ""}" data-filter="${tag}">${tag}</button>`)
    .join("");
}

function card(product) {
  return `
    <article class="product-card">
      <button class="image-button" type="button" data-view="${product.id}" aria-label="查看${product.title}">
        <img src="${product.image}" alt="${product.title}" loading="lazy" />
      </button>
      <div class="product-info">
        <p class="product-id">HSX-${product.id}</p>
        <h3>${product.title}</h3>
        <div class="tag-row">${product.tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}</div>
        <div class="product-actions">
          <button type="button" data-view="${product.id}">详情</button>
          <button class="primary-small" type="button" data-inquire="${product.title}">询价</button>
        </div>
      </div>
    </article>
  `;
}

function renderCatalog() {
  const visible = products.filter(productMatches);
  count.textContent = `共 ${visible.length} 款产品`;
  catalog.innerHTML = visible.map(card).join("");
}

function renderFeatured() {
  const items = featuredTitles.map((title) => products.find((product) => product.title === title)).filter(Boolean);
  const totalPages = Math.ceil(items.length / featuredPageSize);
  const visible = items.slice(featuredPage * featuredPageSize, featuredPage * featuredPageSize + featuredPageSize);
  featured.innerHTML = visible
    .map(
      (product, index) => `
      <article class="featured-card">
        <button class="featured-image" type="button" data-view="${product.id}" aria-label="查看${product.title}">
          <img src="${product.image}" alt="${product.title}" loading="lazy" />
        </button>
        <div class="featured-info">
          <p class="product-id">HSX-${product.id}</p>
          <h3>${product.title}</h3>
          <p>${product.tags.slice(0, 3).join(" / ") || "五金螺丝螺母"}</p>
          <div class="featured-actions">
            <button type="button" data-view="${product.id}">详情</button>
            <button class="primary-small" type="button" data-inquire="${product.title}">询价</button>
          </div>
        </div>
        ${
          index === visible.length - 1 && totalPages > 1
            ? `<button class="featured-next" type="button" data-featured-next>下一组<br>${featuredPage + 1}/${totalPages}</button>`
            : ""
        }
      </article>`,
    )
    .join("");
}

function openProduct(product) {
  productBody.innerHTML = `
    <div class="product-dialog-layout">
      <img src="${product.image}" alt="${product.title}" />
      <div class="product-dialog-content">
        <p class="product-id">HSX-${product.id}</p>
        <h2>${product.title}</h2>
        <p>类别：${product.category}</p>
        <div class="tag-row">${product.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <div class="dialog-specs">
          <span>公制 / 英制</span>
          <span>非标件</span>
          <span>来图来样</span>
          <span>批量订单</span>
        </div>
        <p>可结合图纸、样品、数量、规格和应用场景咨询，相关能力依据原站产品与公司介绍整理。</p>
        <div class="dialog-actions">
          <button class="primary-small" type="button" data-inquire="${product.title}">打开报价单</button>
          <a class="primary-small" href="tel:${contact.phone}">电话咨询</a>
        </div>
      </div>
    </div>
  `;
  productDialog.showModal();
}

function handleProductAction(event) {
  const view = event.target.closest("[data-view]");
  const inquire = event.target.closest("[data-inquire]");
  const next = event.target.closest("[data-featured-next]");

  if (next) {
    const totalPages = Math.ceil(featuredTitles.length / featuredPageSize);
    featuredPage = (featuredPage + 1) % totalPages;
    renderFeatured();
    return;
  }
  if (view) {
    const product = products.find((item) => item.id === view.dataset.view);
    if (product) openProduct(product);
  }
  if (inquire) {
    if (productDialog.open) productDialog.close();
    openQuote(inquire.dataset.inquire);
  }
}

function setContactMenu(open) {
  contactMenu.classList.toggle("open", open);
}

function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    const target = link.dataset.navTarget || link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", target === sectionId);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveNav(visible.target.id);
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] },
);

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  renderFilters();
  renderCatalog();
});
search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderCatalog();
});
clear.addEventListener("click", () => {
  search.value = "";
  state.query = "";
  state.filter = "全部";
  renderFilters();
  renderCatalog();
});
catalog.addEventListener("click", handleProductAction);
featured.addEventListener("click", handleProductAction);
productBody.addEventListener("click", handleProductAction);
closeProduct.addEventListener("click", () => productDialog.close());
closeQuote.addEventListener("click", () => quoteDialog.close());
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
});
quoteDialog.addEventListener("click", (event) => {
  if (event.target === quoteDialog) quoteDialog.close();
});
quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  window.location.href = mailtoFor(data.get("product") || "", {
    message: data.get("message") || "",
    drawing: data.get("drawing") || "",
    name: data.get("name") || "",
    phone: data.get("phone") || "",
  });
});
heroQuoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(heroQuoteForm);
  window.location.href = mailtoFor(data.get("product") || "", {
    message: data.get("message") || "",
    phone: data.get("phone") || "",
  });
});
contactMenuTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  setContactMenu(!contactMenu.classList.contains("open"));
});
contactMenu.addEventListener("click", (event) => {
  event.stopPropagation();
  if (event.target.closest("[data-open-quote]")) {
    setContactMenu(false);
    openQuote("");
  }
  if (event.target.closest("[data-contact-link]")) setContactMenu(false);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-menu")) setContactMenu(false);
  if (event.target.closest("[data-open-quote]")) openQuote("");
});

async function init() {
  const response = await fetch("src/data/products.json");
  products = await response.json();
  tags = [...new Set(products.flatMap((product) => product.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  renderFilters();
  renderFeatured();
  renderCatalog();
  ["about", "capability", "featured", "products", "contact"].forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
  setActiveNav(location.hash.replace("#", "") || "about");
}

init();
