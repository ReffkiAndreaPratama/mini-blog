const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const form = document.getElementById("edit-form");

const articles = getArticles();
const article = articles.find(a => a.id === id);

if (!article) {
  alert("Artikel tidak ditemukan");
  window.location.href = "index.html";
}

titleInput.value = article.title;
contentInput.value = article.content;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  article.title = titleInput.value;
  article.content = contentInput.value;

  saveArticles(articles);
  window.location.href = "index.html";
});

showToast("Artikel berhasil diperbarui");

