const contact = {
  email: "2295575218@qq.com",
  phone: "13510862632",
};

let products = [];

const state = {
  filter: "全部",
  query: "",
};

const grid = document.querySelector("#productGrid");
const featuredGrid = document.querySelector("#featuredGrid");
const contactMenuTrigger = document.querySelector("#contactMenuTrigger");
const contactMenu = document.querySelector("#contactMenu");
const filterWrap = document.querySelector(".filter-wrap");
const searchInput = document.querySelector("#searchInput");
const resultCount = document.querySelector("#resultCount");
const clearFilters = document.querySelector("#clearFilters");
const dialog = document.querySelector("#productDialog");
const dialogBody = document.querySelector("#dialogBody");
const closeDialog = document.querySelector("#closeDialog");
const inquiryDialog = document.querySelector("#inquiryDialog");
const closeInquiryDialog = document.querySelector("#closeInquiryDialog");
const popupInquiryProduct = document.querySelector("#popupInquiryProduct");
const popupInquiryForm = document.querySelector("#popupInquiryForm");
const navLinks = document.querySelectorAll("[data-nav-link]");

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

let featuredPage = 0;
const featuredPageSize = 4;

let tags = [];

function mailtoFor(productTitle, details = {}) {
  const { message = "", drawing = "", name = "", phone = "" } = details;
  const subject = encodeURIComponent(`询价：${productTitle || "五金螺丝螺母产品"}`);
  const body = encodeURIComponent(
    `您好，我想咨询以下产品：\n${productTitle || ""}\n\n产品参数：\n${message}\n\n图纸 / 样品说明：\n${drawing}\n\n联系人：\n${name}\n\n联系电话：\n${phone}\n`,
  );
  return `mailto:${contact.email}?subject=${subject}&body=${body}`;
}

function productMatches(product) {
  const query = state.query.trim().toLowerCase();
  const text = `${product.title} ${product.tags.join(" ")}`.toLowerCase();
  const matchesQuery = !query || text.includes(query);
  const matchesFilter = state.filter === "全部" || product.tags.includes(state.filter);
  return matchesQuery && matchesFilter;
}

function renderFilters() {
  for (const tag of tags) {
    const button = document.createElement("button");
    button.className = "filter-chip";
    button.type = "button";
    button.dataset.filter = tag;
    button.textContent = tag;
    filterWrap.appendChild(button);
  }
}

function renderProducts() {
  const visible = products.filter(productMatches);
  resultCount.textContent = `共 ${visible.length} 款产品`;

  grid.innerHTML = visible
    .map(
      (product) => `
        <article class="product-card">
          <button class="image-button" type="button" data-view="${product.id}" aria-label="查看${product.title}">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
          </button>
          <div class="product-info">
            <p class="product-id">HSX-${product.id}</p>
            <h3>${product.title}</h3>
            <div class="tag-row">${product.tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}</div>
            <div class="product-actions">
              <button class="small-button" type="button" data-view="${product.id}">详情</button>
              <button class="small-button primary-small" type="button" data-inquire="${product.title}">询价</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderFeatured() {
  const featured = featuredTitles
    .map((title) => products.find((product) => product.title === title))
    .filter(Boolean);
  const totalPages = Math.ceil(featured.length / featuredPageSize);
  const start = featuredPage * featuredPageSize;
  const visible = featured.slice(start, start + featuredPageSize);

  featuredGrid.innerHTML = visible
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
              <button class="small-button" type="button" data-view="${product.id}">详情</button>
              <button class="small-button primary-small" type="button" data-inquire="${product.title}">询价</button>
            </div>
          </div>
          ${
            index === visible.length - 1 && totalPages > 1
              ? `<button class="featured-next" type="button" data-featured-next aria-label="下一组推荐产品">
                  <span>下一组</span>
                  <strong>${featuredPage + 1}/${totalPages}</strong>
                </button>`
              : ""
          }
        </article>
      `,
    )
    .join("");
}

function setFilter(filter) {
  state.filter = filter;
  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
  renderProducts();
}

