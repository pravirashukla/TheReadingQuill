// ── Storage ──
const STORE_KEY = 'rq_articles';

function getArticles() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
  catch(e) { return []; }
}

function saveArticles(arr) {
  localStorage.setItem(STORE_KEY, JSON.stringify(arr));
}

// ── State ──
let currentId = null;

// ── Elements ──
const viewDashboard = document.getElementById('viewDashboard');
const viewEditor    = document.getElementById('viewEditor');
const backBtn       = document.getElementById('backBtn');
const publishBtn    = document.getElementById('publishBtn');
const saveStatus    = document.getElementById('saveStatus');

// ── Switch to dashboard ──
function showDashboard() {
  viewDashboard.style.display = '';
  viewEditor.style.display    = 'none';
  backBtn.style.display       = 'none';
  publishBtn.style.display    = 'none';
  currentId = null;
  renderGrid();
}

// ── Switch to editor ──
function showEditor(article) {
  viewDashboard.style.display = 'none';
  viewEditor.style.display    = '';
  backBtn.style.display       = '';
  publishBtn.style.display    = '';

  currentId = article.id;
  document.getElementById('articleTitle').value = article.title  || '';
  document.getElementById('authorName').value   = article.author || '';
  document.getElementById('editor').innerHTML   = article.body   || '';

  // Set genre after DOM is ready
  const genreEl = document.getElementById('genre');
  genreEl.value = article.genre || '';
}

// ── Render dashboard grid ──
function renderGrid() {
  const grid = document.getElementById('articlesGrid');
  grid.innerHTML = '';

  // + New card
  const newCard = document.createElement('div');
  newCard.className = 'new-card';
  newCard.innerHTML = '<div class="new-icon">＋</div><span>New Article</span>';
  newCard.addEventListener('click', () => {
    showEditor({
      id: 'article_' + Date.now(),
      title: '', author: '', genre: '', body: ''
    });
  });
  grid.appendChild(newCard);

  // Existing articles, newest first
  getArticles().slice().reverse().forEach(a => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML =
      '<span class="card-genre">' + (a.genre || 'Article') + '</span>' +
      '<div class="card-title">' + (a.title || 'Untitled') + '</div>' +
      '<div class="card-meta">' + (a.author ? 'by ' + a.author + ' · ' : '') + (a.savedAt || '') + '</div>' +
      '<button class="card-delete" title="Delete">✕</button>';

    card.addEventListener('click', function(e) {
      if (e.target.classList.contains('card-delete')) return;
      showEditor(a);
    });

    card.querySelector('.card-delete').addEventListener('click', function(e) {
      e.stopPropagation();
      if (confirm('Delete "' + (a.title || 'Untitled') + '"?')) {
        saveArticles(getArticles().filter(x => x.id !== a.id));
        renderGrid();
      }
    });

    grid.appendChild(card);
  });
}

// ── Save current article ──
function saveCurrentArticle(silent) {
  if (!currentId) return;

  const article = {
    id:      currentId,
    title:   document.getElementById('articleTitle').value,
    author:  document.getElementById('authorName').value,
    genre:   document.getElementById('genre').value,
    body:    document.getElementById('editor').innerHTML,
    savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const articles = getArticles();
  const idx = articles.findIndex(a => a.id === article.id);
  if (idx >= 0) articles[idx] = article;
  else articles.push(article);
  saveArticles(articles);

  if (!silent) {
    saveStatus.textContent = '✓ Saved';
    clearTimeout(saveStatus._timer);
    saveStatus._timer = setTimeout(() => { saveStatus.textContent = ''; }, 2500);
  }
}

// Auto-save every 30 seconds while in editor
setInterval(function() {
  if (currentId !== null) saveCurrentArticle(true);
}, 30000);

// ── Button events ──
document.getElementById('saveBtn').addEventListener('click', function() {
  saveCurrentArticle(false);
});

backBtn.addEventListener('click', function() {
  saveCurrentArticle(true);
  showDashboard();
});

publishBtn.addEventListener('click', function() {
  const title  = document.getElementById('articleTitle').value.trim();
  const author = document.getElementById('authorName').value.trim();
  const genre  = document.getElementById('genre').value;
  const body   = document.getElementById('editor').innerText.trim();

  if (!title) { alert('Please add a title before publishing.'); return; }
  if (!body)  { alert('Your article is empty!'); return; }

  saveCurrentArticle(true);

  document.getElementById('modalSummary').textContent =
    '"' + title + '"' +
    (author ? ' by ' + author : '') +
    (genre  ? ' · ' + genre   : '') +
    ' has been published.';

  document.getElementById('modalOverlay').classList.add('active');
});

document.getElementById('modalClose').addEventListener('click', function() {
  document.getElementById('modalOverlay').classList.remove('active');
  showDashboard();
});

// ── Formatting ──
function fmt(command, value) {
  document.execCommand(command, false, value || null);
  document.getElementById('editor').focus();
}

function insertLink() {
  var url = prompt('Enter URL:');
  if (url) document.execCommand('createLink', false, url);
  document.getElementById('editor').focus();
}

// ── Init ──
showDashboard();