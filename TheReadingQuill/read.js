// ── Book Data ──────────────────────────────────────────────
const BOOKS = [
  { id: 1,  title: "The Midnight Library",     author: "Matt Haig",          genre: "Fiction",   pages: 304,  emoji: "🌙", color: "#1a1a3e", desc: "Between life and death there is a library. In it, Nora Seed discovers books of every life she could have lived — and must choose which one is worth living." },
  { id: 2,  title: "Atomic Habits",            author: "James Clear",        genre: "Self-Help", pages: 320,  emoji: "⚛️", color: "#2d1a0e", desc: "A groundbreaking guide on building good habits and breaking bad ones — using tiny changes to produce remarkable results." },
  { id: 3,  title: "The Name of the Wind",     author: "Patrick Rothfuss",   genre: "Fantasy",   pages: 662,  emoji: "🌬️", color: "#0e1a2d", desc: "The tale of Kvothe: magician, musician, and notorious figure, told in his own words on a single day in a wayward inn." },
  { id: 4,  title: "Pachinko",                 author: "Min Jin Lee",        genre: "History",   pages: 496,  emoji: "🌸", color: "#2d0e1a", desc: "A multigenerational saga of a Korean family's struggles and triumphs across the turbulent 20th century in Japan." },
  { id: 5,  title: "Project Hail Mary",        author: "Andy Weir",          genre: "Sci-Fi",    pages: 476,  emoji: "🚀", color: "#0e2d1a", desc: "An astronaut wakes up alone in a spacecraft with no memory, on a desperate mission to save Earth from an extinction event." },
  { id: 6,  title: "Normal People",            author: "Sally Rooney",       genre: "Romance",   pages: 273,  emoji: "💬", color: "#1a2d0e", desc: "Two young people from the west of Ireland connect and disconnect throughout their lives, tracing the ripple effects of private decisions." },
  { id: 7,  title: "Sapiens",                  author: "Yuval Noah Harari",  genre: "History",   pages: 443,  emoji: "🦴", color: "#2d2d0e", desc: "A brief history of humankind — tracing our species from the Stone Age through to the twenty-first century." },
  { id: 8,  title: "The House in the Cerulean Sea", author: "TJ Klune",    genre: "Fantasy",   pages: 394,  emoji: "🏠", color: "#0e2d2d", desc: "A cozy fantasy about a caseworker sent to investigate a magical orphanage — and what he finds there." },
  { id: 9,  title: "Educated",                 author: "Tara Westover",      genre: "Memoir",    pages: 334,  emoji: "📚", color: "#2d0e2d", desc: "A memoir about a young woman raised by survivalists in the mountains of Idaho, who leaves home to educate herself — and the world she discovers." },
  { id: 10, title: "The Thursday Murder Club", author: "Richard Osman",      genre: "Mystery",   pages: 382,  emoji: "🔍", color: "#1a0e2d", desc: "Four unlikely friends meet each week to investigate unsolved crimes — until a real murder lands on their doorstep." },
  { id: 11, title: "Piranesi",                 author: "Susanna Clarke",     genre: "Mystery",   pages: 272,  emoji: "🏛️", color: "#2d1a1a", desc: "Piranesi lives in a house of infinite halls and tidal statues — until a mysterious visitor cracks open the truth of his world." },
  { id: 12, title: "Fourth Wing",              author: "Rebecca Yarros",     genre: "Fantasy",   pages: 528,  emoji: "🐉", color: "#1a2d2d", desc: "Violet Sorrengail is thrust into a war college of dragon riders — where the bonds formed may mean the difference between life and death." },
];

const RECOMMENDED = [2, 5, 9, 11]; // ids of recommended books

// ── State ──────────────────────────────────────────────────
let state = {
  current:   [],   // { bookId, pagesRead }
  history:   [],   // { bookId, finishedDate }
  wishlist:  [],   // [bookId]
};

// Load from localStorage
try {
  const saved = localStorage.getItem('rq_read_state');
  if (saved) state = JSON.parse(saved);
} catch(e) {}

function save() {
  localStorage.setItem('rq_read_state', JSON.stringify(state));
}

// ── Helpers ──────────────────────────────────────────────
function getBook(id) { return BOOKS.find(b => b.id === id); }

function coverDiv(book, extraClass = '') {
  return `<div class="${extraClass}" style="background:${book.color};">${book.emoji}</div>`;
}

function pct(entry) {
  const b = getBook(entry.bookId);
  return Math.min(100, Math.round((entry.pagesRead / b.pages) * 100));
}

