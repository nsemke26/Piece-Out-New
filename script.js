// Core puzzle settings (3x3 => 8 tiles + 1 empty slot).
const GRID = 3;
const TILES = GRID * GRID;
const SHUFFLE_MOVES = 180;
const IMG = './images/joaquin.png';
// Animation timing knobs used across board/tile feedback.
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
// Intro sequence timing for the game screen.
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
// Audio file paths and volume presets.
const SOUND = {
  puzzleSelectSrc: './sounds/puzzle-click.mp3',
  puzzleCompleteSrc: './sounds/puzzle-complete.mp3',
  buttonClickSrc: './sounds/button-click.mp3',
  invalidMoveSrc: './sounds/invalid-move.mp3',
  puzzleSelectVolume: 0.55,
  puzzleCompleteVolume: 0.75,
  buttonClickVolume: 0.42,
  invalidMoveVolume: 0.62,
};
/*
  Performance switches:
  These are intentional "quality vs speed" toggles.
  Keep them false for smooth play on slower laptops/phones, or set to true if
  you want richer effects and your device handles them well.
*/
const PERFORMANCE = {
  enableGameIntro: true,
  enableTimerPulse: true,
  enableCompletionParticles: true,
};
// Static game content.
const CATEGORIES = [
  { id: 'landscapes', name: 'Landscapes',        icon: 'ph ph-mountains' },
  { id: 'movies',     name: 'Movies',            icon: 'ph ph-film-slate' },
  { id: 'animals',    name: 'Animals',            icon: 'ph ph-paw-print' },
  { id: 'all',        name: 'All',                icon: 'ph ph-puzzle-piece' },
  { id: 'food',       name: 'Food',               icon: 'ph ph-hamburger' },
  { id: 'art',        name: 'Art',  icon: 'ph ph-palette' },
];
const PUZZLES = [
  { id:'land-1', title:'Royal Canadian Mint',             description:'An iconic view of the Royal Canadian Mint, known for producing circulation and collector coins.', category:'landscapes', image: "images/landscape-1.jpg" },
  { id:'land-2', title:'Exchange District',               description:'Historic warehouse architecture and vibrant streets from Winnipeg’s Exchange District.', category:'landscapes', image: "images/landscape-2.jpg" },
  { id:'land-3', title:'St Boniface Cathedral',           description:'The remarkable facade and grounds of St Boniface Cathedral, a major historic landmark.', category:'landscapes', image: "images/landscape-3.jpg" },
  { id:'land-4', title:'Canadian Museum of Human Rights', description:'The striking modern design of the Canadian Museum for Human Rights in downtown Winnipeg.', category:'landscapes', image: "images/landscape-4.jpg" },
  { id:'movie-1', title:'Kung Fu Panda',   description:'Po trains under Master Shifu and the Furious Five to become the Dragon Warrior.', category:'movies', image: "images/kung_fu_panda.jpg" },
  { id:'movie-2', title:'Ratatouille',     description:'Remy, a rat with a passion for cooking, helps create unforgettable dishes in Paris.',   category:'movies', image: "images/rataouille.jpg" },
  { id:'movie-3', title:'Shrek',           description:'Shrek and Donkey set out on a hilarious adventure through a fairy-tale world.',         category:'movies', image: "images/shrek.jpg" },
  { id:'movie-4', title:'Despicable Me',   description:'Gru and his mischievous Minions pull off wild schemes that turn into family moments.',    category:'movies', image: "images/despicable.jpg" },
  { id:'anim-1', title:'Arctic Fox',        description:'The elegant white fox navigating through the frozen tundra.',                            category:'animals', image: IMG },
  { id:'anim-2', title:'Tropical Parrot',   description:'A vibrant macaw perched on a branch in the lush rainforest.',                            category:'animals', image: IMG },
  { id:'anim-3', title:'Ocean Dolphin',     description:'Playful dolphins leaping through crystal clear tropical waters.',                        category:'animals', image: IMG },
  { id:'anim-4', title:'Safari Lion',       description:'The king of the savannah resting under an acacia tree at dusk.',                        category:'animals', image: IMG },
  { id:'food-1', title:'Pizza Perfection',  description:'A golden, cheesy pizza with fresh toppings and a perfectly crisp crust.',                 category:'food', image: "images/food-1-pizza.jpg" },
  { id:'food-2', title:'Sushi Platter',     description:'A colorful assortment of sushi rolls and nigiri, neatly arranged and ready to serve.',   category:'food', image: "images/food-2-sushi.jpg" },
  { id:'food-3', title:'Street Tacos',      description:'Fresh street-style tacos packed with vibrant fillings, herbs, and bold flavors.',         category:'food', image: "images/food-3-tacos.jpg" },
  { id:'food-4', title:'Caesar Salad',      description:'A crisp Caesar salad with romaine, parmesan, croutons, and creamy dressing.',            category:'food', image: "images/food-4-caesar-salad.jpg" },
  { id:'art-1', title:'The Great Wave',     description:"Hokusai's iconic woodblock print captures a towering wave curling over boats beneath Mount Fuji.", category:'art', image: "images/art-1.jpg" },
  { id:'art-2', title:'Starry Night',       description:"Van Gogh's swirling night sky glows above a quiet village in one of the world's most recognizable paintings.", category:'art', image: "images/art-2.jpg" },
  { id:'art-3', title:'Water Lilies',       description:"Monet's serene scene of floating lilies reflects light, color, and movement across the water's surface.", category:'art', image: "images/art-3.jpeg" },
  { id:'art-4', title:'American Gothic',    description:"Grant Wood's famous portrait presents a stern farmer and his daughter before a simple rural home.", category:'art', image: "images/art-4.jpg" },
];
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


