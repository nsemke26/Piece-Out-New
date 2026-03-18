/* =====================================================
   PIECE OUT  -  4×4 Sliding Puzzle Game
   Vanilla JS  |  Touch + Mouse  |  localStorage LB

   This script handles the entire application lifecycle, from 
   the splash screen to the core puzzle engine and the 
   persistent leaderboard system.

   SECTIONS:
   1. DATA           – Grid constants, puzzle catalog, category list, and name banks.
   2. STATE          – Centralized state management for the active game session.
   3. DOM CACHE      – Efficient element querying and storage.
   4. HELPERS        – Utility functions for formatting, randomizing, and scoring.
   5. PLAYER         – LocalStorage management for persistent player profiles.
   6. LEADERBOARD    – CRUD operations for the local high-score system.
   7. NAVIGATION     – Screen switching and modal overlay management.
   8. SPLASH         – Entry point logic and auto-login checks.
   9. NAME ENTRY     – User onboarding and guest account generation.
  10. CATEGORIES     – Dynamic rendering of the puzzle selection interface.
  11. DETAILS MODAL  – Pre-game puzzle previews.
  12. PUZZLE ENGINE  – Core 4x4 grid logic, shuffling, and win-state detection.
  13. DRAG / TOUCH   – Advanced pointer-event handlers for intuitive gameplay.
  14. TIMER          – Accurate gameplay duration tracking.
  15. GAME FLOW      – High-level orchestration of play, end, and reset cycles.
  16. HELP MODAL     – In-game reference imagery for the player.
  17. COMPLETE MODAL – Post-solve performance summary.
  18. LEADERBOARD UI – Rendering the competitive global rankings.
  19. GAME BUTTONS   – Controls for game navigation and debug tools.
  20. INIT           – Application bootstrap and event wiring.
   ===================================================== */


/* ==========================================================================
   1. DATA
   Static configuration and the puzzle database. The catalog is organized by 
   thematic categories to facilitate easy navigation and filtering.
   ========================================================================== */

const GRID = 4;                       // 4x4 grid dimensions
const TILES = GRID * GRID;            // Total slots (15 tiles + 1 empty)
const SHUFFLE_MOVES = 300;            // Number of random moves to ensure difficulty
const IMG = './images/joaquin.png';    // Placeholder image used across the demo

// Defined categories for the sidebar navigation
const CATEGORIES = [
  { id: 'landscapes', name: 'Landscapes',        icon: 'ph-fill ph-mountains' },
  { id: 'movies',     name: 'Movies',            icon: 'ph-fill ph-film-slate' },
  { id: 'animals',    name: 'Animals',            icon: 'ph-fill ph-paw-print' },
  { id: 'all',        name: 'All',                icon: 'ph-fill ph-puzzle-piece' },
  { id: 'food',       name: 'Food',               icon: 'ph-fill ph-hamburger' },
  { id: 'indigenous', name: 'Indigenous Art',  icon: 'ph-fill ph-palette' },
];

