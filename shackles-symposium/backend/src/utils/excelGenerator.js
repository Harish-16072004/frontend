const ExcelJS = require('exceljs');

/**
 * Export data to Excel
 * @param {Array} data - Array of objects to export
 * @param {String} sheetName - Name of the sheet
 * @returns {Promise<Buffer>} Excel file buffer
 */
exports.exportToExcel = async (data, sheetName = 'Sheet1') => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    // Get column headers from first object
    const headers = Object.keys(data[0]);
    
    // Define columns
    worksheet.columns = headers.map(header => ({
      header: header,
      key: header,
      width: 20
    }));

    // Style header row
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data rows
    data.forEach(row => {
      worksheet.addRow(row);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const length = cell.value ? cell.value.toString().length : 10;
        if (length > maxLength) {
          maxLength = length;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // Add borders to all cells
    worksheet.eachRow({ includeEmpty: false }, row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;

  } catch (error) {
    console.error('Excel generation error:', error);
    throw new Error('Failed to generate Excel file');
  }
};

/**
 * Export registrations to Excel with formatting
 * @param {Array} registrations - Registration data
 * @returns {Promise<Buffer>} Excel file buffer
 */
exports.exportRegistrationsToExcel = async (registrations) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registrations');

    // Define columns with specific formatting
    worksheet.columns = [
      { header: 'Registration No', key: 'regNo', width: 18 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'College', key: 'college', width: 35 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Event', key: 'event', width: 30 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Payment Status', key: 'paymentStatus', width: 15 },
      { header: 'Registration Date', key: 'date', width: 18 }
    ];

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // Add data
    registrations.forEach((reg, index) => {
      const row = worksheet.addRow({
        regNo: reg.registrationNumber,
        name: reg.user?.name || 'N/A',
        email: reg.user?.email || 'N/A',
        phone: reg.user?.phone || 'N/A',
        college: reg.user?.college || 'N/A',
        department: reg.user?.department || 'N/A',
        year: reg.user?.year || 'N/A',
        event: reg.event?.name || 'N/A',
        category: reg.event?.category || 'N/A',
        status: reg.status,
        amount: `₹${reg.amount}`,
        paymentStatus: reg.paymentStatus,
        date: new Date(reg.createdAt).toLocaleDateString()
      });

      // Alternate row colors
      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF9FAFB' }
        };
      }

      // Color code status
      const statusCell = row.getCell('status');
      if (reg.status === 'confirmed') {
        statusCell.font = { color: { argb: 'FF10B981' }, bold: true };
      } else if (reg.status === 'cancelled') {
        statusCell.font = { color: { argb: 'FFEF4444' }, bold: true };
      } else {
        statusCell.font = { color: { argb: 'FFF59E0B' }, bold: true };
      }
    });

    // Add borders
    worksheet.eachRow(row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
      });
    });

    // Add summary at bottom
    const summaryRow = worksheet.addRow([]);
    summaryRow.height = 5;

    const totalRow = worksheet.addRow({
      regNo: 'TOTAL',
      name: registrations.length + ' Registrations',
      amount: `₹${registrations.reduce((sum, r) => sum + r.amount, 0)}`
    });
    totalRow.font = { bold: true, size: 12 };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDBEAFE' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;

  } catch (error) {
    console.error('Excel export error:', error);
    throw new Error('Failed to export registrations to Excel');
  }
};

/**
 * Export payments to Excel
 * @param {Array} payments - Payment data
 * @returns {Promise<Buffer>} Excel file buffer
 */
exports.exportPaymentsToExcel = async (payments) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Payments');

    worksheet.columns = [
      { header: 'Transaction ID', key: 'transactionId', width: 25 },
      { header: 'Order ID', key: 'orderId', width: 25 },
      { header: 'User Name', key: 'userName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Method', key: 'method', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Date', key: 'date', width: 18 }
    ];

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF10B981' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data
    payments.forEach(payment => {
      worksheet.addRow({
        transactionId: payment.transactionId,
        orderId: payment.orderId,
        userName: payment.user?.name || 'N/A',
        email: payment.user?.email || 'N/A',
        amount: `₹${payment.amount}`,
        method: payment.method,
        status: payment.status,
        date: new Date(payment.paidAt || payment.createdAt).toLocaleDateString()
      });
    });

    // Add borders
    worksheet.eachRow(row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;

  } catch (error) {
    console.error('Payment export error:', error);
    throw new Error('Failed to export payments to Excel');
  }
};