// App state for current session/playthrough.
const state = {
  playerName: '',
  screen: 'splash',
  selectedCategory: 'landscapes',
  currentPuzzle: null,
  board: [],
  holdPreviewBoard: null,
  holdPreviewActive: false,
  moves: 0,
  timeSeconds: 0,
  timerInterval: null,
  isPlaying: false,
  isCompleting: false,
  startSessionId: null,
  boardImageSrc: '',
  completeModalTimeout: null,
  lastResult: null,
};


const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {};
const sounds = {
  puzzleSelect: null,
  puzzleComplete: null,
  buttonClick: null,
  invalidMove: null,
};
const squareImageCache = new Map();

// Cache all DOM references once to avoid repeated querySelector calls.
function cacheDom() {
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
  dom.btnCompare     = $('#btn-compare');
  dom.gameActionButtons = [dom.btnBack, dom.btnReset, dom.btnHelp, dom.btnCompare].filter(Boolean);
  dom.gameBackgroundShapes = Array.from(
    $$('#screen-game .background-logo, #screen-game .background-logo-2')
  );
  dom.lbScreen       = $('#screen-leaderboard');
  dom.lbImage        = $('#lb-image');
  dom.lbTitle        = $('#lb-title');
  dom.lbDesc         = $('#lb-desc');
  dom.lbTbody        = $('#lb-tbody');
  dom.lbYou          = $('#lb-you');
  dom.btnLbRestart   = $('#btn-lb-restart');
  dom.btnLbHome      = $('#btn-lb-home');
  dom.modalHelp      = $('#modal-help');
  dom.helpImage      = $('#help-image');
  dom.helpName       = $('#help-name');
  dom.helpDesc       = $('#help-desc');
  dom.btnHelpClose   = $('#btn-help-close');
  dom.modalComplete  = $('#modal-complete');
  dom.statMoves      = $('#stat-moves');
  dom.statTime       = $('#stat-time');
  dom.statRank       = $('#stat-rank');
  dom.btnCplClose    = $('#btn-cpl-close');
  dom.btnCplLb       = $('#btn-cpl-lb');
  dom.btnCplCats     = $('#btn-cpl-cats');
  dom.btnCplRestart  = $('#btn-cpl-restart');
  dom.modalDetails   = $('#modal-details');
  dom.detailsImage   = $('#details-image');
  dom.detailsName    = $('#details-name');
  dom.detailsDesc    = $('#details-desc');
  dom.detailsCat     = $('#details-cat');
  dom.btnDetailsPlay = $('#btn-details-play');
  dom.btnDetailsClose= $('#btn-details-close');
}


function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
// Fisher-Yates shuffle keeps the "All" page feeling fresh on each visit.
function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build an Audio instance with common defaults.
function createSound(src, volume) {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.volume = volume;
  return audio;
}