// The full puzzle database
const PUZZLES = [
  // Landscapes
  { id:'land-1', title:'Royal Canadian Mint',             description:'An iconic view of the Royal Canadian Mint, known for producing circulation and collector coins.', category:'landscapes', image: "images/landscape-1.jpg" },
  { id:'land-2', title:'Exchange District',               description:'Historic warehouse architecture and vibrant streets from Winnipeg’s Exchange District.', category:'landscapes', image: "images/landscape-2.jpg" },
  { id:'land-3', title:'St Boniface Cathedral',           description:'The remarkable facade and grounds of St Boniface Cathedral, a major historic landmark.', category:'landscapes', image: "images/landscape-3.jpg" },
  { id:'land-4', title:'Canadian Museum of Human Rights', description:'The striking modern design of the Canadian Museum for Human Rights in downtown Winnipeg.', category:'landscapes', image: "images/landscape-4.jpg" },
  // Movies
  { id:'movie-1', title:'Kung Fu Panda',   description:'Po trains under Master Shifu and the Furious Five to become the Dragon Warrior.', category:'movies', image: "images/kung_fu_panda.jpg" },
  { id:'movie-2', title:'Ratatouille',     description:'Remy, a rat with a passion for cooking, helps create unforgettable dishes in Paris.',   category:'movies', image: "images/rataouille.jpg" },
  { id:'movie-3', title:'Shrek',           description:'Shrek and Donkey set out on a hilarious adventure through a fairy-tale world.',         category:'movies', image: "images/shrek.jpg" },
  { id:'movie-4', title:'Despicable Me',   description:'Gru and his mischievous Minions pull off wild schemes that turn into family moments.',    category:'movies', image: "images/despicable.jpg" },
  // Animals
  { id:'anim-1', title:'Arctic Fox',        description:'The elegant white fox navigating through the frozen tundra.',                            category:'animals', image: IMG },
  { id:'anim-2', title:'Tropical Parrot',   description:'A vibrant macaw perched on a branch in the lush rainforest.',                            category:'animals', image: IMG },
  { id:'anim-3', title:'Ocean Dolphin',     description:'Playful dolphins leaping through crystal clear tropical waters.',                        category:'animals', image: IMG },
  { id:'anim-4', title:'Safari Lion',       description:'The king of the savannah resting under an acacia tree at dusk.',                        category:'animals', image: IMG },
  // Food
  { id:'food-1', title:'Pizza Perfection',  description:'A golden, cheesy pizza with fresh toppings and a perfectly crisp crust.',                 category:'food', image: "images/food-1-pizza.jpg" },
  { id:'food-2', title:'Sushi Platter',     description:'A colorful assortment of sushi rolls and nigiri, neatly arranged and ready to serve.',   category:'food', image: "images/food-2-sushi.jpg" },
  { id:'food-3', title:'Street Tacos',      description:'Fresh street-style tacos packed with vibrant fillings, herbs, and bold flavors.',         category:'food', image: "images/food-3-tacos.jpg" },
  { id:'food-4', title:'Caesar Salad',      description:'A crisp Caesar salad with romaine, parmesan, croutons, and creamy dressing.',            category:'food', image: "images/food-4-caesar-salad.jpg" },
  // Indigenous Art
  { id:'art-1', title:'Dreamtime Stories',  description:'Aboriginal art depicting the ancient creation stories of the land.',                     category:'indigenous', image: IMG },
  { id:'art-2', title:'Totem Spirits',      description:'Traditional totem carvings representing clan histories and legends.',                    category:'indigenous', image: IMG },
  { id:'art-3', title:'Medicine Wheel',     description:'A sacred circle symbolizing the interconnection of all living beings.',                  category:'indigenous', image: IMG },
  { id:'art-4', title:'Woven Traditions',   description:'Intricate textile patterns passed down through countless generations.',                  category:'indigenous', image: IMG },
];

// Word banks for generating creative, themed random names
const NAME_PRE = [
  'Pixel','Debug','Serif','Vector','Flex','Grid','Retro','Glitch','Based',
  'Sigma','Goated','Epic','Dank','Cracked','Sudo','Async','Turbo','Mega',
  'Ultra','404','Git','CSS','HTML','Figma','Wireframe','FullStack',
  'Agile','Binary','Cached','Comic Sans',
];
const NAME_SUF = [
  'Dev','Designer','Intern','Grad','Nerd','Hacker','Coder','Noob','Pro',
  'Wizard','Guru','Legend','Senior','Junior','Gamer','Boss','Chief',
  'King','Queen','Sensei',
];


/* ==========================================================================
   2. STATE
   The Single Source of Truth for the application. All UI updates and game 
   logic transformations should derive from or update this object.
   ========================================================================== */

const state = {
  playerName: '',
  screen: 'splash',
  selectedCategory: 'landscapes',
  currentPuzzle: null,
  board: [],           // Flat array representing the 4x4 grid (0 is the empty slot)
  moves: 0,
  timeSeconds: 0,
  timerInterval: null,
  isPlaying: false,
  lastResult: null,    // Results of the last completed puzzle
};


