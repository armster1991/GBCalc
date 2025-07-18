window.addEventListener('DOMContentLoaded', () => {
  // Seletores DOM
  const windDirButtons = document.querySelectorAll('.wind-dir-button');
  const ruler = document.getElementById('ruler');
  const bfr = document.getElementById('bfr-fill');
  const windButtons = document.querySelectorAll('.wind-button');
  const mobiles = document.querySelectorAll('.mobile');

  let currentWind = 0;
  let windDirection = 90;
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

  // AQUI FOI COMENTADO PARA BACKUP DA VERSÃO FUNCIONAL 1.0
  // windDirButtons.forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     windDirButtons.forEach(b => b.classList.remove('active'));
  //     btn.classList.add('active');
  //     windDirection = parseInt(btn.dataset.angle);
  //     recalculate();
  //   });
  // });

  windDirButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      windDirButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      windDirection = parseInt(btn.dataset.angle);
      recalculate();
    });
  });

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

  function getWindFactor(px) {
    if (px <= 200) return 0.05;
    if (px <= 400) return 0.10;
    if (px <= 600) return 0.25;
    if (px <= 800) return 0.45;
    return 0;
  }

  // ✅ Direções integradas: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
  function getDirectionalMultiplier(angle) {
    if (angle === 90) return 1;         // Leste → vento a favor
    if (angle === 270) return -1;       // Oeste ← vento contra
    if (angle === 45 || angle === 135) return 0.5;    // Nordeste/Sudeste ↗ ↘ semi-favorável
    if (angle === 225 || angle === 315) return -0.5;  // Sudoeste/Noroeste ↙ ↖ semi-contra
    if (angle === 0) return 0.1;        // Norte ↑ leve efeito
    if (angle === 180) return -0.1;     // Sul ↓ leve efeito reverso
    return 0;
  }

  function recalculate() {
    const anglePerPixel = 1 / 20;
    let angleOffset = distancePixels * anglePerPixel;
    let angle = 90 - angleOffset;

    // AQUI FOI COMENTADO PARA BACKUP DA VERSÃO FUNCIONAL 1.0
    // let factor = 0.5;
    // if (currentWind < 0) factor = 0.6;
    // if (currentWind > 0) factor = 0.4;
    // if (currentWind === 0) factor = 0;

    let factor = getWindFactor(distancePixels);
    let directionalImpact = getDirectionalMultiplier(windDirection);

    // AQUI FOI COMENTADO PARA BACKUP DA VERSÃO FUNCIONAL 1.0
    // angle += currentWind * factor;
    // angle += currentWind * factor * directionalImpact;
    angle += currentWind * factor * directionalImpact;

    let power = 2 + mobileAdjustments[selectedMobile];
    let powerCorrected = power;

    if (angle < 1 || angle > 89) {
      const newAngle = Math.max(1, Math.min(89, angle));
      let factorProporcional = angle / newAngle;
      powerCorrected = power * factorProporcional;
      let bfrPercent = Math.max(0, Math.min(1, powerCorrected / 4));
      bfr.style.width = `${bfrPercent * 100}%`;

      infoPower.style.color = 'orange';
      infoPower.style.fontWeight = 'bold';
      infoPower.style.textShadow = '0 0 5px #ffa500';

      // AQUI FOI COMENTADO PARA BACKUP DA VERSÃO FUNCIONAL 1.0 — removido texto do aviso
      // const alertDiv = document.getElementById('alert-correction');
      // if (alertDiv) {
      //   alertDiv.textContent = '⚠️ Ângulo ajustado automaticamente para manter trajetória';
      //   alertDiv.style.color = 'orange';
      // }
    } else {
      bfr.style.width = '50%';
      infoPower.style.color = '';
      infoPower.style.fontWeight = '';
      infoPower.style.textShadow = '';
      const alertDiv = document.getElementById('alert-correction');
      if (alertDiv) {
        alertDiv.textContent = '';
      }
    }

    infoAngle.textContent = `${Math.round(Math.max(1, Math.min(89, angle)))}° ${angle < 1 || angle > 89 ? `(ajustado de ${Math.round(angle)}°)` : ''}`;
    infoPower.textContent = powerCorrected.toFixed(2);
  }
});