// Preload sounds at startup so feedback feels instant.
function initSounds() {
  sounds.puzzleSelect = createSound(SOUND.puzzleSelectSrc, SOUND.puzzleSelectVolume);
  sounds.puzzleComplete = createSound(SOUND.puzzleCompleteSrc, SOUND.puzzleCompleteVolume);
  sounds.buttonClick = createSound(SOUND.buttonClickSrc, SOUND.buttonClickVolume);
  sounds.invalidMove = createSound(SOUND.invalidMoveSrc, SOUND.invalidMoveVolume);
}

// Safe play helper; ignores autoplay errors from the browser.
function playSound(soundKey) {
  const audio = sounds[soundKey];
  if (!audio) return;
  audio.currentTime = 0;
  const maybePromise = audio.play();
  if (maybePromise && typeof maybePromise.catch === 'function') {
    maybePromise.catch(() => {});
  }
}

// Crop source image to square once, then reuse from cache.
function getSquareImageSrc(src) {
  if (squareImageCache.has(src)) return squareImageCache.get(src);

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = Math.floor((img.naturalWidth - side) / 2);
      const sy = Math.floor((img.naturalHeight - side) / 2);
      const canvas = document.createElement('canvas');
      canvas.width = side;
      canvas.height = side;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(src);
        return;
      }
      ctx.drawImage(img, sx, sy, side, side, 0, 0, side, side);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });

  squareImageCache.set(src, promise);
  return promise;
}
function generateName() {
  return rand(NAME_PRE) + rand(NAME_SUF) + randInt(0, 99);
}
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m + ':' + String(sec).padStart(2, '0');
}
function calculateScore(moves, timeSec) {
  return moves + Math.floor(timeSec * 1.5);
}
function puzzlesForCategory(catId) {
  if (catId === 'all') return [...PUZZLES];
  return PUZZLES.filter(p => p.category === catId);
}

function getPuzzle(id) {
  return PUZZLES.find(p => p.id === id);
}


// localStorage helpers for player identity.
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


// Leaderboard storage is scoped by puzzle id.
function lbKey(puzzleId) { return 'pieceout_lb_' + puzzleId; }

function getLeaderboard(puzzleId) {
  const raw = localStorage.getItem(lbKey(puzzleId));
  return raw ? JSON.parse(raw) : [];
}
function saveLeaderboardEntry(puzzleId, entry) {
  const lb = getLeaderboard(puzzleId);
  lb.push(entry);
  lb.sort((a, b) => a.score - b.score);
  const trimmed = lb.slice(0, 50);
  localStorage.setItem(lbKey(puzzleId), JSON.stringify(trimmed));
  return trimmed;
}


// Shared screen/modal visibility helpers.
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


function initSplash() {
  const go = () => {
    openNameOverlay();
  };
  dom.btnSplash.addEventListener('click', (e) => { e.stopPropagation(); go(); });
}


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


// Build category sidebar and puzzle cards from data config.
function renderCategories() {
  // One call updates theme + sidebar state + cards in a predictable order.
  applyCategoryTheme(state.selectedCategory);
  renderSidebar();
  renderCategoryGrid(state.selectedCategory);
}

function applyCategoryTheme(catId) {
  if (!dom.catScreen) return;
  // CSS theme rules read this data attribute and map it to color variables.
  dom.catScreen.dataset.theme = catId;
}

function renderSidebar() {
  if (!dom.catSidebar.childElementCount) {
    const frag = document.createDocumentFragment();
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-btn';
      btn.dataset.catId = cat.id;
      const iconMarkup = cat.iconClass
        ? `<i class="${cat.iconClass}" aria-hidden="true"></i>`
        : (typeof cat.icon === 'string' && cat.icon.includes('ph-'))
          ? `<i class="${cat.icon}" aria-hidden="true"></i>`
          : cat.icon;
      btn.innerHTML = `<span class="cat-btn__icon">${iconMarkup}</span> ${cat.name}`;
      btn.addEventListener('click', () => {
        if (state.selectedCategory === cat.id) return;
        state.selectedCategory = cat.id;
        applyCategoryTheme(state.selectedCategory);
        updateSidebarActive();
        renderCategoryGrid(state.selectedCategory);
      });
      bindTactileButton(btn);
      frag.appendChild(btn);
    });
    dom.catSidebar.appendChild(frag);
  }
  updateSidebarActive();
}

