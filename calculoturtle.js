// calculoturtle.js
function calculateTurtleMode({ distancePixels, windStrength, windAngle, update }) {
  const totalPixels = 800;
  const divisions = 30;
  const pixelsPerPart = totalPixels / divisions;
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

  const parts = Math.floor(distancePixels / pixelsPerPart);
  const baseAngle = maxAngle - parts;

  const windFactor = getWindFactor(windAngle);
  const impact = getWindImpact(windAngle);
  let correction = windStrength * windFactor;

  // 🔧 Ajuste extra para ventos fortes
  if (windStrength > 7) correction += 1;
  if (windStrength > 18) correction += 1;

  const rawAngle =
    impact === 'a favor' ? baseAngle + correction :
    impact === 'contra' ? baseAngle - correction :
    baseAngle;

  const finalAngle = Math.max(1, Math.min(89, rawAngle));

  const basePower = 2.4;
  const correctedPower =
    rawAngle > 89 ? basePower * (rawAngle / finalAngle) : basePower;

  update(finalAngle, correctedPower);
}
