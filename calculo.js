window.addEventListener('DOMContentLoaded', () => {
  const ruler = document.getElementById('ruler');
  const bfr = document.getElementById('bfr-fill');
  const mobiles = document.querySelectorAll('.mobile');
  const windDirButtons = document.querySelectorAll('.wind-dir-button');
  const rvv = document.getElementById('rvv');
  rvv.addEventListener('mousemove', e => {
  const rect = rvv.getBoundingClientRect();
  const y = e.clientY - rect.top;
  const step = rect.height / 27;
  const index = Math.max(0, Math.min(26, Math.floor(y / step)));

  if (index !== currentWind) {
    currentWind = index;
    applyRVVVisual(currentWind);
    recalculate();
  }
});

  rvv.addEventListener('mousemove', e => {
  const rect = rvv.getBoundingClientRect();
  const y = e.clientY - rect.top;
  const step = rect.height / 27;
  const index = Math.max(0, Math.min(26, Math.floor(y / step)));
  if (index !== currentWind) {
    currentWind = index;
    applyRVVVisual(currentWind);
    recalculate();
  }
});

  const rvvTooltip = document.getElementById('rvv-tooltip');
  const windDebug = document.getElementById('wind-debug');
  const windDirectionLabel = document.getElementById('wind-direction-label');
  const rvvNumbers = document.querySelectorAll('.rvv-number');

  let currentWind = 0;
  let windDirection = 90;
  let selectedMobile = 'armor';
  let distancePixels = 0;

  const infoMobile = document.getElementById('selected-mobile');
  const infoPower = document.getElementById('corrected-power');
  const infoAngle = document.getElementById('calculated-angle');
  const powerLabel = document.getElementById('power-label');
  const angleLabel = document.getElementById('angle-label');
  const rulerHelp = document.getElementById('ruler-help');

  // 💬 Texto de ajuda sobre régua
  if (rulerHelp) {
    rulerHelp.textContent = 'Ponha o mouse em cima da posição de seu alvo';
  }

  // 🧭 Direções do vento via hover
  windDirButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      windDirButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      windDirection = parseInt(btn.dataset.angle);
      updateRVVColor();
      recalculate();
    });
  });

  // 🚀 Mobile selection
  mobiles.forEach(mob => {
    mob.addEventListener('click', () => {
      mobiles.forEach(m => m.classList.remove('selected'));
      mob.classList.add('selected');
      selectedMobile = mob.id;
      infoMobile.textContent = mob.title;
      recalculate();
    });
  });

  // 📏 Régua horizontal inferior
  ruler.addEventListener('mousemove', e => {
    const rect = ruler.getBoundingClientRect();
    const x = e.clientX - rect.left;
    distancePixels = Math.max(0, Math.min(800, x));
    ruler.style.background = `linear-gradient(to right, rgba(255,255,0,0.5) ${distancePixels}px, transparent 0%)`;
    recalculate();
  });

  const mobileAdjustments = {
    armor: 0,
    mage: -0.05,
    raon: 0.1,
    asate: 0.05
  };

  // 🔁 Hover direto sobre os números da RVV
  rvvNumbers.forEach((number, index) => {
    number.addEventListener('mouseenter', () => {
      currentWind = index;
      applyRVVVisual(currentWind);
      recalculate();
    });
  });

  function applyRVVVisual(windValue) {
    const intensity = windValue / 26;
    const r = Math.floor(51 + (255 - 51) * intensity);
    const g = Math.floor(51 + (165 - 51) * intensity);
    const b = Math.floor(51 + (0 - 51) * intensity);

    rvv.style.boxShadow = `0 0 ${5 + intensity * 15}px rgba(${r},${g},${b},0.8)`;
    rvvTooltip.textContent = windValue;
    rvvTooltip.style.color = `rgb(${r},${g},${b})`;
    rvvTooltip.style.textShadow = `0 0 ${6 + intensity * 10}px rgba(${r},${g},${b},1)`;
    updateRVVColor();
  }

  function updateRVVColor() {
    const multiplier = getDirectionalMultiplier(windDirection);
    let baseColor = '#555';
    if (multiplier > 0) baseColor = '#090';
    else if (multiplier < 0) baseColor = '#900';
    rvv.style.backgroundColor = baseColor;
  }

  function getWindFactor(px) {
    if (px <= 200) return 0.05;
    if (px <= 400) return 0.10;
    if (px <= 600) return 0.25;
    if (px <= 800) return 0.45;
    return 0;
  }

  function getDirectionalMultiplier(angle) {
    if (angle === 90) return 1;
    if (angle === 270) return -1;
    if (angle === 45 || angle === 135) return 0.5;
    if (angle === 225 || angle === 315) return -0.5;
    if (angle === 0) return 0.1;
    if (angle === 180) return -0.1;
    return 0;
  }

  function getWindDirectionText(angle) {
    const map = {
      0: 'Norte',
      45: 'Nordeste',
      90: 'Leste',
      135: 'Sudeste',
      180: 'Sul',
      225: 'Sudoeste',
      270: 'Oeste',
      315: 'Noroeste'
    };
    return map[angle] || `${angle}°`;
  }

  function recalculate() {
    const anglePerPixel = 1 / 20;
    let angleOffset = distancePixels * anglePerPixel;
    let angle = 90 - angleOffset;

    const factor = getWindFactor(distancePixels);
    const directionalImpact = getDirectionalMultiplier(windDirection);
    angle += currentWind * factor * directionalImpact;

    let power = 2 + mobileAdjustments[selectedMobile];
    let powerCorrected = power;

    const angleWasCorrected = angle < 1 || angle > 89;
    const newAngle = Math.max(1, Math.min(89, angle));
    const bfrPercent = Math.max(0, Math.min(1, powerCorrected / 4));

    if (angleWasCorrected) {
      const factorProporcional = angle / newAngle;
      powerCorrected = power * factorProporcional;
      bfr.style.width = `${bfrPercent * 100}%`;

      infoPower.style.color = 'orange';
      infoPower.style.fontWeight = 'bold';
      infoPower.style.textShadow = '0 0 5px #ffa500';

      powerLabel.textContent = 'Força Corrigida';
      angleLabel.textContent = 'Ângulo Corrigido';
    } else {
      bfr.style.width = '50%';
      infoPower.style.color = '';
      infoPower.style.fontWeight = '';
      infoPower.style.textShadow = '';

      powerLabel.textContent = 'Força';
      angleLabel.textContent = 'Ângulo';
    }

    infoAngle.textContent = `${Math.round(newAngle)}°` + (angleWasCorrected ? ` (Corrigida de ${Math.round(angle)}°)` : '');
    infoPower.textContent = powerCorrected.toFixed(2);

    const dirText = getWindDirectionText(windDirection);
    const impact = getDirectionalMultiplier(windDirection);
    let posicao = 'neutro';
    if (impact > 0) posicao = 'a favor';
    else if (impact < 0) posicao = 'contra';
    windDebug.textContent = `Vento: ${dirText} (${posicao})`;
  }
});