function updateSidebarActive() {
  Array.from(dom.catSidebar.children).forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.catId === state.selectedCategory);
  });
}

function renderCategoryGrid(catId) {
  // For "All", shuffle list order so users do not always see the same first cards.
  const puzzles = catId === 'all'
    ? shuffle(puzzlesForCategory(catId))
    : puzzlesForCategory(catId);
  dom.catScreen.classList.toggle('screen-categories--four', puzzles.length === 4);
  dom.catScreen.classList.toggle('screen-categories--all', catId === 'all');
  if (catId === 'all' && dom.catMain) dom.catMain.scrollTop = 0;
  const frag = document.createDocumentFragment();
  puzzles.forEach(pz => {
    const card = document.createElement('div');
    card.className = 'puzzle-card';
    card.dataset.id = pz.id;
    card.dataset.category = pz.category;
    card.innerHTML = `
      <div class="puzzle-card__img" data-action="start" style="background-image:url('${pz.image}')"></div>
      <div class="puzzle-card__footer">
        <span class="puzzle-card__title">${pz.title}</span>
        <button class="puzzle-card__details" data-id="${pz.id}">DETAILS</button>
      </div>`;
    const detailsBtn = card.querySelector('.puzzle-card__details');
    // Reuse the same tactile press interaction used by all app buttons.
    bindTactileButton(detailsBtn);

    frag.appendChild(card);
  });
  dom.catGrid.replaceChildren(frag);
}

function initCategories() {
  /*
    Event delegation keeps this fast:
    Instead of attaching handlers to every card on every render, one listener
    on the grid handles both "open details" and "start game" clicks.
  */
  dom.catGrid.addEventListener('click', (e) => {
    const detailsBtn = e.target.closest('.puzzle-card__details');
    if (detailsBtn) {
      e.stopPropagation();
      showDetails(detailsBtn.dataset.id);
      return;
    }

    const imageEl = e.target.closest('.puzzle-card__img');
    if (!imageEl) return;
    const card = imageEl.closest('.puzzle-card');
    if (!card?.dataset.id) return;
    playSound('puzzleSelect');
    startGame(card.dataset.id);
  });

  dom.btnRandom.addEventListener('click', () => {
    const puzzles = puzzlesForCategory(state.selectedCategory);
    if (!puzzles.length) return;
    const chosen = rand(puzzles);
    playSound('puzzleSelect');
    startGame(chosen.id);
  });
}


let detailsPuzzleId = null;

// Track selected puzzle id before user confirms Play in details modal.
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
    if (detailsPuzzleId) {
      playSound('puzzleSelect');
      startGame(detailsPuzzleId);
    }
  });
  dom.btnDetailsClose.addEventListener('click', () => closeModal('details'));
}


const tileEls = {};
let gameIntroTl = null;
// Adjacent cells in a flattened GRID*GRID board.
function neighbors(pos) {
  const r = Math.floor(pos / GRID), c = pos % GRID;
  const out = [];
  if (r > 0) out.push(pos - GRID);
  if (r < GRID - 1) out.push(pos + GRID);
  if (c > 0) out.push(pos - 1);
  if (c < GRID - 1) out.push(pos + 1);
  return out;
}
// Shuffle from solved state using valid moves, keeping puzzle solvable.
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

