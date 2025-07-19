function calculateIceMode({ distancePixels, windStrength, windAngle, update }) {
  const totalPixels = 800;
  const parts = 30;
  const pixelsPerPart = totalPixels / parts;
  const maxAngle = 90;

  function getWindImpact(angle) {
    if ([0, 45, 90, 135].includes(angle)) return 'a favor';
    if ([180, 225, 270, 315].includes(angle)) return 'contra';
    return 'neutro';
  }

  function getWindFactor(angle) {
    if (angle === 90 || angle === 270) return 0.5;
    if ([45, 135, 225, 315].includes(angle)) return 0.6;
    if (angle === 0 || angle === 180) return 0.3;
    return 0.4;
  }

  const distanceParts = Math.floor(distancePixels / pixelsPerPart);
  const baseAngle = maxAngle - distanceParts;

  const windFactor = getWindFactor(windAngle);
  const impact = getWindImpact(windAngle);
  let windCorrection = windStrength * windFactor;

  if (windStrength > 7) windCorrection += 1;
  if (windStrength > 18) windCorrection += 1;

  const rawAngle =
    impact === 'a favor' ? baseAngle + windCorrection :
    impact === 'contra' ? baseAngle - windCorrection :
    baseAngle;

  const finalAngle = Math.max(1, Math.min(89, rawAngle));

  // 🔋 Potência por distância (modo SS2)
  let basePower = 1.0;
  const distanceFraction = distancePixels / totalPixels;
  if (distanceFraction <= 0.33) basePower = 1.6;
  else if (distanceFraction <= 0.5) basePower = 2.1;
  else basePower = 2.4;

  const finalPower = Math.min(basePower, 4.0);

  update(finalAngle, finalPower);
}
