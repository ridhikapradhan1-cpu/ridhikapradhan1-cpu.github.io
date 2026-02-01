// Move the "No" button to a random position inside the button area
const noBtn = document.getElementById('no');
const yesBtn = document.getElementById('yes');
const buttonArea = document.getElementById('buttonArea');

function moveNoButton() {
  const areaRect = buttonArea.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // compute available space inside buttonArea for top-left corner
  const padding = 8;
  const maxX = Math.max(0, areaRect.width - btnRect.width - padding * 2);
  const maxY = Math.max(0, areaRect.height - btnRect.height - padding * 2);

  // choose a random position (as top-left)
  const randX = padding + Math.random() * maxX;
  const randY = padding + Math.random() * maxY;

  // random scale so the No button changes size each move (0.7 - 1.6)
  const scale = (0.7 + Math.random() * 0.9).toFixed(2);

  // apply position relative to buttonArea
  noBtn.style.left = `${randX}px`;
  noBtn.style.top = `${randY}px`;

  // set scale (smooth because CSS transition is set on .btn)
  noBtn.style.transform = `scale(${scale})`;
}

// When the mouse gets near (mouseenter) or touches the button area, move it
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
}, {passive:false});

// Prevent accidental click by moving on click as well if it's too slow
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveNoButton();
});

// When yes is clicked, go to success page
yesBtn.addEventListener('click', () => {
  window.location.href = 'success.html';
});

// initial placement to avoid overlap
window.addEventListener('load', () => {
  // ensure noBtn is absolutely positioned inside its area
  noBtn.style.position = 'absolute';
  noBtn.style.transformOrigin = 'center center';
  moveNoButton();
});
