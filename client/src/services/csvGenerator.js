export const generateCsvExport = (calculationResult) => {
  if (!calculationResult) return;

  const rows = [
    ['QUANTUM VEDIC - PARENTAL LEGACY & LIFE FACTORS CALCULATOR'],
    ['Generated Date', new Date().toISOString()],
    ['Candidate Date of Birth', calculationResult.dob],
    ['Dominant Parent', calculationResult.dominantParent],
    ['Dominance Difference', `${calculationResult.differencePercentage}%`],
    [],
    ['#', 'Life Factor', 'Mother Influence', 'Father Influence', 'Total Combined', 'Min Bound', 'Max Bound']
  ];

  calculationResult.factors.forEach((f, idx) => {
    rows.push([
      idx + 1,
      `"${f.name}"`,
      f.motherValue.toFixed(3),
      f.fatherValue.toFixed(3),
      f.totalValue.toFixed(3),
      f.min,
      f.max
    ]);
  });

  rows.push([]);
  rows.push([
    '',
    'TOTAL COMBINED',
    calculationResult.motherTotal.toFixed(3),
    calculationResult.fatherTotal.toFixed(3),
    calculationResult.grandTotal.toFixed(3),
    '',
    ''
  ]);

  const csvContent = rows.map(e => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const cleanDob = (calculationResult.dob || 'Export').replace(/\//g, '-');
  link.setAttribute('href', url);
  link.setAttribute('download', `Quantum_Vedic_Data_${cleanDob}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
