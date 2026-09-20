import { LIFE_FACTORS, TOTAL_INFLUENCE_INVARIANT } from '../utils/factorConstants.js';

/**
 * Parses diverse date representations into day, month, year
 * @param {string|Date} dateInput 
 * @returns {{ day: number, month: number, year: number, formatted: string, dateObj: Date }}
 */
export const parseDob = (dateInput) => {
  if (!dateInput) {
    throw new Error('Date of Birth is required.');
  }

  let day, month, year;

  if (dateInput instanceof Date) {
    day = dateInput.getDate();
    month = dateInput.getMonth() + 1;
    year = dateInput.getFullYear();
  } else if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    // Check for DD/MM/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
      const parts = trimmed.split('/');
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    } 
    // Check for YYYY-MM-DD
    else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
      const parts = trimmed.split('-');
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      const parsed = new Date(trimmed);
      if (isNaN(parsed.getTime())) {
        throw new Error('Invalid date format. Expected DD/MM/YYYY or YYYY-MM-DD.');
      }
      day = parsed.getDate();
      month = parsed.getMonth() + 1;
      year = parsed.getFullYear();
    }
  } else {
    throw new Error('Invalid date input format.');
  }

  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Must be between 1 and 12.`);
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    throw new Error(`Invalid day: ${day}. Month ${month} has ${daysInMonth} days.`);
  }

  const paddedDay = String(day).padStart(2, '0');
  const paddedMonth = String(month).padStart(2, '0');
  const formatted = `${paddedDay}/${paddedMonth}/${year}`;

  return {
    day,
    month,
    year,
    formatted,
    dateObj: new Date(year, month - 1, day)
  };
};

/**
 * Calculates parental legacy factors based on Date of Birth
 * Parity rule:
 *   Odd Days: Mother values are higher (Mother Total = 51.837, Father Total = 48.163)
 *   Even Days: Father values are higher (Father Total = 51.837, Mother Total = 48.163)
 *   Card stat rounding: 51.84 vs 48.16
 *   Dominance difference: (51.837 - 48.163) = 3.67%
 *   Grand Total: Strictly 100.000
 */
export const calculateLegacyFactors = (dateInput, options = {}) => {
  const { day, month, year, formatted } = parseDob(dateInput);

  const isOddDay = day % 2 !== 0;
  const dominantParent = isOddDay ? 'Mother' : 'Father';
  const nonDominantParent = isOddDay ? 'Father' : 'Mother';

  // Compute values for each factor
  const factors = LIFE_FACTORS.map((factor) => {
    let higherVal = factor.highBaseline;
    let lowerVal = factor.lowBaseline;

    if (options.dynamicSeed) {
      const seed = Math.sin(day * 13 + month * 37 + year * 7) * 10000;
      const delta = (seed - Math.floor(seed) - 0.5) * 0.04;
      
      const candidateHigher = Number((higherVal + delta).toFixed(3));
      const candidateLower = Number((lowerVal - delta).toFixed(3));

      if (candidateHigher > candidateLower) {
        higherVal = candidateHigher;
        lowerVal = candidateLower;
      }
    }

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

  // Column Totals (3 decimal precision)
  const motherTotal = Number(factors.reduce((acc, f) => acc + f.motherValue, 0).toFixed(3));
  const fatherTotal = Number(factors.reduce((acc, f) => acc + f.fatherValue, 0).toFixed(3));
  const grandTotal = Number((motherTotal + fatherTotal).toFixed(3));

  // Rounded 2-decimal display values matching the video KPI cards
  const motherInfluence = Number(motherTotal.toFixed(2));
  const fatherInfluence = Number(fatherTotal.toFixed(2));
  
  // Difference calculated from high precision totals to match "3.67% Difference" in video
  const differencePercentage = Number((Math.abs(motherTotal - fatherTotal)).toFixed(2));

  return {
    dob: formatted,
    rawDate: { day, month, year },
    day,
    isOddDay,
    dominantParent,
    nonDominantParent,
    differencePercentage, // Exactly 3.67
    motherInfluence,      // 51.84 or 48.16
    fatherInfluence,      // 48.16 or 51.84
    motherTotal,          // 51.837 or 48.163
    fatherTotal,          // 48.163 or 51.837
    grandTotal,           // 100.000
    factors,
    invariantsPassed: {
      sumEquals100: Math.abs(grandTotal - TOTAL_INFLUENCE_INVARIANT) < 0.001,
      factorSumsValid: factors.every(f => Math.abs((f.motherValue + f.fatherValue) - f.totalValue) < 0.001),
      parityValid: isOddDay ? (motherTotal > fatherTotal) : (fatherTotal > motherTotal)
    }
  };
};