function openProduct(product) {
  dialogBody.innerHTML = `
    <img class="dialog-image" src="${product.image}" alt="${product.title}" />
    <div class="dialog-content">
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
      <p class="dialog-note">可结合图纸、样品、数量、规格和应用场景咨询，相关能力依据原站产品与公司介绍整理。</p>
      <div class="dialog-actions">
        <button class="button primary" type="button" data-inquire="${product.title}">打开报价单</button>
        <a class="button ghost dark" href="tel:${contact.phone}">电话咨询</a>
      </div>
    </div>
  `;
  dialog.showModal();
}

function openInquiry(productTitle = "") {
  popupInquiryProduct.value = productTitle;
  if (!inquiryDialog.open) inquiryDialog.showModal();
  setTimeout(() => popupInquiryProduct.focus(), 0);
}

function setContactMenu(open) {
  contactMenu.classList.toggle("open", open);
  contactMenuTrigger.setAttribute("aria-expanded", String(open));
}

filterWrap.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  setFilter(button.dataset.filter);
});

contactMenuTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  setContactMenu(!contactMenu.classList.contains("open"));
});

contactMenu.addEventListener("click", (event) => {
  event.stopPropagation();

  if (event.target.closest("[data-open-quote]")) {
    setContactMenu(false);
    openInquiry("");
  }

  if (event.target.closest("[data-contact-link]")) {
    setContactMenu(false);
  }
});

document.addEventListener("click", (event) => {
  const isInsideMenu = event.target.closest(".nav-menu");
  if (!isInsideMenu) setContactMenu(false);

  if (event.target.closest("[data-open-quote]")) {
    openInquiry("");
  }
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

clearFilters.addEventListener("click", () => {
  searchInput.value = "";
  state.query = "";
  setFilter("全部");
});

grid.addEventListener("click", (event) => {
  handleProductAction(event);
});

featuredGrid.addEventListener("click", (event) => {
  const next = event.target.closest("[data-featured-next]");
  if (next) {
    const featuredCount = featuredTitles.length;
    const totalPages = Math.ceil(featuredCount / featuredPageSize);
    featuredPage = (featuredPage + 1) % totalPages;
    renderFeatured();
    return;
  }

  handleProductAction(event);
});

function handleProductAction(event) {
  const view = event.target.closest("[data-view]");
  const inquire = event.target.closest("[data-inquire]");

  if (view) {
    const product = products.find((item) => item.id === view.dataset.view);
    if (product) openProduct(product);
  }

  if (inquire) {
    openInquiry(inquire.dataset.inquire);
  }
}

closeDialog.addEventListener("click", () => dialog.close());
closeInquiryDialog.addEventListener("click", () => inquiryDialog.close());

dialog.addEventListener("click", (event) => {
  const inquire = event.target.closest("[data-inquire]");
  if (inquire) {
    dialog.close();
    openInquiry(inquire.dataset.inquire);
    return;
  }

  if (event.target === dialog) dialog.close();
});

inquiryDialog.addEventListener("click", (event) => {
  if (event.target === inquiryDialog) inquiryDialog.close();
});

popupInquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(popupInquiryForm);
  const product = formData.get("product") || "";
  const message = formData.get("message") || "";
  const drawing = formData.get("drawing") || "";
  const name = formData.get("name") || "";
  const phone = formData.get("phone") || "";
  window.location.href = mailtoFor(product, { message, drawing, name, phone });
});

function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    const target = link.dataset.navTarget || link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", target === sectionId);
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveNav(visible.target.id);
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] },
);

async function init() {
  const response = await fetch("/src/data/products.json");
  products = await response.json();
  tags = [...new Set(products.flatMap((product) => product.tags))].sort((a, b) =>
    a.localeCompare(b, "zh-CN"),
  );
  renderFilters();
  renderFeatured();
  renderProducts();
  ["about", "capability", "products", "contact"].forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
  setActiveNav(location.hash.replace("#", "") || "about");
}

init();
