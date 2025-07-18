const ruler = document.getElementById('ruler');
const bfr = document.getElementById('bfr-fill');
const windButtons = document.querySelectorAll('.wind-button');
const mobiles = document.querySelectorAll('.mobile');

let currentWind = 0;
let selectedMobile = 'armor';
let distancePixels = 0;

// Display fields
const infoMobile = document.getElementById('selected-mobile');
const infoPower = document.getElementById('corrected-power');
const infoAngle = document.getElementById('calculated-angle');

// Ajustes de cada mobile
const mobileAdjustments = {
  armor: 0,
  mage: -0.05,
  raon: 0.1,
  asate: 0.05
};

mobiles.forEach(mob => {
  mob.addEventListener('click', () => {
    mobiles.forEach(m => m.classList.remove('selected'));
    mob.classList.add('selected');
    selectedMobile = mob.id;
    infoMobile.textContent = mob.title;
    recalculate();
  });
});

ruler.addEventListener('mousemove', e => {
  const rect = ruler.getBoundingClientRect();
  const x = e.clientX - rect.left;
  distancePixels = Math.max(0, Math.min(800, x));

  // Atualizar visual da régua
  ruler.style.background = `linear-gradient(to right, rgba(255,255,0,0.5) ${distancePixels}px, transparent 0%)`;

  recalculate();
});

windButtons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    windButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentWind = parseInt(btn.dataset.value);
    recalculate();
  });
});

function recalculate() {
  const anglePerPixel = 1 / 20;
  let angleOffset = distancePixels * anglePerPixel;
  let angle = 90 - angleOffset;

  let factor = 0.5;
  if (currentWind < 0) factor = 0.6;
  if (currentWind > 0) factor = 0.4;
  if (currentWind === 0) factor = 0;

  angle += currentWind * factor;

  let power = 2 + mobileAdjustments[selectedMobile];
  let powerCorrected = power;

if (angle < 1 || angle > 89) {
  const newAngle = Math.max(1, Math.min(89, angle));
  let factorProporcional = angle / newAngle;
  powerCorrected = power * factorProporcional;
  let bfrPercent = Math.max(0, Math.min(1, powerCorrected / 4));
  bfr.style.width = `${bfrPercent * 100}%`;
} else {
  bfr.style.width = '50%';
}

  // Atualizar painel de informações
  infoAngle.textContent = angle.toFixed(2);
  infoPower.textContent = powerCorrected.toFixed(2);
}
