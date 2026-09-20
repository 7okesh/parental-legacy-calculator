import { calculateLegacyFactors } from './services/calculationService.js';

console.log('====================================================');
console.log('QUANTUM VEDIC CALCULATION VERIFICATION SUITE');
console.log('Candidate: Lokesh Prajapati');
console.log('====================================================\n');

const testCases = [
  { dob: '01/06/2026', expectedParity: 'Odd', expectedDominant: 'Mother' },
  { dob: '02/06/2026', expectedParity: 'Even', expectedDominant: 'Father' },
  { dob: '03/06/2026', expectedParity: 'Odd', expectedDominant: 'Mother' },
  { dob: '04/06/2026', expectedParity: 'Even', expectedDominant: 'Father' },
  { dob: '15/08/1997', expectedParity: 'Odd', expectedDominant: 'Mother' },
  { dob: '26/01/2000', expectedParity: 'Even', expectedDominant: 'Father' },
  { dob: '29/02/2024', expectedParity: 'Odd', expectedDominant: 'Mother' }, // Leap year
];

let allPassed = true;

testCases.forEach((tc, idx) => {
  const result = calculateLegacyFactors(tc.dob);
  const isGrand100 = Math.abs(result.grandTotal - 100) < 0.001;
  const isParityCorrect = result.dominantParent === tc.expectedDominant;
  const isDiff367 = result.differencePercentage === 3.67;
  const areFactorsConsistent = result.factors.every(f => 
    Math.abs((f.motherValue + f.fatherValue) - f.totalValue) < 0.001
  );

  const passed = isGrand100 && isParityCorrect && isDiff367 && areFactorsConsistent;
  if (!passed) allPassed = false;

  console.log(`Test #${idx + 1} [${tc.dob}]:`);
  console.log(`  - Day Parity: ${result.isOddDay ? 'ODD' : 'EVEN'} | Dominant: ${result.dominantParent}`);
  console.log(`  - Mother Total: ${result.motherTotal} (${result.motherInfluence}%)`);
  console.log(`  - Father Total: ${result.fatherTotal} (${result.fatherInfluence}%)`);
  console.log(`  - Grand Total: ${result.grandTotal} (Must be 100.000) -> ${isGrand100 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Dominance Delta: ${result.differencePercentage}% -> ${isDiff367 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Status: ${passed ? '✅ ALL INVARIANTS PASSED' : '❌ FAILED'}\n`);
});

if (allPassed) {
  console.log('🎉 100% OF TEST CASES PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('⚠️ SOME TEST CASES FAILED');
  process.exit(1);
}
