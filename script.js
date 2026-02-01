const noBtn = document.getElementById('no');
const yesBtn = document.getElementById('yes');
const buttonArea = document.getElementById('buttonArea');

function moveNoButton() {
  const areaRect = buttonArea.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = Math.max(0, areaRect.width - btnRect.width);
  const maxY = Math.max(0, areaRect.height - btnRect.height);

  const padding = 8;
  const randX = padding + Math.random() * Math.max(0, maxX - padding * 2);
  const randY = padding + Math.random() * Math.max(0, maxY - padding * 2);

  noBtn.style.left = `${randX}px`;
  noBtn.style.top = `${randY}px`;
  noBtn.style.transform = `none`;
}

noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
}, {passive:false});

noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener('click', () => {
  window.location.href = 'success.html';
});

window.addEventListener('load', () => {
  noBtn.style.position = 'absolute';
  moveNoButton();
});
