const form = document.getElementById("create-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const counter = document.getElementById("counter");

const draftKey = "draft_article";

// =======================
// LOAD DRAFT
// =======================
titleInput.value =
  localStorage.getItem(draftKey + "_title") || "";
contentInput.value =
  localStorage.getItem(draftKey + "_content") || "";

counter.textContent = `${contentInput.value.length} / 500`;

// =======================
// AUTO SAVE DRAFT
// =======================
titleInput.addEventListener("input", () => {
  localStorage.setItem(
    draftKey + "_title",
    titleInput.value
  );
});

contentInput.addEventListener("input", () => {
  localStorage.setItem(
    draftKey + "_content",
    contentInput.value
  );
  counter.textContent = `${contentInput.value.length} / 500`;
});

// =======================
// SUBMIT
// =======================
form.addEventListener("submit", e => {
  e.preventDefault();

  const articles = getArticles();

  articles.push({
    id: generateId(),
    title: titleInput.value,
    content: contentInput.value,
    createdAt: new Date().toLocaleDateString()
  });

  saveArticles(articles);

  // clear draft
  localStorage.removeItem(draftKey + "_title");
  localStorage.removeItem(draftKey + "_content");

  window.location.href = "index.html";
});

// alert
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

showToast("Artikel berhasil ditambahkan");