/* ==========================================================================
   3. DOM CACHE
   A simple object-based cache to avoid expensive document.querySelector 
   calls during high-frequency events like dragging.
   ========================================================================== */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {};

function cacheDom() {
  // Navigation Screens
  dom.screens        = $$('.screen');
  dom.splash         = $('#screen-splash');
  dom.btnSplash      = $('#btn-splash');
  dom.nameScreen     = $('#screen-name');
  dom.inputName      = $('#input-name');
  dom.btnStartNamed  = $('#btn-start-named');
  dom.btnGuest       = $('#btn-guest');
  dom.catScreen      = $('#screen-categories');
  dom.catSidebar     = $('#cat-sidebar');
  dom.catMain        = $('.cat-main');
  dom.catGrid        = $('#cat-grid');
  dom.btnRandom      = $('#btn-random');

  // Game Interface
  dom.gameScreen     = $('#screen-game');
  dom.btnBack        = $('#btn-back');
  dom.gameTimer      = $('#game-timer');
  dom.puzzleGrid     = $('#puzzle-grid');
  dom.btnReset       = $('#btn-reset');
  dom.btnHelp        = $('#btn-help');

  // Leaderboard Interface
  dom.lbScreen       = $('#screen-leaderboard');
  dom.lbImage        = $('#lb-image');
  dom.lbTitle        = $('#lb-title');
  dom.lbDesc         = $('#lb-desc');
  dom.lbTbody        = $('#lb-tbody');
  dom.lbYou          = $('#lb-you');
  dom.btnLbRestart   = $('#btn-lb-restart');
  dom.btnLbHome      = $('#btn-lb-home');

  // Modals – Help
  dom.modalHelp      = $('#modal-help');
  dom.helpImage      = $('#help-image');
  dom.helpName       = $('#help-name');
  dom.helpDesc       = $('#help-desc');
  dom.btnHelpClose   = $('#btn-help-close');

  // Modals – Complete
  dom.modalComplete  = $('#modal-complete');
  dom.statMoves      = $('#stat-moves');
  dom.statTime       = $('#stat-time');
  dom.statRank       = $('#stat-rank');
  dom.btnCplClose    = $('#btn-cpl-close');
  dom.btnCplLb       = $('#btn-cpl-lb');
  dom.btnCplCats     = $('#btn-cpl-cats');
  dom.btnCplRestart  = $('#btn-cpl-restart');

  // Modals – Details
  dom.modalDetails   = $('#modal-details');
  dom.detailsImage   = $('#details-image');
  dom.detailsName    = $('#details-name');
  dom.detailsDesc    = $('#details-desc');
  dom.detailsCat     = $('#details-cat');
  dom.btnDetailsPlay = $('#btn-details-play');
  dom.btnDetailsClose= $('#btn-details-close');
}


/* ==========================================================================
   4. HELPERS
   Small, reusable utility functions to keep core logic clean and readable.
   ========================================================================== */

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

// Creates a composite name from the pre/suf word banks
function generateName() {
  return rand(NAME_PRE) + rand(NAME_SUF) + randInt(0, 99);
}

// Converts seconds into a user-friendly M:SS format
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m + ':' + String(sec).padStart(2, '0');
}

// Custom scoring algorithm: moves are prioritized, time acts as a minor penalty
function calculateScore(moves, timeSec) {
  return moves + Math.floor(timeSec * 1.5);
}

// Data fetching helpers
function puzzlesForCategory(catId) {
  if (catId === 'all') return [...PUZZLES];
  return PUZZLES.filter(p => p.category === catId);
}

function getPuzzle(id) {
  return PUZZLES.find(p => p.id === id);
}


/* ==========================================================================
   5. PLAYER (localStorage)
   Persists player data across browser sessions to improve UX on return.
   ========================================================================== */

