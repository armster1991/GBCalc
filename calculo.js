const ruler = document.getElementById('ruler');
const rulerFill = ruler.querySelector('::before');
const bfr = document.getElementById('bfr-fill');
const windButtons = document.querySelectorAll('.wind-button');
const mobiles = document.querySelectorAll('.mobile');

let currentWind = 0;
let selectedMobile = 'armor';
let distancePixels = 0;

// Constantes
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
    recalculate();
  });
});

// Hover da régua
ruler.addEventListener('mousemove', e => {
  const rect = ruler.getBoundingClientRect();
  const x = e.clientX - rect.left;
  distancePixels = Math.max(0, Math.min(800, x));

  ruler.style.setProperty('--fill', `${distancePixels}px`);
  ruler.style.background = `linear-gradient(to right, rgba(255,255,0,0.5) ${distancePixels}px, transparent 0%)`;

  recalculate();
});

// Hover dos botões de vento
windButtons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    windButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentWind = parseInt(btn.dataset.value);
    recalculate();
  });
});

// Função principal de cálculo
function recalculate() {
  const anglePerPixel = 1 / 20;
  let angleOffset = distancePixels * anglePerPixel;
  let angle = 90 - angleOffset;

  // Fator de vento estimado baseado em direção (simplificação)
  let factor = 0.5;
  if (currentWind < 0) factor = 0.6;
  if (currentWind > 0) factor = 0.4;
  if (currentWind === 0) factor = 0;

  angle += currentWind * factor;

  // Ajuste por mobile
  let power = 2 + mobileAdjustments[selectedMobile];

  if (angle < 1 || angle > 89) {
    // ângulo impossível => recalcular força
    let newAngle = Math.max(1, Math.min(89, angle));
    let factorProporcional = (90 - newAngle) / (90 - angleOffset);
    power *= factorProporcional;

    // Atualizar BFR
    let bfrPercent = Math.min(1, power / 4);
    bfr.style.width = `${bfrPercent * 100}%`;
  } else {
    bfr.style.width = '50%'; // força padrão
  }

  // Log opcional para debug
  console.log({
    pixel: distancePixels,
    angle: angle.toFixed(2),
    power: power.toFixed(2),
    mobile: selectedMobile,
    wind: currentWind
  });
}
