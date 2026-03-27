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
const MOTION = {
  transientClassResetMs: 420,
  tileRewardDelayMs: 140,
  completeModalDelayMs: 1020,
  reducedCompleteModalDelayMs: 200,
  completeBoardRestDelayMs: 620,
  completeTileStaggerMs: 28,
  completeTimerResetMs: 560,
  completeSettleResetMs: 420,
  completeParticlesResetMs: 1320,
};
const GAME_INTRO_MOTION = {
  backgroundOpacity: 0.5,
  backgroundDuration: 0.3,
  backgroundStagger: 0.04,
  backgroundOffsetX: 20,
  backgroundOffsetY: 16,
  backgroundStartScale: 1.035,
  backgroundEase: 'power2.out',
  boardOffsetY: 34,
  boardStartScale: 0.952,
  boardAnticipationOffsetY: 42,
  boardAnticipationScale: 0.938,
  boardAnticipationDuration: 0.06,
  boardAnticipationEase: 'power1.in',
  boardDuration: 0.4,
  boardEase: 'back.out(1.34)',
  titleOffsetY: 18,
  titleDuration: 0.28,
  titleEase: 'back.out(1.02)',
  timerOffsetY: 16,
  timerDuration: 0.26,
  timerEase: 'back.out(1.02)',
  tileOffsetY: 24,
  tileStartScale: 0.925,
  tileCoverStartOpacity: 0.72,
  tileDuration: 0.36,
  tileStagger: 0.014,
  tileEase: 'back.out(1.24)',
  tileCoverEase: 'power1.out',
  buttonOffsetY: 18,
  buttonStartScale: 0.94,
  buttonBackDelay: 0,
  buttonCenterDelay: 0.05,
  buttonDuration: 0.26,
  buttonCenterStagger: 0.03,
  buttonEase: 'back.out(1.24)',
  readyAccentStart: 0.24,
  readyAccentDuration: 0.12,
  readyAccentEase: 'power1.out',
  readyAccentBoardShadow: '0 18px 42px rgba(129, 118, 222, .22)',
  readyAccentTimerScale: 1.035,
  readyAccentTimerY: -1,
};

// Defined categories for the sidebar navigation
const CATEGORIES = [
  { id: 'landscapes', name: 'Landscapes',        icon: 'ph-fill ph-mountains' },
  { id: 'movies',     name: 'Movies',            icon: 'ph-fill ph-film-slate' },
  { id: 'animals',    name: 'Animals',            icon: 'ph-fill ph-paw-print' },
  { id: 'all',        name: 'All',                icon: 'ph-fill ph-puzzle-piece' },
  { id: 'food',       name: 'Food',               icon: 'ph-fill ph-hamburger' },
  { id: 'art',        name: 'Art',  icon: 'ph-fill ph-palette' },
];