const PLAYER_KEY = 'pieceout_player';

function loadPlayer() {
  const raw = localStorage.getItem(PLAYER_KEY);
  if (raw) {
    state.playerName = JSON.parse(raw).name;
    return true;
  }
  return false;
}

function savePlayer(name) {
  state.playerName = name;
  localStorage.setItem(PLAYER_KEY, JSON.stringify({ name }));
}


/* ==========================================================================
   6. LEADERBOARD (localStorage, per puzzle)
   Handles storage and retrieval of high scores. Each puzzle has its own 
   dedicated leaderboard to maintain granular competitiveness.
   ========================================================================== */

function lbKey(puzzleId) { return 'pieceout_lb_' + puzzleId; }

function getLeaderboard(puzzleId) {
  const raw = localStorage.getItem(lbKey(puzzleId));
  return raw ? JSON.parse(raw) : [];
}

// Saves a new entry, sorts by score, and trims the list to the top 50
function saveLeaderboardEntry(puzzleId, entry) {
  const lb = getLeaderboard(puzzleId);
  lb.push(entry);
  lb.sort((a, b) => a.score - b.score);
  const trimmed = lb.slice(0, 50);
  localStorage.setItem(lbKey(puzzleId), JSON.stringify(trimmed));
  return trimmed;
}


/* ==========================================================================
   7. NAVIGATION
   Orchestrates screen transitions by toggling visibility classes.
   ========================================================================== */

function showScreen(id) {
  dom.screens.forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
  state.screen = id;
}

function openModal(id) {
  const el = document.getElementById('modal-' + id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById('modal-' + id);
  if (el) el.classList.remove('open');
}

function closeAllModals() {
  $$('.modal-overlay').forEach(m => m.classList.remove('open'));
}

function openNameOverlay() {
  dom.nameScreen.classList.add('open');
  dom.inputName.value = '';
  dom.inputName.focus();
}

function closeNameOverlay() {
  dom.nameScreen.classList.remove('open');
}


/* ==========================================================================
   8. SPLASH
   The application landing point. Checks for existing user profiles to 
   optionally skip the name entry process.
   ========================================================================== */

function initSplash() {
  const go = () => {
    openNameOverlay();
  };
  dom.btnSplash.addEventListener('click', (e) => { e.stopPropagation(); go(); });
}


/* ==========================================================================
   9. NAME ENTRY
   Validates and saves player identity. Guest accounts provide a friction-free 
   path to gameplay while still maintaining a persistent identity for the LB.
   ========================================================================== */

function initNameEntry() {
  dom.btnStartNamed.addEventListener('click', () => {
    const name = dom.inputName.value.trim();
    if (!name) { dom.inputName.focus(); return; }
    savePlayer(name);
    closeNameOverlay();
    showScreen('categories');
    renderCategories();
  });

  dom.btnGuest.addEventListener('click', () => {
    savePlayer(generateName());
    closeNameOverlay();
    showScreen('categories');
    renderCategories();
  });

  dom.nameScreen.addEventListener('click', (e) => {
    if (e.target === dom.nameScreen) closeNameOverlay();
  });

  dom.inputName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') dom.btnStartNamed.click();
  });
}


/* ==========================================================================
   10. CATEGORIES
   Populates the category navigation and puzzle grid. Uses a template-based 
   approach to dynamically generate cards from the PUZZLES data array.
   ========================================================================== */

function renderCategories() {
  renderSidebar();
  renderCategoryGrid(state.selectedCategory);
}

function renderSidebar() {
  dom.catSidebar.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (cat.id === state.selectedCategory ? ' active' : '');
    const iconMarkup = cat.iconClass
      ? `<i class="${cat.iconClass}" aria-hidden="true"></i>`
      : (typeof cat.icon === 'string' && cat.icon.includes('ph-'))
        ? `<i class="${cat.icon}" aria-hidden="true"></i>`
        : cat.icon;
    btn.innerHTML = `<span class="cat-btn__icon">${iconMarkup}</span> ${cat.name}`;
    btn.addEventListener('click', () => {
      state.selectedCategory = cat.id;
      renderCategories();
    });
    dom.catSidebar.appendChild(btn);
  });
}

