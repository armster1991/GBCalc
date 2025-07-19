function calculateArmorMode({ distancePixels, windStrength, windAngle, update }) {
  const totalPixels = 800;
  const divisions = 30;
  const pixelsPerPart = totalPixels / divisions;
  const F0 = 2.48; // Potência base para 1 tela
  const parts = Math.floor(distancePixels / pixelsPerPart);
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

  // Potência base por partes (modo fixo de 35°)
  let basePower = 1.0;
  if (parts <= 5) basePower = 1.24;
  else if (parts <= 10) basePower = 1.75;
  else if (parts <= 15) basePower = 2.15;
  else if (parts <= 20) basePower = 2.48;
  else if (parts <= 25) basePower = 2.77;
  else basePower = 3.03;

  const windFactor = getWindFactor(windAngle);
  const impact = getWindImpact(windAngle);
  const i = impact === 'contra' ? 0.96 : impact === 'a favor' ? -0.96 : 0;
  const windCorrection = (basePower / F0) * (windStrength * i) / 100;

  const finalPower = Math.min(4.0, basePower + windCorrection);

  // Ângulo fixo padrão de 35° para tiros retos
  const finalAngle = 35;

  update(finalAngle, finalPower);
}
