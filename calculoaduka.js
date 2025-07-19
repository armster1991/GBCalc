// calculoaduka.js
function calculateAdukaMode({ distancePixels, windStrength, windAngle, update }) {
  const totalPixels = 800;
  const divisions = 30;
  const pixelsPerPart = totalPixels / divisions;

  function getWindImpact(angle) {
    if ([0, 45, 90, 135].includes(angle)) return 'a favor';
    if ([180, 225, 270, 315].includes(angle)) return 'contra';
    return 'neutro';
  }

  function getWindFactor(angle) {
    if (angle === 90 || angle === 270) return 0.3;
    if ([45, 135, 225, 315].includes(angle)) return 0.4;
    if ([0, 180].includes(angle)) return 0.2;
    return 0.3;
  }

  const parts = Math.floor(distancePixels / pixelsPerPart);
  const baseAngle = 60 - parts;

  const windFactor = getWindFactor(windAngle);
  const impact = getWindImpact(windAngle);
  const windCorrection = windStrength * windFactor;

  const rawAngle =
    impact === 'a favor' ? baseAngle + windCorrection :
    impact === 'contra' ? baseAngle - windCorrection :
    baseAngle;

  const finalAngle = Math.max(40, Math.min(60, rawAngle));

  // 🔋 Potência por distância
  let basePower = 1.0;
  const distanceFraction = distancePixels / totalPixels;
  if (distanceFraction <= 0.33) basePower = 1.1;
  else if (distanceFraction <= 0.5) basePower = 1.7;
  else if (distanceFraction <= 0.75) basePower = 2.2;
  else basePower = 2.7;

  update(finalAngle, basePower);
}
