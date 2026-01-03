const STORAGE_KEY = "articles";

function getArticles() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveArticles(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId() {
  return Date.now();
}
