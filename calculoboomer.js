function calculateBoomerMode({ distancePixels, windStrength, windAngle, update }) {
  const totalPixels = 800;
  const pixelsPerPart = totalPixels / 30;
  const distanceFraction = distancePixels / totalPixels;

  // Fórmula de potência precisa (padrão da planilha paga)
  let power = -1.4 * (distanceFraction ** 2) + 4.21 * distanceFraction + 0.5375;

  function getWindFactor(angle) {
    if (angle === 90 || angle === 270) return 0.8;
    if (angle === 0 || angle === 180) return 0.5;
    if ([45, 135, 225, 315].includes(angle)) return 0.7;
    return 0.6;
  }

  function getWindImpact(angle) {
    if ([0, 45, 90, 135].includes(angle)) return 'a favor';
    if ([180, 225, 270, 315].includes(angle)) return 'contra';
    return 'neutro';
  }

  const windFactor = getWindFactor(windAngle);
  const impact = getWindImpact(windAngle);
  const windCorrection = windStrength * windFactor;

  let angle =
    impact === 'a favor' ? 50 - windCorrection :
    impact === 'contra' ? 50 + windCorrection :
    50;

  angle = Math.max(1, Math.min(89, angle));
  power = Math.min(power, 4.0);

  update(angle, power);
}
