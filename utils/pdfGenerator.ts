const { pdf } = require('pdf-lib');

async function generatePDF(city, weatherData) {
  const pdfDoc = await pdf.PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText(`Weather Report for ${city}`, { x: 50, y: 750, size: 24 });
  page.drawText(`Temperature: ${weatherData.temperature}`, { x: 50, y: 700, size: 18 });
  page.drawText(`Conditions: ${weatherData.conditions}`, { x: 50, y: 650, size: 18 });
  const pdfBytes = await pdfDoc.save();
  const fs = require('fs');
  fs.writeFileSync(`reports/${city}-weather-report.pdf`, pdfBytes);
}

module.exports = { generatePDF };