function renderCategoryGrid(catId) {
  const puzzles = puzzlesForCategory(catId);
  dom.catScreen.classList.toggle('screen-categories--four', puzzles.length === 4);
  dom.catScreen.classList.toggle('screen-categories--all', catId === 'all');
  if (catId === 'all' && dom.catMain) dom.catMain.scrollTop = 0;
  dom.catGrid.innerHTML = '';
  puzzles.forEach(pz => {
    const card = document.createElement('div');
    card.className = 'puzzle-card';
    card.innerHTML = `
      <div class="puzzle-card__img" style="background-image:url('${pz.image}')"></div>
      <div class="puzzle-card__footer">
        <span class="puzzle-card__title">${pz.title}</span>
        <button class="puzzle-card__details" data-id="${pz.id}">DETAILS</button>
      </div>`;

    card.querySelector('.puzzle-card__img').addEventListener('click', () => startGame(pz.id));
    card.querySelector('.puzzle-card__details').addEventListener('click', (e) => {
      e.stopPropagation();
      showDetails(pz.id);
    });

    dom.catGrid.appendChild(card);
  });
}

function initCategories() {
  dom.btnRandom.addEventListener('click', () => {
    const puzzles = puzzlesForCategory(state.selectedCategory);
    if (!puzzles.length) return;
    const chosen = rand(puzzles);
    startGame(chosen.id);
  });
}


/* ==========================================================================
   11. DETAILS MODAL
   Contextual preview of a puzzle before starting. Shows descriptions and 
   category tags.
   ========================================================================== */

let detailsPuzzleId = null;

function showDetails(puzzleId) {
  const pz = getPuzzle(puzzleId);
  if (!pz) return;
  detailsPuzzleId = puzzleId;
  dom.detailsImage.style.backgroundImage = `url('${pz.image}')`;
  dom.detailsName.textContent = pz.title;
  dom.detailsDesc.textContent = pz.description;
  const cat = CATEGORIES.find(c => c.id === pz.category);
  dom.detailsCat.textContent = cat ? `Category: ${cat.name}` : '';
  openModal('details');
}

function initDetailsModal() {
  dom.btnDetailsPlay.addEventListener('click', () => {
    closeModal('details');
    if (detailsPuzzleId) startGame(detailsPuzzleId);
  });
  dom.btnDetailsClose.addEventListener('click', () => closeModal('details'));
}


/* ==========================================================================
   12. PUZZLE ENGINE
   Core game mechanics. Utilizes background-position CSS to slice a single 
   image into grid tiles. Employs random valid-move shuffling to ensure 
   the puzzle is always solvable.
   ========================================================================== */

const tileEls = {};   // Maps tile numerical values to their DOM elements

// Determines adjacent indices in a flat array for a 2D grid
function neighbors(pos) {
  const r = Math.floor(pos / GRID), c = pos % GRID;
  const out = [];
  if (r > 0) out.push(pos - GRID);
  if (r < GRID - 1) out.push(pos + GRID);
  if (c > 0) out.push(pos - 1);
  if (c < GRID - 1) out.push(pos + 1);
  return out;
}

// Shuffles from solved state using valid moves
function shuffleBoard() {
  state.board = [];
  for (let i = 1; i < TILES; i++) state.board.push(i);
  state.board.push(0);

  let emptyPos = TILES - 1;
  let lastPos = -1;
  for (let i = 0; i < SHUFFLE_MOVES; i++) {
    const adj = neighbors(emptyPos).filter(n => n !== lastPos);
    const pick = rand(adj);
    state.board[emptyPos] = state.board[pick];
    state.board[pick] = 0;
    lastPos = emptyPos;
    emptyPos = pick;
  }
  if (isSolved()) shuffleBoard();
}