// Create tile nodes and assign each tile its image slice.
function createTiles() {
  dom.puzzleGrid.innerHTML = '';
  Object.keys(tileEls).forEach(k => delete tileEls[k]);
  const tileImageSrc = state.boardImageSrc || state.currentPuzzle.image;

  for (let num = 1; num < TILES; num++) {
    const el = document.createElement('div');
    el.className = 'puzzle-tile';
    el.dataset.tile = num;

    const srcRow = Math.floor((num - 1) / GRID);
    const srcCol = (num - 1) % GRID;
    const bx = (srcCol / (GRID - 1)) * 100;
    const by = (srcRow / (GRID - 1)) * 100;
    el.style.backgroundImage = `url('${tileImageSrc}')`;
    el.style.backgroundSize = `${GRID * 100}% ${GRID * 100}%`;
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
  playSound('invalidMove');
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
  // Particle effects are expensive, so they stay behind a performance toggle.
  if (prefersReducedMotion() || !dom.completeParticles || !PERFORMANCE.enableCompletionParticles) return;

  const particles = [
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
// Sync logical board state into tile positions in the DOM.
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

// Commit one legal move and evaluate progress/completion feedback.
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


// Pointer interaction state (tap + drag).
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
  framePending: false,
  pendingDx: 0,
  pendingDy: 0,
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
  drag.pendingDx = e.clientX - drag.startX;
  drag.pendingDy = e.clientY - drag.startY;
  /*
    pointermove can fire much faster than the screen can paint.
    We batch updates into requestAnimationFrame so tile movement is smooth and
    we avoid overloading the main thread with redundant style writes.
  */
  if (drag.framePending) return;
  drag.framePending = true;

  requestAnimationFrame(() => {
    drag.framePending = false;
    if (!drag.active || !drag.el) return;
    const dx = drag.pendingDx;
    const dy = drag.pendingDy;

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
  });
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
  drag.framePending = false;
  drag.pendingDx = 0;
  drag.pendingDy = 0;
}

function initDrag() {
  dom.puzzleGrid.addEventListener('pointerdown', onPointerDown);
  dom.puzzleGrid.addEventListener('pointermove', onPointerMove);
  dom.puzzleGrid.addEventListener('pointerup',   onPointerUp);
  dom.puzzleGrid.addEventListener('pointercancel', onPointerUp);
}


// Timer utilities.
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
  // Timer pulse looks nice, but we keep it optional for performance.
  if (animate && PERFORMANCE.enableTimerPulse) triggerTimerFeedback();
}


// Start a new puzzle run.
async function startGame(puzzleId) {
  killGameIntro();
  clearCompletionState();
  closeAllModals();
  const pz = getPuzzle(puzzleId);
  if (!pz) return;
  const sessionId = `${pz.id}-${Date.now()}-${Math.random()}`;
  state.startSessionId = sessionId;
  state.currentPuzzle = pz;
  state.moves = 0;
  state.isPlaying = true;
  state.lastResult = null;
  state.boardImageSrc = await getSquareImageSrc(pz.image);
  if (state.startSessionId !== sessionId) return;

  showScreen('game');
  if (dom.puzzleGrid) {
    dom.puzzleGrid.style.setProperty('--puzzle-guide-image', `url('${state.boardImageSrc}')`);
    dom.puzzleGrid.style.setProperty('--puzzle-grid-size', String(GRID));
  }
  createTiles();
  shuffleBoard();
  renderBoard(false);
  // Intro animation is intentionally optional to keep startup snappy.
  if (PERFORMANCE.enableGameIntro) playGameIntro();
  startTimer();
}

// Finish run: score, rank, and completion UI.
function endGame() {
  killGameIntro();
  hidePuzzleReference();
  state.isPlaying = false;
  stopTimer();

  const moves = state.moves;
  const time = state.timeSeconds;
  const score = calculateScore(moves, time);

  const entry = { player: state.playerName, moves, time, score, ts: Date.now() };
  const lb = saveLeaderboardEntry(state.currentPuzzle.id, entry);
  const byScore = [...lb].sort((a, b) => a.score - b.score);
  const byMoves = [...lb].sort((a, b) => a.moves - b.moves);
  const byTime  = [...lb].sort((a, b) => a.time  - b.time);

  state.lastResult = {
    moves, time, score,
    overallRank: byScore.findIndex(e => e.ts === entry.ts) + 1,
    moveRank:    byMoves.findIndex(e => e.ts === entry.ts) + 1,
    timeRank:    byTime.findIndex(e => e.ts === entry.ts) + 1
  };

  playSound('puzzleComplete');
  startCompletionSequence(moves, time, state.lastResult.moveRank, state.lastResult.timeRank);
}

// Reset keeps same puzzle but reshuffles and restarts timer.
function resetGame() {
  if (!state.currentPuzzle || state.isCompleting) return;
  killGameIntro();
  clearCompletionState();
  closeAllModals();
  hidePuzzleReference();
  state.moves = 0;
  state.isPlaying = true;
  shuffleBoard();
  renderBoard(false);
  startTimer();
}

function showPuzzleReference() {
  // While held, show a solved preview and restore the real board on release.
  if (!state.currentPuzzle || state.isCompleting || state.holdPreviewActive) return;
  if (!Array.isArray(state.board) || state.board.length !== TILES) return;

  state.holdPreviewBoard = [...state.board];
  state.holdPreviewActive = true;
  state.isPlaying = false;

  for (let i = 0; i < TILES - 1; i++) state.board[i] = i + 1;
  state.board[TILES - 1] = 0;

  dom.puzzleGrid.classList.add('is-hold-preview', 'is-complete-rest');
  renderBoard(false);
}

function hidePuzzleReference() {
  if (!state.holdPreviewActive) return;

  if (Array.isArray(state.holdPreviewBoard) && state.holdPreviewBoard.length === TILES) {
    state.board = [...state.holdPreviewBoard];
  }

  state.holdPreviewBoard = null;
  state.holdPreviewActive = false;
  state.isPlaying = Boolean(state.currentPuzzle) && !state.isCompleting;

  dom.puzzleGrid.classList.remove('is-hold-preview', 'is-complete-rest');
  renderBoard(false);
}


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


// Wire in-game controls and hold-to-preview behavior.
function initGameButtons() {
  dom.btnBack.addEventListener('click', () => {
    if (state.isCompleting) return;
    clearCompletionState();
    hidePuzzleReference();
    stopTimer();
    state.isPlaying = false;
    showScreen('categories');
    renderCategories();
  });
  dom.btnReset.addEventListener('click', resetGame);
  if (dom.btnCompare) {
    const press = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (dom.btnCompare.setPointerCapture) {
        try { dom.btnCompare.setPointerCapture(e.pointerId); } catch (_) {}
      }
      showPuzzleReference();
    };
    const release = () => hidePuzzleReference();
    dom.btnCompare.addEventListener('pointerdown', press);
    dom.btnCompare.addEventListener('pointerup', release);
    dom.btnCompare.addEventListener('pointercancel', release);
    dom.btnCompare.addEventListener('pointerleave', release);
    dom.btnCompare.addEventListener('lostpointercapture', release);
    dom.btnCompare.addEventListener('blur', release);
  }
  [dom.btnBack, dom.btnReset, dom.btnHelp, dom.btnCompare].forEach(bindTactileButton);
  if ($('#btn-debug-solve')) $('#btn-debug-solve').addEventListener('click', debugSolve);
}

