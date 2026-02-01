// Smarter evasive "No" button: moves whenever the cursor gets too close
const noBtn = document.getElementById('no');
const yesBtn = document.getElementById('yes');
const buttonArea = document.getElementById('buttonArea');

let areaRect = null;
let btnRect = null;
let lastMove = 0;
const MOVE_COOLDOWN = 80; // ms between forced moves to avoid thrash
const MIN_DISTANCE = 140; // px - minimum distance the button should keep from cursor

function updateRects() {
  areaRect = buttonArea.getBoundingClientRect();
  btnRect = noBtn.getBoundingClientRect();
}

/* ---- Bear peek helper ---- */
function bearPeek() {
  const bear = document.querySelector('.bg-bear');
  if (!bear) return;

  // Restart animation even if called rapidly
  bear.classList.remove('peek');
  // force reflow
  void bear.offsetWidth;
  bear.classList.add('peek');
}

// pick a random position inside buttonArea (top-left coords) ensuring it's at least minDist from (cx,cy)
function chooseSafePosition(cx = null, cy = null, minDist = MIN_DISTANCE) {
  updateRects();
  const padding = 8;
  const maxX = Math.max(0, areaRect.width - btnRect.width - padding * 2);
  const maxY = Math.max(0, areaRect.height - btnRect.height - padding * 2);

  // If no cursor provided, just pick random
  if (cx === null || cy === null) {
    const rx = padding + Math.random() * maxX;
    const ry = padding + Math.random() * maxY;
    return { x: rx, y: ry };
  }

  // cursor coordinates relative to area
  const cursorX = cx - areaRect.left;
  const cursorY = cy - areaRect.top;

  // attempt to find a position far enough
  for (let i = 0; i < 60; i++) {
    const rx = padding + Math.random() * maxX;
    const ry = padding + Math.random() * maxY;
    const centerX = rx + btnRect.width / 2;
    const centerY = ry + btnRect.height / 2;
    const dx = centerX - cursorX;
    const dy = centerY - cursorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist >= minDist) {
      return { x: rx, y: ry };
    }
  }

  // fallback: if we couldn't find a safe pos, pick one of the edges away from cursor
  const awayX = cursorX < areaRect.width / 2 ? maxX : padding;
  const awayY = cursorY < areaRect.height / 2 ? maxY : padding;
  return { x: awayX, y: awayY };
}

function moveNoButtonTo(x, y) {
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  // reset any transform to keep size normal
  noBtn.style.transform = 'none';
}

// Move away from given cursor position (clientX, clientY)
function moveNoAwayFrom(clientX, clientY) {
  const now = Date.now();
  if (now - lastMove < MOVE_COOLDOWN) return;
  lastMove = now;

  const pos = chooseSafePosition(clientX, clientY);
  moveNoButtonTo(pos.x, pos.y);

  // trigger the cute peek whenever "No" runs away
  bearPeek();
}

// initial random placement
function placeNoRandom() {
  updateRects();
  const padding = 8;
  const maxX = Math.max(0, areaRect.width - btnRect.width - padding * 2);
  const maxY = Math.max(0, areaRect.height - btnRect.height - padding * 2);
  const rx = padding + Math.random() * maxX;
  const ry = padding + Math.random() * maxY;
  moveNoButtonTo(rx, ry);

  // optional: peek once on initial placement
  // bearPeek();
}

// When the mouse moves inside the button area, check distance to noBtn center
let onMouseMove = (e) => {
  updateRects();
  btnRect = noBtn.getBoundingClientRect();

  const cursorX = e.clientX;
  const cursorY = e.clientY;

  // compute distance from cursor to No-button center
  const btnCenterX = btnRect.left + btnRect.width / 2;
  const btnCenterY = btnRect.top + btnRect.height / 2;
  const dx = btnCenterX - cursorX;
  const dy = btnCenterY - cursorY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < MIN_DISTANCE) {
    moveNoAwayFrom(cursorX, cursorY);
  }
};

// Make it move immediately if the mouse tries to enter the button
noBtn.addEventListener('mouseenter', (e) => {
  moveNoAwayFrom(e.clientX, e.clientY);
});

// Move on touch
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  moveNoAwayFrom(t.clientX, t.clientY);
}, { passive:false });

// Also move on click (prevent clicking)
noBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const cx = e.clientX || null;
  const cy = e.clientY || null;

  if (cx && cy) {
    moveNoAwayFrom(cx, cy);
  } else {
    const p = chooseSafePosition();
    moveNoButtonTo(p.x, p.y);
    bearPeek();
  }
});

// When yes is clicked, go to success page
yesBtn.addEventListener('click', () => {
  window.location.href = 'success.html';
});

// set up listeners on the movement area
buttonArea.addEventListener('mousemove', onMouseMove);

// initial placement to avoid overlap
window.addEventListener('load', () => {
  // ensure positioned absolutely inside area
  noBtn.style.position = 'absolute';
  noBtn.style.transformOrigin = 'center center';

  // ensure rects are ready
  updateRects();
  btnRect = noBtn.getBoundingClientRect();

  placeNoRandom();
  // update btnRect now it's placed
  btnRect = noBtn.getBoundingClientRect();
});