// The full puzzle database
const PUZZLES = [
  // Landscapes
  { id:'land-1', title:'Royal Canadian Mint',             description:'An iconic view of the Royal Canadian Mint, known for producing circulation and collector coins.',  category:'landscapes', image: "images/landscape-1.jpg" },
  { id:'land-2', title:'Exchange District',               description:'Historic warehouse architecture and vibrant streets from Winnipeg’s Exchange District.',           category:'landscapes', image: "images/landscape-2.jpg" },
  { id:'land-3', title:'St Boniface Cathedral',           description:'The remarkable facade and grounds of St Boniface Cathedral, a major historic landmark.',           category:'landscapes', image: "images/landscape-3.jpg" },
  { id:'land-4', title:'Canadian Museum of Human Rights', description:'The striking modern design of the Canadian Museum for Human Rights in downtown Winnipeg.',         category:'landscapes', image: "images/landscape-4.jpg" },
  // Movies
  { id:'movie-1', title:'Zootopia',         description:'Detective Judy Hops and Nick Wild from Zootpia solving a crime one again.',                category:'movies', image: "images/zootopia.jpg" },
  { id:'movie-2', title:'Ratatouille',      description:'Remy, a rat with a passion for cooking, helps create unforgettable dishes in Paris.',      category:'movies', image: "images/ratatoullie.jpg" },
  { id:'movie-3', title:'Shrek',            description:'Shrek and Donkey set out on a hilarious adventure through a fairy-tale world.',            category:'movies', image: "images/shrek.jpg" },
  { id:'movie-4', title:'Despicable Me',    description:'Gru and his mischievous Minions pull off wild schemes that turn into family moments.',     category:'movies', image: "images/despicable.jpg" },
  // Animals
  { id:'anim-1', title:'Small Birdie',      description:'The small bird sits in the water for a refreshing summer bath.',                           category:'animals', image: "images/animals-1.jpg" },
  { id:'anim-2', title:'floppy Bunny',      description:'The bunny with floppy ears listening to the breeze and the summer sounds.',                category:'animals', image: "images/animals-2.jpg" },
  { id:'anim-3', title:'Sleepy Kitty',      description:'The sleepy kitty is taking an afternoon nap in the sunlight.',                             category:'animals', image: "images/animals-3.jpg" },
  { id:'anim-4', title:'Tuff Puppies',      description:'Two puppies posing on the beach, showing the world just how tuff they are.',               category:'animals', image: "images/animals-4.jpg" },
  // Food
  { id:'food-1', title:'Pizza Perfection',  description:'A golden, cheesy pizza with fresh toppings and a perfectly crisp crust.',                  category:'food', image: "images/food-1-pizza.jpg" },
  { id:'food-2', title:'Sushi Platter',     description:'A colorful assortment of sushi rolls and nigiri, neatly arranged and ready to serve.',     category:'food', image: "images/food-2-sushi.jpg" },
  { id:'food-3', title:'Street Tacos',      description:'Fresh street-style tacos packed with vibrant fillings, herbs, and bold flavors.',          category:'food', image: "images/food-3-tacos.jpg" },
  { id:'food-4', title:'Caesar Salad',      description:'A crisp Caesar salad with romaine, parmesan, croutons, and creamy dressing.',              category:'food', image: "images/food-4-caesar-salad.jpg" },
  // Art
  { id:'art-1', title:'The Great Wave',     description:"Hokusai's iconic woodblock print captures a towering wave curling over boats beneath Mount Fuji.",              category:'art', image: "images/art-1.jpg" },
  { id:'art-2', title:'Starry Night',       description:"Van Gogh's swirling night sky glows above a quiet village in one of the world's most recognizable paintings.",  category:'art', image: "images/art-2.jpg" },
  { id:'art-3', title:'Water Lilies',       description:"Monet's serene scene of floating lilies reflects light, color, and movement across the water's surface.",       category:'art', image: "images/art-3.jpeg" },
  { id:'art-4', title:'American Gothic',    description:"Grant Wood's famous portrait presents a stern farmer and his daughter before a simple rural home.",             category:'art', image: "images/art-4.jpg" },
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
  isCompleting: false,
  completeModalTimeout: null,
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
  dom.gameHeader     = $('.game-header');
  dom.gameTitle      = $('.game-header__title');
  dom.btnBack        = $('#btn-back');
  dom.gameTimer      = $('#game-timer');
  dom.gameBody       = $('.game-body');
  dom.completeParticles = $('#complete-particles');
  dom.puzzleGrid     = $('#puzzle-grid');
  dom.gameFooter     = $('.game-footer');
  dom.gameFooterCenter = $('.game-footer__center');
  dom.btnReset       = $('#btn-reset');
  dom.btnHelp        = $('#btn-help');
  dom.gameActionButtons = [dom.btnBack, dom.btnReset, dom.btnHelp].filter(Boolean);
  dom.gameBackgroundShapes = Array.from(
    $$('#screen-game .background-logo, #screen-game .background-logo-2')
  );

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
  if (state.screen === 'game' && id !== 'game') killGameIntro();
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
let gameIntroTl = null;

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

function orderedTileElements() {
  return Object.values(tileEls).sort((a, b) => {
    const posA = parseInt(a.dataset.position ?? Number.MAX_SAFE_INTEGER, 10);
    const posB = parseInt(b.dataset.position ?? Number.MAX_SAFE_INTEGER, 10);
    return posA - posB;
  });
}

function centerOutTileElements() {
  const boardCenter = (GRID - 1) / 2;

  return Object.values(tileEls).sort((a, b) => {
    const posA = parseInt(a.dataset.position ?? Number.MAX_SAFE_INTEGER, 10);
    const posB = parseInt(b.dataset.position ?? Number.MAX_SAFE_INTEGER, 10);
    const rowA = Math.floor(posA / GRID);
    const colA = posA % GRID;
    const rowB = Math.floor(posB / GRID);
    const colB = posB % GRID;
    const dxA = Math.abs(colA - boardCenter);
    const dyA = Math.abs(rowA - boardCenter);
    const dxB = Math.abs(colB - boardCenter);
    const dyB = Math.abs(rowB - boardCenter);
    const distA = Math.hypot(dxA, dyA);
    const distB = Math.hypot(dxB, dyB);
    const manhattanA = dxA + dyA;
    const manhattanB = dxB + dyB;

    return (
      distA - distB ||
      manhattanA - manhattanB ||
      rowA - rowB ||
      colA - colB
    );
  });
}

function clearGameIntroStyles() {
  [
    dom.gameTitle,
    dom.gameTimer,
    dom.puzzleGrid,
    ...dom.gameActionButtons,
    ...dom.gameBackgroundShapes,
  ].filter(Boolean).forEach((el) => {
    el.style.opacity = '';
    el.style.visibility = '';
    el.style.transform = '';
    el.style.transformOrigin = '';
    el.style.boxShadow = '';
    el.style.filter = '';
  });

  Object.values(tileEls).forEach((el) => {
    el.style.opacity = '';
    el.style.removeProperty('--tile-intro-y');
    el.style.removeProperty('--tile-intro-scale');
    el.style.removeProperty('--tile-intro-cover-opacity');
    el.classList.remove('is-intro-animating');
  });
}

function killGameIntro() {
  if (gameIntroTl) {
    gameIntroTl.kill();
    gameIntroTl = null;
  }
  clearGameIntroStyles();
}

function playGameIntro() {
  killGameIntro();

  if (!window.gsap || prefersReducedMotion() || state.screen !== 'game') return;

  const tiles = centerOutTileElements();
  const gsap = window.gsap;
  const centerButtons = [dom.btnReset, dom.btnHelp].filter(Boolean);

  gsap.set(dom.gameBackgroundShapes, {
    opacity: 0,
    x: (index) => index === 0 ? -GAME_INTRO_MOTION.backgroundOffsetX : GAME_INTRO_MOTION.backgroundOffsetX,
    y: (index) => index === 0 ? -GAME_INTRO_MOTION.backgroundOffsetY : GAME_INTRO_MOTION.backgroundOffsetY,
    scale: GAME_INTRO_MOTION.backgroundStartScale,
  });
  gsap.set(dom.gameTitle, {
    autoAlpha: 0,
    y: GAME_INTRO_MOTION.titleOffsetY,
  });
  gsap.set(dom.gameTimer, {
    autoAlpha: 0,
    y: GAME_INTRO_MOTION.timerOffsetY,
  });
  gsap.set(dom.puzzleGrid, {
    autoAlpha: 0,
    y: GAME_INTRO_MOTION.boardOffsetY,
    scale: GAME_INTRO_MOTION.boardStartScale,
    transformOrigin: '50% 50%',
  });
  gsap.set(dom.gameActionButtons, {
    autoAlpha: 0,
    y: GAME_INTRO_MOTION.buttonOffsetY,
    scale: GAME_INTRO_MOTION.buttonStartScale,
    transformOrigin: '50% 50%',
  });

  tiles.forEach((el) => {
    el.classList.add('is-intro-animating');
    el.style.setProperty('--tile-intro-y', `${GAME_INTRO_MOTION.tileOffsetY}px`);
    el.style.setProperty('--tile-intro-scale', `${GAME_INTRO_MOTION.tileStartScale}`);
    el.style.setProperty('--tile-intro-cover-opacity', `${GAME_INTRO_MOTION.tileCoverStartOpacity}`);
  });

  gameIntroTl = gsap.timeline({
    onComplete: () => {
      tiles.forEach((el) => el.classList.remove('is-intro-animating'));
      gameIntroTl = null;
      clearGameIntroStyles();
    },
  });

  gameIntroTl.addLabel('introStart', 0);
  gameIntroTl.addLabel('boardAnticipate', 0.02);
  gameIntroTl.addLabel('boardRelease', 0.08);
  gameIntroTl.addLabel('topUIIn', 0.08);
  gameIntroTl.addLabel('tilesIn', 0.14);
  gameIntroTl.addLabel('buttonsIn', 0.3);
  gameIntroTl.addLabel('readyAccent', GAME_INTRO_MOTION.readyAccentStart);

  gameIntroTl.to(dom.gameBackgroundShapes, {
    opacity: GAME_INTRO_MOTION.backgroundOpacity,
    x: 0,
    y: 0,
    scale: 1,
    duration: GAME_INTRO_MOTION.backgroundDuration,
    stagger: GAME_INTRO_MOTION.backgroundStagger,
    ease: GAME_INTRO_MOTION.backgroundEase,
  }, 'introStart');

  gameIntroTl.to(dom.puzzleGrid, {
    autoAlpha: 1,
    y: GAME_INTRO_MOTION.boardAnticipationOffsetY,
    scale: GAME_INTRO_MOTION.boardAnticipationScale,
    duration: GAME_INTRO_MOTION.boardAnticipationDuration,
    ease: GAME_INTRO_MOTION.boardAnticipationEase,
  }, 'boardAnticipate');

  gameIntroTl.to(dom.puzzleGrid, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: GAME_INTRO_MOTION.boardDuration,
    ease: GAME_INTRO_MOTION.boardEase,
  }, 'boardRelease');

  gameIntroTl.to(dom.gameTitle, {
    autoAlpha: 1,
    y: 0,
    duration: GAME_INTRO_MOTION.titleDuration,
    ease: GAME_INTRO_MOTION.titleEase,
  }, 'topUIIn');

  gameIntroTl.to(dom.gameTimer, {
    autoAlpha: 1,
    y: 0,
    duration: GAME_INTRO_MOTION.timerDuration,
    ease: GAME_INTRO_MOTION.timerEase,
  }, 'topUIIn+=0.02');

  gameIntroTl.to(tiles, {
    '--tile-intro-y': '0px',
    '--tile-intro-scale': '1',
    duration: GAME_INTRO_MOTION.tileDuration,
    stagger: GAME_INTRO_MOTION.tileStagger,
    ease: GAME_INTRO_MOTION.tileEase,
  }, 'tilesIn');

  gameIntroTl.to(tiles, {
    '--tile-intro-cover-opacity': '0',
    duration: GAME_INTRO_MOTION.tileDuration,
    stagger: GAME_INTRO_MOTION.tileStagger,
    ease: GAME_INTRO_MOTION.tileCoverEase,
  }, 'tilesIn+=0.01');

  gameIntroTl.to(dom.btnBack, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: GAME_INTRO_MOTION.buttonDuration,
    ease: GAME_INTRO_MOTION.buttonEase,
  }, `buttonsIn+=${GAME_INTRO_MOTION.buttonBackDelay}`);

  gameIntroTl.to(centerButtons, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: GAME_INTRO_MOTION.buttonDuration,
    stagger: GAME_INTRO_MOTION.buttonCenterStagger,
    ease: GAME_INTRO_MOTION.buttonEase,
  }, `buttonsIn+=${GAME_INTRO_MOTION.buttonCenterDelay}`);

  gameIntroTl.to(dom.puzzleGrid, {
    boxShadow: GAME_INTRO_MOTION.readyAccentBoardShadow,
    duration: GAME_INTRO_MOTION.readyAccentDuration,
    ease: GAME_INTRO_MOTION.readyAccentEase,
    yoyo: true,
    repeat: 1,
  }, 'readyAccent');

  gameIntroTl.to(dom.gameTimer, {
    scale: GAME_INTRO_MOTION.readyAccentTimerScale,
    y: GAME_INTRO_MOTION.readyAccentTimerY,
    duration: GAME_INTRO_MOTION.readyAccentDuration,
    ease: GAME_INTRO_MOTION.readyAccentEase,
    yoyo: true,
    repeat: 1,
  }, 'readyAccent+=0.01');
}

