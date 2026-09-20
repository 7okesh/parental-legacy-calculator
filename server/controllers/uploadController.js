import * as XLSX from 'xlsx';

export const parseExcelFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload a valid .xlsx or .xls file.'
      });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    // Look for rows with factors
    const factors = [];
    let headerRowIndex = -1;

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const firstCell = String(row[0] || '').trim().toUpperCase();
      if (firstCell.includes('LIFE FACTORS') || firstCell.includes('FACTOR')) {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex !== -1) {
      for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const factorName = String(row[0] || '').trim();
        if (!factorName || factorName.toUpperCase() === 'TOTAL') continue;

        const mother = parseFloat(row[1]) || 0;
        const father = parseFloat(row[2]) || 0;
        const total = parseFloat(row[3]) || (mother + father);
        const min = parseFloat(row[4]) || undefined;
        const max = parseFloat(row[5]) || undefined;

        factors.push({
          id: factors.length + 1,
          name: factorName,
          mother,
          father,
          total: Number(total.toFixed(3)),
          min,
          max
        });
      }
    }

    const motherSum = Number(factors.reduce((sum, f) => sum + f.mother, 0).toFixed(3));
    const fatherSum = Number(factors.reduce((sum, f) => sum + f.father, 0).toFixed(3));
    const grandSum = Number((motherSum + fatherSum).toFixed(3));

    return res.status(200).json({
      success: true,
      message: `Successfully parsed ${factors.length} factors from ${req.file.originalname}`,
      data: {
        fileName: req.file.originalname,
        sheetName: firstSheetName,
        factors,
        summary: {
          motherSum,
          fatherSum,
          grandSum,
          isGrandSum100: Math.abs(grandSum - 100) < 0.01
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to parse Excel file: ${error.message}`
    });
  }
};