function isSolved() {
  for (let i = 0; i < TILES - 1; i++) {
    if (state.board[i] !== i + 1) return false;
  }
  return state.board[TILES - 1] === 0;
}

function createTiles() {
  dom.puzzleGrid.innerHTML = '';
  Object.keys(tileEls).forEach(k => delete tileEls[k]);

  for (let num = 1; num < TILES; num++) {
    const el = document.createElement('div');
    el.className = 'puzzle-tile';
    el.dataset.tile = num;

    const srcRow = Math.floor((num - 1) / GRID);
    const srcCol = (num - 1) % GRID;
    const bx = (srcCol / (GRID - 1)) * 100;
    const by = (srcRow / (GRID - 1)) * 100;
    el.style.backgroundImage = `url('${state.currentPuzzle.image}')`;
    el.style.backgroundSize = '400% 400%';
    el.style.backgroundPosition = `${bx}% ${by}%`;

    tileEls[num] = el;
    dom.puzzleGrid.appendChild(el);
  }
}

// Syncs the DOM tile positions with the internal state array using CSS transforms
function renderBoard(animate) {
  for (let pos = 0; pos < TILES; pos++) {
    const num = state.board[pos];
    if (num === 0) continue;
    const el = tileEls[num];
    const row = Math.floor(pos / GRID);
    const col = pos % GRID;

    if (animate === false) el.style.transition = 'none';
    el.style.transform = `translate(${col * 100}%, ${row * 100}%)`;
    el.dataset.position = pos;
    if (animate === false) { el.offsetHeight; el.style.transition = ''; }
  }
}

function performMove(tilePos) {
  const emptyPos = state.board.indexOf(0);
  state.board[emptyPos] = state.board[tilePos];
  state.board[tilePos] = 0;
  state.moves++;
  renderBoard(true);
  if (isSolved()) endGame();
}


/* ==========================================================================
   13. DRAG / TOUCH
   Unified pointer events for smooth dragging and tapping. Includes 
   directional snapping and axis constraints to mimic a physical sliding 
   puzzle board.
   ========================================================================== */

const drag = {
  active: false,
  el: null,
  tilePos: -1,
  axis: null,
  dir: 0,
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0,
  tileSize: 0,
  baseCol: 0,
  baseRow: 0,
};

function onPointerDown(e) {
  if (!state.isPlaying) return;
  const el = e.target.closest('.puzzle-tile');
  if (!el) return;

  const tilePos = parseInt(el.dataset.position, 10);
  const emptyPos = state.board.indexOf(0);
  const tR = Math.floor(tilePos / GRID), tC = tilePos % GRID;
  const eR = Math.floor(emptyPos / GRID), eC = emptyPos % GRID;

  let axis = null, dir = 0;
  if (tR === eR && Math.abs(tC - eC) === 1) { axis = 'x'; dir = eC > tC ? 1 : -1; }
  else if (tC === eC && Math.abs(tR - eR) === 1) { axis = 'y'; dir = eR > tR ? 1 : -1; }
  else return;

  e.preventDefault();
  el.setPointerCapture(e.pointerId);
  el.classList.add('dragging');

  drag.active = true;
  drag.el = el;
  drag.tilePos = tilePos;
  drag.axis = axis;
  drag.dir = dir;
  drag.startX = e.clientX;
  drag.startY = e.clientY;
  drag.tileSize = el.offsetWidth;
  drag.baseCol = tC;
  drag.baseRow = tR;
}

function onPointerMove(e) {
  if (!drag.active) return;
  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;

  if (drag.axis === 'x') {
    let px = dx;
    if (drag.dir === 1) px = Math.max(0, Math.min(px, drag.tileSize));
    else px = Math.min(0, Math.max(px, -drag.tileSize));
    drag.offsetX = px;
    drag.el.style.transform = `translate(calc(${drag.baseCol * 100}% + ${px}px), ${drag.baseRow * 100}%)`;
  } else {
    let py = dy;
    if (drag.dir === 1) py = Math.max(0, Math.min(py, drag.tileSize));
    else py = Math.min(0, Math.max(py, -drag.tileSize));
    drag.offsetY = py;
    drag.el.style.transform = `translate(${drag.baseCol * 100}%, calc(${drag.baseRow * 100}% + ${py}px))`;
  }
}

