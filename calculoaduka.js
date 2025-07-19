// calculoaduka.js
function calculateAdukaMode({ distancePixels, windStrength, windAngle, update }) {
  const totalPixels = 800;
  const parts = 30;
  const pixelsPerPart = totalPixels / parts;
  const minAngle = 30;
  const maxAngle = 89;

  // 🧭 Correção de vento baseada em guias clássicos
  function getWindFactor(angle) {
    if (angle === 90 || angle === 270) return 0.3;
    if ([45, 135, 225, 315].includes(angle)) return 0.4;
    if ([0, 180].includes(angle)) return 0.2;
    return 0.3;
  }

  function getWindImpact(angle) {
    if ([0, 45, 90, 135].includes(angle)) return 'a favor';
    if ([180, 225, 270, 315].includes(angle)) return 'contra';
    return 'neutro';
  }

  // 🎯 Ângulo base pela distância
  const distanceParts = Math.floor(distancePixels / pixelsPerPart);
  let baseAngle = 60 - distanceParts;

  // 🌬️ Correção de vento
  const windFactor = getWindFactor(windAngle);
  const impact = getWindImpact(windAngle);
  let windCorrection = windStrength * windFactor;

  // Ajuste extra conforme guias: +1 grau se vento > 7, +2 se > 18
  if (windStrength > 7) windCorrection += 1;
  if (windStrength > 18) windCorrection += 1;

  let rawAngle =
    impact === 'a favor' ? baseAngle - windCorrection :
    impact === 'contra' ? baseAngle + windCorrection :
    baseAngle;

  // 🔒 Limitar ângulo entre 30° e 89°
  let finalAngle = Math.max(minAngle, Math.min(maxAngle, rawAngle));

  // 🔋 Potência por distância (SS2: +0.2 aplicado)
  let basePower = 1.0;
  const distanceFraction = distancePixels / totalPixels;
  if (distanceFraction <= 0.33) basePower = 1.3;
  else if (distanceFraction <= 0.5) basePower = 1.9;
  else if (distanceFraction <= 0.75) basePower = 2.4;
  else basePower = 2.9;

  // 🧪 Ajuste de força se ângulo foi travado abaixo do ideal
  let correctedPower = basePower;
  if (rawAngle < minAngle) {
    correctedPower = basePower * (minAngle / rawAngle);
  }

  // ⚠️ Se ultrapassar 4.00, ajustar ângulo para compensar
  while (correctedPower > 4.0 && finalAngle > minAngle) {
    finalAngle -= 1;
    correctedPower = basePower * (minAngle / finalAngle);
  }

  if (correctedPower > 4.0) {
    correctedPower = 4.0;
    finalAngle = minAngle;
  }

  update(finalAngle, correctedPower);
}

