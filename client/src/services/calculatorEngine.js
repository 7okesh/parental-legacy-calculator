import { DEFAULT_FACTORS, TOTAL_INFLUENCE_TARGET } from '../utils/constants.js';
import { parseDDMMYYYY } from '../utils/dateUtils.js';

export const computeParentalLegacy = (dateString, customFactors = null) => {
  const dateObj = parseDDMMYYYY(dateString) || new Date();
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  const isOddDay = day % 2 !== 0;
  const dominantParent = isOddDay ? 'Mother' : 'Father';
  const nonDominantParent = isOddDay ? 'Father' : 'Mother';

  const factorsToUse = customFactors && customFactors.length === 7 ? customFactors : DEFAULT_FACTORS;

  const factors = factorsToUse.map((factor) => {
    const higherVal = factor.highBaseline;
    const lowerVal = factor.lowBaseline;

    const motherValue = isOddDay ? higherVal : lowerVal;
    const fatherValue = isOddDay ? lowerVal : higherVal;
    const totalValue = Number((motherValue + fatherValue).toFixed(3));

    return {
      id: factor.id,
      name: factor.name,
      motherValue,
      fatherValue,
      totalValue,
      min: factor.min,
      max: factor.max
    };
  });

  const motherTotal = Number(factors.reduce((acc, f) => acc + f.motherValue, 0).toFixed(3));
  const fatherTotal = Number(factors.reduce((acc, f) => acc + f.fatherValue, 0).toFixed(3));
  const grandTotal = Number((motherTotal + fatherTotal).toFixed(3));

  const motherInfluence = Number(motherTotal.toFixed(2));
  const fatherInfluence = Number(fatherTotal.toFixed(2));
  const differencePercentage = Number((Math.abs(motherTotal - fatherTotal)).toFixed(2));

  return {
    dob: dateString,
    day,
    month,
    year,
    isOddDay,
    dominantParent,
    nonDominantParent,
    differencePercentage, // 3.67
    motherInfluence,      // 51.84 or 48.16
    fatherInfluence,      // 48.16 or 51.84
    motherTotal,          // 51.837 or 48.163
    fatherTotal,          // 48.163 or 51.837
    grandTotal,           // 100.000
    factors,
    invariantsPassed: {
      sumEquals100: Math.abs(grandTotal - TOTAL_INFLUENCE_TARGET) < 0.001,
      factorSumsValid: factors.every(f => Math.abs((f.motherValue + f.fatherValue) - f.totalValue) < 0.001),
      parityValid: isOddDay ? (motherTotal > fatherTotal) : (fatherTotal > motherTotal)
    }
  };
};
