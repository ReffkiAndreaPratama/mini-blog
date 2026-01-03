// =======================
// ELEMENTS
// =======================
const listContainer = document.getElementById("article-list");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const themeBtn = document.getElementById("theme");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageInfo = document.getElementById("page-info");

// =======================
// PAGINATION
// =======================
let currentPage = 1;
const limit = 3;

// =======================
// RENDER ARTICLES
// =======================
function renderArticles(filter = "") {
  let articles = getArticles();

  // SEARCH
  articles = articles.filter(a =>
    a.title.toLowerCase().includes(filter.toLowerCase())
  );

  // SORT
  articles = sortArticles(articles);

  // EMPTY STATE
  if (articles.length === 0) {
    listContainer.innerHTML =
      `<div class="empty">
        <p>Belum ada artikel</p>
        <small>Tambahkan artikel pertama 🚀</small>
      </div>`;
    pageInfo.textContent = "";
    return;
  }

  // PAGINATION
  const paginated = paginate(articles);
  listContainer.innerHTML = "";

  paginated.forEach(article => {
    const div = document.createElement("div");
    div.className = "article";

    div.innerHTML = `
      <h3>${highlight(article.title, filter)}</h3>
      <small>${article.createdAt}</small>
      <p>
        ${article.content.substring(0, 80)}...
        <a href="#" onclick="alert('${escapeQuotes(article.content)}')">
          Read more
        </a>
      </p>
      <div class="actions">
        <a href="edit.html?id=${article.id}" class="btn">Edit</a>
        <button onclick="deleteArticle(${article.id})">Hapus</button>
      </div>
    `;

    listContainer.appendChild(div);
  });

  updatePagination(articles.length);
}

// =======================
// DELETE + UNDO
// =======================
let lastDeleted = null;

function deleteArticle(id) {
  let deleteId = null;

function deleteArticle(id) {
  deleteId = id;
  document.getElementById("confirm-box").classList.remove("hidden");
}

document.getElementById("confirm-yes").onclick = () => {
  const articles = getArticles().filter(a => a.id !== deleteId);
  saveArticles(articles);
  renderArticles(searchInput.value);
  showToast("Artikel berhasil dihapus");
  document.getElementById("confirm-box").classList.add("hidden");
};

document.getElementById("confirm-no").onclick = () => {
  document.getElementById("confirm-box").classList.add("hidden");
};


  const articles = getArticles();
  lastDeleted = articles.find(a => a.id === id);

  saveArticles(articles.filter(a => a.id !== id));
  renderArticles(searchInput.value);
  showUndo();
}

function showUndo() {
  const undo = document.createElement("div");
  undo.className = "undo";
  undo.innerHTML = `Artikel dihapus <button>Undo</button>`;

  undo.querySelector("button").onclick = () => {
    const articles = getArticles();
    articles.push(lastDeleted);
    saveArticles(articles);
    renderArticles(searchInput.value);
    undo.remove();
  };

  document.body.appendChild(undo);
  setTimeout(() => undo.remove(), 5000);
}

// =======================
// SORT
// =======================
function sortArticles(data) {
  const sort = sortSelect.value;

  if (sort === "new") return [...data].sort((a, b) => b.id - a.id);
  if (sort === "old") return [...data].sort((a, b) => a.id - b.id);
  if (sort === "title")
    return [...data].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

  return data;
}

// =======================
// PAGINATION
// =======================
function paginate(data) {
  const start = (currentPage - 1) * limit;
  return data.slice(start, start + limit);
}

function updatePagination(total) {
  pageInfo.textContent = `Page ${currentPage}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage * limit >= total;
}

// =======================
// EVENTS
// =======================
searchInput.addEventListener("input", e => {
  currentPage = 1;
  renderArticles(e.target.value);
});

sortSelect.addEventListener("change", () => {
  currentPage = 1;
  renderArticles(searchInput.value);
});

prevBtn.onclick = () => {
  currentPage--;
  renderArticles(searchInput.value);
};

nextBtn.onclick = () => {
  currentPage++;
  renderArticles(searchInput.value);
};

// =======================
// DARK MODE (FIXED)
// =======================

// load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// toggle theme
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const mode = document.body.classList.contains("dark")
    ? "dark"
    : "light";

  localStorage.setItem("theme", mode);
});

// =======================
// HELPERS
// =======================
function escapeQuotes(text) {
  return text.replace(/'/g, "\\'");
}

function highlight(text, keyword) {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// INIT
renderArticles();

// alert
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