// ── Render Currently Reading ─────────────────────────────
function renderCurrent() {
  const container = document.getElementById('currentBooks');
  const empty = document.getElementById('emptyCurrently');

  // Remove old cards (not the empty state)
  container.querySelectorAll('.current-card').forEach(el => el.remove());

  if (state.current.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  state.current.forEach(entry => {
    const book = getBook(entry.bookId);
    const p = pct(entry);
    const card = document.createElement('div');
    card.className = 'current-card';
    card.innerHTML = `
      ${coverDiv(book, 'current-cover')}
      <div class="current-info">
        <div class="current-title">${book.title}</div>
        <div class="current-author">${book.author}</div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${p}%"></div>
        </div>
        <div class="progress-meta">
          <span>${entry.pagesRead} / ${book.pages} pages</span>
          <span>${p}%</span>
        </div>
      </div>
      <button class="current-action" data-id="${book.id}">Update</button>
    `;
    card.querySelector('.current-action').addEventListener('click', (e) => {
      e.stopPropagation();
      openProgress(book.id);
    });
    container.appendChild(card);
  });
}

// ── Render History ────────────────────────────────────────
function renderHistory() {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('emptyHistory');
  document.getElementById('historyCount').textContent = state.history.length + ' finished';

  list.querySelectorAll('.history-card').forEach(el => el.remove());

  if (state.history.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  state.history.forEach(entry => {
    const book = getBook(entry.bookId);
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      ${coverDiv(book, 'history-cover')}
      <div class="history-info">
        <div class="history-title">${book.title}</div>
        <div class="history-meta">${book.author} · ${book.pages} pages</div>
      </div>
      <span class="finished-badge">✓ Finished</span>
    `;
    list.appendChild(card);
  });
}

// ── Render Wishlist ───────────────────────────────────────
function renderWishlist() {
  const grid = document.getElementById('wishGrid');
  const empty = document.getElementById('emptyWish');
  document.getElementById('wishCount').textContent = state.wishlist.length + ' saved';

  grid.querySelectorAll('.wish-card').forEach(el => el.remove());

  if (state.wishlist.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  state.wishlist.forEach(id => {
    const book = getBook(id);
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      ${coverDiv(book, 'wish-cover')}
      <div class="wish-title">${book.title}</div>
      <div class="wish-author">${book.author}</div>
    `;
    card.addEventListener('click', () => openBookModal(id));
    grid.appendChild(card);
  });
}

// ── Render Browse ─────────────────────────────────────────
let activeGenre = 'All';
const genres = ['All', ...new Set(BOOKS.map(b => b.genre))];

function renderGenres() {
  const container = document.getElementById('genreFilter');
  genres.forEach(g => {
    const pill = document.createElement('button');
    pill.className = 'genre-pill' + (g === activeGenre ? ' active' : '');
    pill.textContent = g;
    pill.addEventListener('click', () => {
      activeGenre = g;
      document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderBrowse();
    });
    container.appendChild(pill);
  });
}

function filterBooks() {
  renderBrowse();
}

function renderBrowse() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const grid = document.getElementById('browseGrid');
  grid.innerHTML = '';

  const visible = BOOKS.filter(b => {
    const matchGenre = activeGenre === 'All' || b.genre === activeGenre;
    const matchSearch = b.title.toLowerCase().includes(query) || b.genre.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
    return matchGenre && matchSearch;
  });

  visible.forEach(book => {
    const card = document.createElement('div');
    card.className = 'browse-card';
    card.innerHTML = `
      ${coverDiv(book, 'browse-cover')}
      <div class="browse-info">
        <div class="browse-title">${book.title}</div>
        <div class="browse-author">${book.author}</div>
        <span class="browse-genre-tag">${book.genre}</span>
      </div>
    `;
    card.addEventListener('click', () => openBookModal(book.id));
    grid.appendChild(card);
  });
}

// ── Render Recommended ────────────────────────────────────
const whyRec = {
  2: "Because readers love small changes",
  5: "If you like thrilling science adventures",
  9: "A life-changing true story",
  11: "For fans of atmospheric mysteries",
};

function renderRec() {
  const grid = document.getElementById('recGrid');
  RECOMMENDED.forEach(id => {
    const book = getBook(id);
    const card = document.createElement('div');
    card.className = 'rec-card';
    card.innerHTML = `
      ${coverDiv(book, 'rec-cover')}
      <div class="rec-info">
        <div class="rec-title">${book.title}</div>
        <div class="rec-author">${book.author}</div>
        <div class="rec-why">${whyRec[id]}</div>
      </div>
    `;
    card.addEventListener('click', () => openBookModal(id));
    grid.appendChild(card);
  });
}

// ── Progress Modal ────────────────────────────────────────
let activeProgressId = null;

function openProgress(id) {
  const book = getBook(id);
  const entry = state.current.find(e => e.bookId === id);
  activeProgressId = id;

  document.getElementById('modalCover').style.cssText = `background:${book.color}`;
  document.getElementById('modalCover').textContent = book.emoji;
  document.getElementById('modalTitle').textContent = book.title;
  document.getElementById('modalAuthor').textContent = book.author;
  document.getElementById('modalTotal').textContent = `/ ${book.pages} pages`;
  document.getElementById('pageInput').value = entry ? entry.pagesRead : '';
  document.getElementById('pageInput').max = book.pages;

  updateModalBar(entry ? entry.pagesRead : 0, book.pages);
  document.getElementById('progressModal').classList.add('open');
}

function updateModalBar(read, total) {
  const p = Math.min(100, Math.round((read / total) * 100));
  document.getElementById('modalBar').style.width = p + '%';
  document.getElementById('modalPercent').textContent = p + '%';
}

document.getElementById('pageInput').addEventListener('input', function() {
  const id = activeProgressId;
  if (!id) return;
  const book = getBook(id);
  const val = parseInt(this.value) || 0;
  updateModalBar(val, book.pages);
});

function saveProgress() {
  const val = parseInt(document.getElementById('pageInput').value) || 0;
  const book = getBook(activeProgressId);
  const clamped = Math.min(val, book.pages);
  const idx = state.current.findIndex(e => e.bookId === activeProgressId);
  if (idx !== -1) state.current[idx].pagesRead = clamped;
  save();
  renderCurrent();
  closeModal();
}

function markFinished() {
  state.current = state.current.filter(e => e.bookId !== activeProgressId);
  if (!state.history.find(e => e.bookId === activeProgressId)) {
    state.history.unshift({ bookId: activeProgressId, finishedDate: new Date().toISOString() });
  }
  save();
  renderCurrent();
  renderHistory();
  closeModal();
}

function closeModal() {
  document.getElementById('progressModal').classList.remove('open');
  activeProgressId = null;
}

// ── Book Action Modal ─────────────────────────────────────
let activeBookId = null;

function openBookModal(id) {
  const book = getBook(id);
  activeBookId = id;

  document.getElementById('bmCover').style.cssText = `background:${book.color}`;
  document.getElementById('bmCover').textContent = book.emoji;
  document.getElementById('bmTitle').textContent = book.title;
  document.getElementById('bmAuthor').textContent = book.author;
  document.getElementById('bmGenre').textContent = book.genre;
  document.getElementById('bmDesc').textContent = book.desc;
  document.getElementById('bmPages').textContent = `${book.pages} pages`;

  // Update bookmark button
  const isWished = state.wishlist.includes(id);
  document.querySelector('#bookModal .modal-btn.secondary').textContent =
    isWished ? '🔖 Remove Bookmark' : '🔖 Bookmark';

  document.getElementById('bookModal').classList.add('open');
}

function addToCurrent() {
  if (!state.current.find(e => e.bookId === activeBookId)) {
    // Remove from wishlist if there
    state.wishlist = state.wishlist.filter(id => id !== activeBookId);
    state.current.push({ bookId: activeBookId, pagesRead: 0 });
    save();
    renderCurrent();
    renderWishlist();
  }
  closeBookModal();
}

function toggleBookmark() {
  const idx = state.wishlist.indexOf(activeBookId);
  if (idx === -1) {
    state.wishlist.push(activeBookId);
  } else {
    state.wishlist.splice(idx, 1);
  }
  save();
  renderWishlist();
  // Update button text live
  const isWished = state.wishlist.includes(activeBookId);
  document.querySelector('#bookModal .modal-btn.secondary').textContent =
    isWished ? '🔖 Remove Bookmark' : '🔖 Bookmark';
}

function closeBookModal() {
  document.getElementById('bookModal').classList.remove('open');
  activeBookId = null;
}

// Close modals on overlay click
document.getElementById('progressModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.getElementById('bookModal').addEventListener('click', function(e) {
  if (e.target === this) closeBookModal();
});

// ── Init ─────────────────────────────────────────────────
renderGenres();
renderBrowse();
renderCurrent();
renderHistory();
renderWishlist();
renderRec();