function getMoveMeta(tilePos) {
  const emptyPos = state.board.indexOf(0);
  const tileRow = Math.floor(tilePos / GRID);
  const tileCol = tilePos % GRID;
  const emptyRow = Math.floor(emptyPos / GRID);
  const emptyCol = emptyPos % GRID;

  let axis = null;
  let dir = 0;

  if (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) {
    axis = 'x';
    dir = emptyCol > tileCol ? 1 : -1;
  } else if (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1) {
    axis = 'y';
    dir = emptyRow > tileRow ? 1 : -1;
  }

  return {
    emptyPos,
    tileRow,
    tileCol,
    axis,
    dir,
    movable: Boolean(axis),
  };
}

function setTileBasePosition(el, col, row) {
  el.style.setProperty('--tile-x', `${col * 100}%`);
  el.style.setProperty('--tile-y', `${row * 100}%`);
}

function setTileDragOffset(el, offsetX = 0, offsetY = 0) {
  el.style.setProperty('--tile-drag-x', `${offsetX}px`);
  el.style.setProperty('--tile-drag-y', `${offsetY}px`);
}

function setTilePressed(el, isPressed) {
  if (!el) return;
  el.classList.toggle('is-pressed', isPressed);
}

function prefersReducedMotion() {
  return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function clearElementTimeout(el, key) {
  if (!el || !el[key]) return;
  clearTimeout(el[key]);
  el[key] = null;
}

function restartTransientClass(el, className, clearDelay = MOTION.transientClassResetMs) {
  if (!el) return;
  const timeoutKey = `__${className}Timeout`;
  if (el[timeoutKey]) clearTimeout(el[timeoutKey]);
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  el[timeoutKey] = setTimeout(() => {
    el.classList.remove(className);
    el[timeoutKey] = null;
  }, clearDelay);
}

function triggerInvalidTileFeedback(el) {
  restartTransientClass(el, 'is-invalid');
}

function isTileSolvedAtPosition(tileNum, pos) {
  return tileNum !== 0 && pos === tileNum - 1;
}

function countSolvedTiles() {
  let solvedCount = 0;
  for (let pos = 0; pos < TILES; pos++) {
    if (isTileSolvedAtPosition(state.board[pos], pos)) solvedCount++;
  }
  return solvedCount;
}

function triggerCorrectTileFeedback(tileNum) {
  const el = tileEls[tileNum];
  if (!el) return;
  if (el.__correctRewardDelayTimeout) clearTimeout(el.__correctRewardDelayTimeout);
  el.__correctRewardDelayTimeout = window.setTimeout(() => {
    el.__correctRewardDelayTimeout = null;
    const currentPos = parseInt(el.dataset.position, 10);
    if (isTileSolvedAtPosition(tileNum, currentPos)) restartTransientClass(el, 'is-correct');
  }, MOTION.tileRewardDelayMs);
}

function triggerTimerFeedback() {
  restartTransientClass(dom.gameTimer, 'is-ticking');
}

function triggerBoardProgressFeedback() {
  restartTransientClass(dom.puzzleGrid, 'is-progressing');
}

function clearCompletionState() {
  if (state.completeModalTimeout) clearTimeout(state.completeModalTimeout);
  state.completeModalTimeout = null;
  state.isCompleting = false;

  dom.gameTimer.classList.remove('is-ticking', 'is-complete');
  dom.puzzleGrid.classList.remove('is-progressing', 'is-completing', 'is-complete-rest');
  clearElementTimeout(dom.puzzleGrid, '__completeRestTimeout');

  if (dom.completeParticles) {
    clearElementTimeout(dom.completeParticles, '__clearParticlesTimeout');
    dom.completeParticles.replaceChildren();
  }

  Object.values(tileEls).forEach((el) => {
    clearElementTimeout(el, '__correctRewardDelayTimeout');
    clearElementTimeout(el, '__completeSettleDelayTimeout');
    el.classList.remove('is-correct', 'is-complete-settle');
  });
}

function triggerCompletionTileSettle() {
  if (prefersReducedMotion()) return;

  for (let num = 1; num < TILES; num++) {
    const el = tileEls[num];
    if (!el) continue;

    clearElementTimeout(el, '__completeSettleDelayTimeout');
    el.__completeSettleDelayTimeout = window.setTimeout(() => {
      el.__completeSettleDelayTimeout = null;
      restartTransientClass(el, 'is-complete-settle', MOTION.completeSettleResetMs);
    }, (num - 1) * MOTION.completeTileStaggerMs);
  }
}

function createCompletionParticles() {
  if (prefersReducedMotion() || !dom.completeParticles) return;

  const particles = [
    // Outer ring
    { left: '0%', top: '12%', width: '20px', height: '20px', x: '-58px', y: '-70px', rotateStart: '-12deg', rotateEnd: '26deg', color: 'rgba(110, 211, 255, .96)', shape: 'square' },
    { left: '-2%', top: '26%', width: '26px', height: '26px', x: '-70px', y: '-30px', rotateStart: '-22deg', rotateEnd: '20deg', color: 'rgba(129, 118, 222, .92)', shape: 'squircle' },
    { left: '-3%', top: '42%', width: '34px', height: '16px', x: '-74px', y: '-8px', rotateStart: '-12deg', rotateEnd: '18deg', color: 'rgba(255, 222, 45, .95)', shape: 'rect' },
    { left: '-2%', top: '60%', width: '30px', height: '14px', x: '-68px', y: '20px', rotateStart: '-8deg', rotateEnd: '16deg', color: 'rgba(249, 115, 22, .88)', shape: 'rect' },
    { left: '6%', top: '98%', width: '20px', height: '20px', x: '-32px', y: '68px', rotateStart: '-14deg', rotateEnd: '20deg', color: 'rgba(110, 211, 255, .9)', shape: 'square' },
    { left: '22%', top: '104%', width: '26px', height: '18px', x: '-10px', y: '78px', rotateStart: '-10deg', rotateEnd: '14deg', color: 'rgba(255, 222, 45, .9)', shape: 'rect' },
    { left: '40%', top: '-3%', width: '22px', height: '22px', x: '-14px', y: '-82px', rotateStart: '-20deg', rotateEnd: '26deg', color: 'rgba(157, 100, 170, .9)', shape: 'squircle' },
    { left: '54%', top: '-4%', width: '18px', height: '18px', x: '10px', y: '-86px', rotateStart: '-14deg', rotateEnd: '24deg', color: 'rgba(255, 222, 45, .92)', shape: 'square' },
    { left: '68%', top: '104%', width: '22px', height: '22px', x: '14px', y: '72px', rotateStart: '-12deg', rotateEnd: '22deg', color: 'rgba(129, 118, 222, .88)', shape: 'square' },
    { left: '84%', top: '103%', width: '32px', height: '16px', x: '34px', y: '70px', rotateStart: '-10deg', rotateEnd: '18deg', color: 'rgba(249, 115, 22, .84)', shape: 'rect' },
    { left: '101%', top: '14%', width: '18px', height: '18px', x: '56px', y: '-62px', rotateStart: '12deg', rotateEnd: '-24deg', color: 'rgba(110, 211, 255, .94)', shape: 'square' },
    { left: '104%', top: '28%', width: '24px', height: '24px', x: '72px', y: '-24px', rotateStart: '18deg', rotateEnd: '-22deg', color: 'rgba(129, 118, 222, .92)', shape: 'squircle' },
    { left: '104%', top: '46%', width: '34px', height: '16px', x: '74px', y: '2px', rotateStart: '10deg', rotateEnd: '-18deg', color: 'rgba(255, 222, 45, .96)', shape: 'rect' },
    { left: '102%', top: '64%', width: '30px', height: '14px', x: '68px', y: '26px', rotateStart: '8deg', rotateEnd: '-14deg', color: 'rgba(249, 115, 22, .86)', shape: 'rect' },
    // Near-board ring
    { left: '8%', top: '16%', width: '16px', height: '16px', x: '-34px', y: '-44px', rotateStart: '-8deg', rotateEnd: '18deg', color: 'rgba(110, 211, 255, .9)', shape: 'square' },
    { left: '3%', top: '34%', width: '18px', height: '18px', x: '-38px', y: '-12px', rotateStart: '-14deg', rotateEnd: '12deg', color: 'rgba(157, 100, 170, .88)', shape: 'squircle' },
    { left: '5%', top: '52%', width: '24px', height: '12px', x: '-34px', y: '6px', rotateStart: '-8deg', rotateEnd: '10deg', color: 'rgba(255, 222, 45, .9)', shape: 'rect' },
    { left: '16%', top: '96%', width: '16px', height: '16px', x: '-14px', y: '38px', rotateStart: '-10deg', rotateEnd: '14deg', color: 'rgba(249, 115, 22, .84)', shape: 'square' },
    { left: '30%', top: '98%', width: '20px', height: '14px', x: '2px', y: '42px', rotateStart: '-6deg', rotateEnd: '10deg', color: 'rgba(110, 211, 255, .86)', shape: 'rect' },
    { left: '34%', top: '2%', width: '18px', height: '18px', x: '-8px', y: '-46px', rotateStart: '-12deg', rotateEnd: '20deg', color: 'rgba(255, 222, 45, .88)', shape: 'squircle' },
    { left: '48%', top: '4%', width: '14px', height: '14px', x: '0px', y: '-40px', rotateStart: '-10deg', rotateEnd: '18deg', color: 'rgba(129, 118, 222, .84)', shape: 'square' },
    { left: '62%', top: '98%', width: '18px', height: '18px', x: '8px', y: '40px', rotateStart: '-8deg', rotateEnd: '16deg', color: 'rgba(157, 100, 170, .88)', shape: 'square' },
    { left: '74%', top: '97%', width: '22px', height: '12px', x: '16px', y: '40px', rotateStart: '-6deg', rotateEnd: '12deg', color: 'rgba(249, 115, 22, .82)', shape: 'rect' },
    { left: '92%', top: '18%', width: '16px', height: '16px', x: '34px', y: '-40px', rotateStart: '8deg', rotateEnd: '-18deg', color: 'rgba(110, 211, 255, .9)', shape: 'square' },
    { left: '96%', top: '36%', width: '18px', height: '18px', x: '38px', y: '-8px', rotateStart: '12deg', rotateEnd: '-14deg', color: 'rgba(129, 118, 222, .9)', shape: 'squircle' },
    { left: '95%', top: '54%', width: '24px', height: '12px', x: '34px', y: '8px', rotateStart: '8deg', rotateEnd: '-10deg', color: 'rgba(255, 222, 45, .92)', shape: 'rect' },
  ];

  dom.completeParticles.replaceChildren();

  particles.forEach((particle, index) => {
    const el = document.createElement('span');
    el.className = `complete-particle complete-particle--${particle.shape}`;
    el.style.setProperty('--particle-left', particle.left);
    el.style.setProperty('--particle-top', particle.top);
    el.style.setProperty('--particle-width', particle.width);
    el.style.setProperty('--particle-height', particle.height);
    el.style.setProperty('--particle-x', particle.x);
    el.style.setProperty('--particle-y', particle.y);
    el.style.setProperty('--particle-rotate-start', particle.rotateStart);
    el.style.setProperty('--particle-rotate-end', particle.rotateEnd);
    el.style.background = particle.color;
    el.style.animationDelay = `${index * 10}ms`;
    dom.completeParticles.appendChild(el);
  });

  clearElementTimeout(dom.completeParticles, '__clearParticlesTimeout');
  dom.completeParticles.__clearParticlesTimeout = window.setTimeout(() => {
    dom.completeParticles.replaceChildren();
    dom.completeParticles.__clearParticlesTimeout = null;
  }, MOTION.completeParticlesResetMs);
}

function startCompletionSequence(moves, time, moveRank, timeRank) {
  const reducedMotion = prefersReducedMotion();

  clearCompletionState();
  state.isCompleting = true;
  dom.gameTimer.classList.remove('is-ticking');
  dom.puzzleGrid.classList.add('is-completing');
  restartTransientClass(dom.gameTimer, 'is-complete', MOTION.completeTimerResetMs);

  if (!reducedMotion) {
    triggerCompletionTileSettle();
    createCompletionParticles();
  }

  dom.puzzleGrid.__completeRestTimeout = window.setTimeout(() => {
    dom.puzzleGrid.__completeRestTimeout = null;
    dom.puzzleGrid.classList.remove('is-completing');
    dom.puzzleGrid.classList.add('is-complete-rest');
  }, reducedMotion ? 160 : MOTION.completeBoardRestDelayMs);

  state.completeModalTimeout = window.setTimeout(() => {
    state.completeModalTimeout = null;
    state.isCompleting = false;
    showCompleteModal(moves, time, moveRank, timeRank);
  }, reducedMotion ? MOTION.reducedCompleteModalDelayMs : MOTION.completeModalDelayMs);
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
    setTileBasePosition(el, col, row);
    if (animate === false) {
      clearElementTimeout(el, '__correctRewardDelayTimeout');
      clearElementTimeout(el, '__completeSettleDelayTimeout');
      setTileDragOffset(el, 0, 0);
      setTilePressed(el, false);
      el.classList.remove('dragging', 'is-invalid', 'is-correct', 'is-complete-settle');
    }
    el.dataset.position = pos;
    if (animate === false) { el.offsetHeight; el.style.transition = ''; }
  }
}

