// calculoboomer.js
function calculateBoomerMode({ distancePixels, windStrength, windAngle, update }) {
  const totalPixels = 800;
  const sections = 30;
  const pixelsPerSection = totalPixels / sections;
  const maxAngle = 89;
  const minAngle = 60;

  // 🎯 Tabela suavizada com 30 ângulos refinados
  const angleMap = Array.from({ length: sections }, (_, i) => {
    const fraction = i / (sections - 1);
    const rawAngle = maxAngle - (maxAngle - minAngle) * Math.pow(fraction, 1.5);
    return Math.round(Math.max(1, Math.min(90, rawAngle)));
  });

  function tailwindCorrection(wind) {
    if (wind <= 3) return 1;
    if (wind <= 6) return 2;
    if (wind <= 8) return 3;
    if (wind <= 10) return 4;
    if (wind <= 12) return 5;
    if (wind === 13) return 6;
    return 7;
  }

  function headwindCorrection(wind) {
    if (wind <= 3) return 1;
    if (wind <= 4) return 2;
    if (wind <= 7) return 3;
    if (wind <= 10) return 4;
    if (wind <= 13) return 5;
    return 6;
  }

  function getRelativeWindDirection(windAngle) {
    if (windAngle === 90) return "tailwind";
    if (windAngle === 270) return "headwind";
    if (windAngle === 135 || windAngle === 45) return "angled-forward";
    if (windAngle === 225 || windAngle === 315) return "down-forward";
    return "neutral";
  }

  const index = Math.floor(distancePixels / pixelsPerSection);
  const baseAngle = angleMap[Math.min(index, angleMap.length - 1)];

  const direction = getRelativeWindDirection(windAngle);
  let windCorrection = 0;

  if (direction === "tailwind") {
    windCorrection = tailwindCorrection(windStrength);
  } else if (direction === "headwind") {
    windCorrection = headwindCorrection(windStrength);
  } else if (direction === "down-forward") {
    windCorrection = windStrength * 0.4;
  } else if (direction === "angled-forward") {
    windCorrection = windStrength * 0.8;
  } else {
    windCorrection = windStrength * 0.6;
  }

  const rawAngle = baseAngle + windCorrection;
  const finalAngle = Math.min(89, Math.max(1, rawAngle));

  const distanceFraction = distancePixels / totalPixels;
  const basePower = distanceFraction <= 0.33 ? 2.15 : distanceFraction <= 0.66 ? 2.2 : 2.3;

  // 🧮 Correção da força caso o ângulo seja limitado
  const power =
    rawAngle > 89
      ? basePower * (rawAngle / finalAngle)
      : basePower;

  update(finalAngle, power);
}