function onPointerUp(e) {
  if (!drag.active) return;
  const dx = Math.abs(e.clientX - drag.startX);
  const dy = Math.abs(e.clientY - drag.startY);
  const isTap = dx < 8 && dy < 8;
  const threshold = drag.tileSize * 0.25;

  let shouldMove = isTap;
  if (!isTap) {
    shouldMove = drag.axis === 'x' ? Math.abs(drag.offsetX) > threshold : Math.abs(drag.offsetY) > threshold;
  }

  drag.el.classList.remove('dragging');
  drag.el.style.transition = '';
  if (shouldMove) performMove(drag.tilePos);
  else renderBoard(true);

  drag.active = false;
}

function initDrag() {
  dom.puzzleGrid.addEventListener('pointerdown', onPointerDown);
  dom.puzzleGrid.addEventListener('pointermove', onPointerMove);
  dom.puzzleGrid.addEventListener('pointerup',   onPointerUp);
  dom.puzzleGrid.addEventListener('pointercancel', onPointerUp);
}


/* ==========================================================================
   14. TIMER
   Continuous second counter used for performance evaluation.
   ========================================================================== */

function startTimer() {
  stopTimer();
  state.timeSeconds = 0;
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timeSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function updateTimerDisplay() {
  dom.gameTimer.textContent = '\u23F1 ' + formatTime(state.timeSeconds);
}


/* ==========================================================================
   15. GAME FLOW
   High-level functions to control the state of the active puzzle session.
   ========================================================================== */

function startGame(puzzleId) {
  closeAllModals();
  const pz = getPuzzle(puzzleId);
  if (!pz) return;
  state.currentPuzzle = pz;
  state.moves = 0;
  state.isPlaying = true;
  state.lastResult = null;

  showScreen('game');
  createTiles();
  shuffleBoard();
  renderBoard(false);
  startTimer();
}

function endGame() {
  state.isPlaying = false;
  stopTimer();

  const moves = state.moves;
  const time = state.timeSeconds;
  const score = calculateScore(moves, time);

  const entry = { player: state.playerName, moves, time, score, ts: Date.now() };
  const lb = saveLeaderboardEntry(state.currentPuzzle.id, entry);

  // Calculate distinct ranks for moves, time, and combined score
  const byScore = [...lb].sort((a, b) => a.score - b.score);
  const byMoves = [...lb].sort((a, b) => a.moves - b.moves);
  const byTime  = [...lb].sort((a, b) => a.time  - b.time);

  state.lastResult = {
    moves, time, score,
    overallRank: byScore.findIndex(e => e.ts === entry.ts) + 1,
    moveRank:    byMoves.findIndex(e => e.ts === entry.ts) + 1,
    timeRank:    byTime.findIndex(e => e.ts === entry.ts) + 1
  };

  showCompleteModal(moves, time, state.lastResult.moveRank, state.lastResult.timeRank);
}

function resetGame() {
  if (!state.currentPuzzle) return;
  closeAllModals();
  state.moves = 0;
  state.isPlaying = true;
  shuffleBoard();
  renderBoard(false);
  startTimer();
}


/* ==========================================================================
   16. HELP MODAL
   Allows the player to view the completed reference image during play.
   ========================================================================== */

function showHelpModal() {
  if (!state.currentPuzzle) return;
  dom.helpImage.style.backgroundImage = `url('${state.currentPuzzle.image}')`;
  dom.helpName.textContent = state.currentPuzzle.title;
  dom.helpDesc.textContent = state.currentPuzzle.description;
  openModal('help');
}

function initHelpModal() {
  dom.btnHelp.addEventListener('click', showHelpModal);
  dom.btnHelpClose.addEventListener('click', () => closeModal('help'));
}


/* ==========================================================================
   17. COMPLETE MODAL
   Congratulatory modal displayed upon solve. Links to the leaderboard.
   ========================================================================== */

function showCompleteModal(moves, time, moveRank, timeRank) {
  dom.statMoves.textContent = moves;
  dom.statTime.textContent = formatTime(time);
  dom.statRank.textContent = `Moves \u2013 #${moveRank}  |  Time \u2013 #${timeRank}`;
  openModal('complete');
}

function initCompleteModal() {
  dom.btnCplClose.addEventListener('click', () => closeModal('complete'));
  dom.btnCplLb.addEventListener('click', () => { closeModal('complete'); showLeaderboard(); });
  dom.btnCplCats.addEventListener('click', () => { closeAllModals(); stopTimer(); showScreen('categories'); renderCategories(); });
  dom.btnCplRestart.addEventListener('click', resetGame);
}


/* ==========================================================================
   18. LEADERBOARD UI
   Renders the local high-score table. Includes a highlighted 'YOU' row 
   to help users identify their current standing in the global rankings.
   ========================================================================== */

function showLeaderboard() {
  if (!state.currentPuzzle) return;
  const pz = state.currentPuzzle;
  const lb = getLeaderboard(pz.id);

  dom.lbImage.style.backgroundImage = `url('${pz.image}')`;
  dom.lbTitle.textContent = pz.title;
  dom.lbDesc.textContent = pz.description;

  const sorted = [...lb].sort((a, b) => a.score - b.score);
  const topRows = sorted.slice(0, 5);

  dom.lbTbody.innerHTML = '';
  topRows.forEach((entry, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-rank">${i + 1}</td>
      <td class="col-player">${entry.player}</td>
      <td class="col-time">${formatTime(entry.time)}</td>
      <td class="col-moves">${entry.moves}</td>`;
    dom.lbTbody.appendChild(tr);
  });

  if (state.lastResult) {
    dom.lbYou.innerHTML = `
      <span class="col-rank">${state.lastResult.overallRank}</span>
      <span class="col-player">YOU</span>
      <span class="col-time">${formatTime(state.lastResult.time)}</span>
      <span class="col-moves">${state.lastResult.moves}</span>`;
    dom.lbYou.style.display = 'flex';
  } else {
    dom.lbYou.style.display = 'none';
  }

  showScreen('leaderboard');
}

function initLeaderboard() {
  dom.btnLbRestart.addEventListener('click', () => { if (state.currentPuzzle) startGame(state.currentPuzzle.id); });
  dom.btnLbHome.addEventListener('click', () => { showScreen('categories'); renderCategories(); });
}


/* ==========================================================================
   19. GAME BUTTONS
   Connects the core UI controls.
   ========================================================================== */

function initGameButtons() {
  dom.btnBack.addEventListener('click', () => { stopTimer(); state.isPlaying = false; showScreen('categories'); renderCategories(); });
  dom.btnReset.addEventListener('click', resetGame);
  if ($('#btn-debug-solve')) $('#btn-debug-solve').addEventListener('click', debugSolve);
}

// Development helper to bypass gameplay for flow testing
function debugSolve() {
  if (!state.isPlaying || !state.currentPuzzle) return;
  for (let i = 0; i < TILES - 1; i++) state.board[i] = i + 1;
  state.board[TILES - 1] = 0;
  state.moves += 1;
  renderBoard(true);
  setTimeout(() => endGame(), 300);
}


/* ==========================================================================
   20. INIT
   Entry point. Sets up the application and starts at the splash screen.
   ========================================================================== */

function initApp() {
  cacheDom();
  initSplash();
  initNameEntry();
  initCategories();
  initDrag();
  initHelpModal();
  initCompleteModal();
  initDetailsModal();
  initGameButtons();
  initLeaderboard();
  showScreen('splash');
}

document.addEventListener('DOMContentLoaded', initApp);