function performMove(tilePos) {
  const progressBefore = countSolvedTiles();
  const emptyPos = state.board.indexOf(0);
  const movedTile = state.board[tilePos];
  state.board[emptyPos] = movedTile;
  state.board[tilePos] = 0;
  state.moves++;
  renderBoard(true);
  if (isTileSolvedAtPosition(movedTile, emptyPos)) triggerCorrectTileFeedback(movedTile);
  if (countSolvedTiles() > progressBefore) triggerBoardProgressFeedback();
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
  hasMoved: false,
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
  e.preventDefault();
  const move = getMoveMeta(tilePos);
  if (!move.movable) {
    triggerInvalidTileFeedback(el);
    return;
  }

  setTilePressed(el, true);
  el.setPointerCapture(e.pointerId);

  drag.active = true;
  drag.hasMoved = false;
  drag.el = el;
  drag.tilePos = tilePos;
  drag.axis = move.axis;
  drag.dir = move.dir;
  drag.startX = e.clientX;
  drag.startY = e.clientY;
  drag.offsetX = 0;
  drag.offsetY = 0;
  drag.tileSize = el.offsetWidth;
  drag.baseCol = move.tileCol;
  drag.baseRow = move.tileRow;
}

function onPointerMove(e) {
  if (!drag.active) return;
  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;

  if (!drag.hasMoved && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) {
    drag.hasMoved = true;
    drag.el.classList.add('dragging');
  }

  if (drag.axis === 'x') {
    let px = dx;
    if (drag.dir === 1) px = Math.max(0, Math.min(px, drag.tileSize));
    else px = Math.min(0, Math.max(px, -drag.tileSize));
    drag.offsetX = px;
    setTileDragOffset(drag.el, px, 0);
  } else {
    let py = dy;
    if (drag.dir === 1) py = Math.max(0, Math.min(py, drag.tileSize));
    else py = Math.min(0, Math.max(py, -drag.tileSize));
    drag.offsetY = py;
    setTileDragOffset(drag.el, 0, py);
  }
}

