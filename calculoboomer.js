// calculoboomer.js
function calculateBoomerMode({ distancePixels, windStrength, windAngle, update }) {
  const totalPixels = 800;
  const pixelsPerPart = totalPixels / 30;
  const distanceParts = distancePixels / pixelsPerPart;
  const distanceFraction = distancePixels / totalPixels;

  // Fórmula de potência precisa
  const power = -1.4 * (distanceFraction ** 2) + 4.21 * distanceFraction + 0.5375;

  // Fatores reais por direção
  function getWindFactor(angle) {
    if (angle === 90) return 0.8;
    if (angle === 270) return 0.8;
    if (angle === 180 || angle === 0) return 0.5;
    if (angle === 45 || angle === 135 || angle === 225 || angle === 315) return 0.7;
    return 0.6;
  }

  const windFactor = getWindFactor(windAngle);
  const windCorrection = windStrength * windFactor;

  // Ângulo base fixo de 50, corrigido pelo vento
  let angle = 50 - windCorrection;
  angle = Math.max(1, Math.min(89, angle));

  update(angle, Math.min(power, 4.0));
}