function bindTactileButton(el) {
  if (!el) return;
  if (el.dataset.tactileBound === '1') return;
  el.dataset.tactileBound = '1';
  const release = () => {
    el.classList.remove('is-pressed');
    if (window.gsap) {
      gsap.killTweensOf(el);
      gsap.to(el, { y: 0, duration: 0.14, ease: 'power2.out' });
    } else {
      el.style.transform = '';
    }
  };

  // Using GSAP here keeps the press movement smooth even when transforms already exist.
  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    el.classList.add('is-pressed');
    if (window.gsap) {
      gsap.killTweensOf(el);
      gsap.to(el, { y: 6, duration: 0.08, ease: 'power2.out' });
    } else {
      el.style.transform = 'translateY(6px)';
    }
    if (el.setPointerCapture) {
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
    }
  });

  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);
  el.addEventListener('lostpointercapture', release);
  el.addEventListener('blur', release);
}

// Global click sound for any button in the app.
function initGlobalButtonSound() {
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    playSound('buttonClick');
  });
}
// Dev shortcut to force a solved board.
function debugSolve() {
  if (!state.isPlaying || !state.currentPuzzle) return;
  for (let i = 0; i < TILES - 1; i++) state.board[i] = i + 1;
  state.board[TILES - 1] = 0;
  state.moves += 1;
  renderBoard(true);
  setTimeout(() => endGame(), 300);
}


// App bootstrap.
function initApp() {
  cacheDom();
  initSounds();
  initGlobalButtonSound();
  $$('button').forEach(bindTactileButton);
  if (dom.puzzleGrid) dom.puzzleGrid.style.setProperty('--puzzle-grid-size', String(GRID));
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



