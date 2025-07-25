const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

/**
 * Generates a PDF report for a given symbol and content.
 * @param {string} content - The content to include in the PDF.
 * @param {string} symbol - The financial symbol (like AAPL, TSLA, etc.)
 * @returns {Promise<string>} - A Promise that resolves with the file path of the generated PDF.
 */
function generateReportFile(content, symbol) {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = Date.now();
      const reportName = `report-${symbol}-${timestamp}.pdf`;
      const reportPath = path.join(__dirname, reportName);

      console.log(`[generateReportFile] Starting report generation: ${reportName}`);

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(reportPath);

      doc.pipe(stream);

      // Title
      doc.fontSize(20).text(`📊 Risk Report for ${symbol.toUpperCase()}`, {
        underline: true,
        align: 'center',
      });

      doc.moveDown();

      // Body content
      doc.fontSize(12).text(content, {
        align: 'left',
      });

      doc.end();

      // Handle stream events
      stream.on('finish', () => {
        console.log(`[generateReportFile] Report created successfully: ${reportPath}`);
        resolve(reportPath);
      });

      stream.on('error', (error) => {
        console.error(`[generateReportFile] Stream error:`, error);
        reject(new Error(`Failed to write PDF to disk: ${error.message}`));
      });
    } catch (error) {
      console.error(`[generateReportFile] Exception caught:`, error);
      reject(new Error(`Failed to create PDF report: ${error.message}`));
    }
  });
}

module.exports = { generateReportFile };
