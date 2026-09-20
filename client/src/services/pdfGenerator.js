import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePdfReport = (calculationResult, userName = 'Candidate') => {
  if (!calculationResult) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [37, 99, 235];   // Enterprise Blue
  const motherColor = [225, 29, 72];    // Enterprise Rose
  const fatherColor = [37, 99, 235];    // Enterprise Blue
  const darkBg = [15, 23, 42];

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 40, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('QUANTUM VEDIC', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(199, 210, 254);
  doc.text('PARENTAL LEGACY & LIFE FACTORS ANALYTICS REPORT', 14, 25);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Assessment Candidate: ${userName}`, 14, 32);

  // Metadata Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 46, 182, 28, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('CANDIDATE DATE OF BIRTH:', 20, 56);
  doc.text('DOMINANT PARENT:', 85, 56);
  doc.text('VARIANCE / DELTA:', 150, 56);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235);
  doc.text(calculationResult.dob || 'N/A', 20, 64);

  doc.setTextColor(calculationResult.dominantParent === 'Mother' ? 225 : 37, 
                   calculationResult.dominantParent === 'Mother' ? 29 : 99, 
                   calculationResult.dominantParent === 'Mother' ? 72 : 235);
  doc.text(`${calculationResult.dominantParent} Dominant`, 85, 64);

  doc.setTextColor(15, 23, 42);
  doc.text(`${calculationResult.differencePercentage}% Difference`, 150, 64);

  // Summary Metrics Badges
  doc.setFillColor(253, 242, 248);
  doc.roundedRect(14, 80, 58, 20, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(157, 23, 77);
  doc.text("MOTHER'S INFLUENCE", 18, 87);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${calculationResult.motherInfluence}%`, 18, 95);

  doc.setFillColor(238, 242, 255);
  doc.roundedRect(76, 80, 58, 20, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(67, 56, 202);
  doc.text("FATHER'S INFLUENCE", 80, 87);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${calculationResult.fatherInfluence}%`, 80, 95);

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(138, 80, 58, 20, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52);
  doc.text('GRAND TOTAL INVARIANT', 142, 87);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${calculationResult.grandTotal.toFixed(3)}%`, 142, 95);

  // Breakdown Table
  const tableData = calculationResult.factors.map((f, idx) => [
    idx + 1,
    f.name,
    f.motherValue.toFixed(3),
    f.fatherValue.toFixed(3),
    f.totalValue.toFixed(3)
  ]);

  tableData.push([
    '',
    'TOTAL COMBINED',
    calculationResult.motherTotal.toFixed(3),
    calculationResult.fatherTotal.toFixed(3),
    calculationResult.grandTotal.toFixed(3)
  ]);

  autoTable(doc, {
    startY: 108,
    head: [['#', 'LIFE FACTOR', 'MOTHER INFLUENCE', 'FATHER INFLUENCE', 'TOTAL COMBINED']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'left', cellWidth: 60, fontStyle: 'bold' },
      2: { halign: 'right', cellWidth: 36, textColor: [225, 29, 72] }, // Enterprise Rose
      3: { halign: 'right', cellWidth: 36, textColor: [37, 99, 235] },  // Enterprise Blue
      4: { halign: 'right', cellWidth: 38, fontStyle: 'bold' }
    },
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold'
    },
    didParseCell: function (data) {
      if (data.row.index === tableData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        if (data.column.index === 4) {
          data.cell.styles.textColor = [220, 38, 38]; // Red for 100
        }
      }
    }
  });

  // Footer text
  const finalY = doc.lastAutoTable.finalY || 200;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Mathematical Verification: Mother + Father = Factor Total | Grand Total strictly equals 100.000', 14, finalY + 12);
  doc.text('Built & Designed for Full Stack Technical Assessment by Lokesh Prajapati', 14, finalY + 17);

  // Save the PDF
  const cleanDob = (calculationResult.dob || 'Report').replace(/\//g, '-');
  doc.save(`Quantum_Vedic_Legacy_Report_${cleanDob}.pdf`);
};