function onPointerUp(e) {
  if (!drag.active) return;
  const isCancelled = e.type === 'pointercancel';
  const dx = Math.abs(e.clientX - drag.startX);
  const dy = Math.abs(e.clientY - drag.startY);
  const isTap = !isCancelled && dx < 8 && dy < 8;
  const threshold = drag.tileSize * 0.25;

  let shouldMove = isTap;
  if (!isTap && !isCancelled) {
    shouldMove = drag.axis === 'x' ? Math.abs(drag.offsetX) > threshold : Math.abs(drag.offsetY) > threshold;
  }

  setTilePressed(drag.el, false);
  drag.el.classList.remove('dragging');
  setTileDragOffset(drag.el, 0, 0);
  if (shouldMove) performMove(drag.tilePos);
  else renderBoard(true);

  drag.active = false;
  drag.hasMoved = false;
  drag.el = null;
  drag.tilePos = -1;
  drag.axis = null;
  drag.dir = 0;
  drag.offsetX = 0;
  drag.offsetY = 0;
  drag.tileSize = 0;
  drag.baseCol = 0;
  drag.baseRow = 0;
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
  dom.gameTimer.classList.remove('is-ticking');
  updateTimerDisplay(false);
  state.timerInterval = setInterval(() => {
    state.timeSeconds++;
    updateTimerDisplay(true);
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function updateTimerDisplay(animate = false) {
  dom.gameTimer.textContent = '\u23F1 ' + formatTime(state.timeSeconds);
  if (animate) triggerTimerFeedback();
}


/* ==========================================================================
   15. GAME FLOW
   High-level functions to control the state of the active puzzle session.
   ========================================================================== */

function startGame(puzzleId) {
  killGameIntro();
  clearCompletionState();
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
  playGameIntro();
  startTimer();
}

function endGame() {
  killGameIntro();
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

  startCompletionSequence(moves, time, state.lastResult.moveRank, state.lastResult.timeRank);
}

function resetGame() {
  if (!state.currentPuzzle || state.isCompleting) return;
  killGameIntro();
  clearCompletionState();
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
  if (!state.currentPuzzle || state.isCompleting) return;
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
  dom.btnCplLb.addEventListener('click', () => { clearCompletionState(); closeModal('complete'); showLeaderboard(); });
  dom.btnCplCats.addEventListener('click', () => { clearCompletionState(); closeAllModals(); stopTimer(); showScreen('categories'); renderCategories(); });
  dom.btnCplRestart.addEventListener('click', resetGame);
}


/* ==========================================================================
   18. LEADERBOARD UI
   Renders the local high-score table. Includes a highlighted 'YOU' row 
   to help users identify their current standing in the global rankings.
   ========================================================================== */

function showLeaderboard() {
  clearCompletionState();
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
  dom.btnBack.addEventListener('click', () => {
    if (state.isCompleting) return;
    clearCompletionState();
    stopTimer();
    state.isPlaying = false;
    showScreen('categories');
    renderCategories();
  });
  dom.btnReset.addEventListener('click', resetGame);
  [dom.btnBack, dom.btnReset, dom.btnHelp].forEach(bindTactileButton);
  if ($('#btn-debug-solve')) $('#btn-debug-solve').addEventListener('click', debugSolve);
}

function bindTactileButton(el) {
  if (!el) return;

  const release = () => el.classList.remove('is-pressed');

  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    el.classList.add('is-pressed');
    if (el.setPointerCapture) {
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
    }
  });

  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);
  el.addEventListener('lostpointercapture', release);
  el.addEventListener('blur', release);
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
  document.body.classList.toggle('has-gsap-intro', Boolean(window.gsap));
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
