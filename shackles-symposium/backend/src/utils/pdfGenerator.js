const PDFDocument = require('pdfkit');
const { generateQRBuffer } = require('./qrGenerator');

/**
 * Generate ticket PDF
 * @param {Object} registration - Registration data
 * @param {Object} user - User data
 * @param {Object} event - Event data
 * @returns {Promise<Buffer>} PDF buffer
 */
exports.generateTicketPDF = async (registration, user, event) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header with logo/title
      doc.fontSize(28)
         .font('Helvetica-Bold')
         .fillColor('#4F46E5')
         .text('SHACKLES 2025', { align: 'center' });

      doc.fontSize(14)
         .font('Helvetica')
         .fillColor('#6B7280')
         .text('National Level Technical & Non-Technical Symposium', { align: 'center' });

      doc.fontSize(12)
         .text('Parisutham Institute of Technology and Science', { align: 'center' })
         .moveDown(2);

      // Ticket border
      doc.rect(50, doc.y, 495, 450)
         .lineWidth(2)
         .strokeColor('#4F46E5')
         .stroke();

      doc.moveDown(1);

      // Event Details Section
      doc.fontSize(20)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('EVENT TICKET', { align: 'center' })
         .moveDown(1);

      const detailsStartY = doc.y;

      // Event Information
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#4B5563')
         .text('Event Name:', 70);
      
      doc.fontSize(14)
         .font('Helvetica')
         .fillColor('#1F2937')
         .text(event.name, 200, detailsStartY);

      doc.moveDown(0.5);

      // Registration Number
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#4B5563')
         .text('Registration No:', 70);
      
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#4F46E5')
         .text(registration.registrationNumber, 200, doc.y - 14);

      doc.moveDown(0.5);

      // Participant Name
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#4B5563')
         .text('Participant:', 70);
      
      doc.fontSize(14)
         .font('Helvetica')
         .fillColor('#1F2937')
         .text(user.name, 200, doc.y - 14);

      doc.moveDown(0.5);

      // Email
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#4B5563')
         .text('Email:', 70);
      
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#1F2937')
         .text(user.email, 200, doc.y - 14);

      doc.moveDown(0.5);

      // Phone
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#4B5563')
         .text('Phone:', 70);
      
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#1F2937')
         .text(user.phone, 200, doc.y - 14);

      doc.moveDown(0.5);

      // College
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#4B5563')
         .text('College:', 70);
      
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#1F2937')
         .text(user.college, 200, doc.y - 14, { width: 300 });

      doc.moveDown(1);

      // Event Date
      if (event.date) {
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#4B5563')
           .text('Event Date:', 70);
        
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#1F2937')
           .text(new Date(event.date).toLocaleDateString('en-IN', {
             day: '2-digit',
             month: 'long',
             year: 'numeric'
           }), 200, doc.y - 14);

        doc.moveDown(0.5);
      }

      // Venue
      if (event.venue) {
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#4B5563')
           .text('Venue:', 70);
        
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#1F2937')
           .text(event.venue, 200, doc.y - 14);

        doc.moveDown(1);
      }

      // Generate and add QR Code
      const qrData = {
        registrationId: registration._id.toString(),
        userId: user._id.toString(),
        eventId: event._id.toString(),
        registrationNumber: registration.registrationNumber
      };

      const qrBuffer = await generateQRBuffer(qrData);
      
      // Add QR code to PDF (centered at bottom)
      doc.image(qrBuffer, 220, doc.y + 10, { width: 150, height: 150 });

      doc.moveDown(10);

      // QR Code instruction
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#6B7280')
         .text('Scan this QR code at the venue for entry', { align: 'center' });

      doc.moveDown(2);

      // Footer
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#9CA3AF')
         .text('Please carry a valid ID along with this ticket', { align: 'center' })
         .text('For queries: shackles@pits.edu.in | +91 98765 43210', { align: 'center' })
         .moveDown(0.5)
         .text('Generated on: ' + new Date().toLocaleString('en-IN'), { align: 'center' });

      // Finalize PDF
      doc.end();

    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
};

/**
 * Generate registration confirmation PDF
 * @param {Object} data - Registration and user data
 * @returns {Promise<Buffer>} PDF buffer
 */
exports.generateConfirmationPDF = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .fillColor('#10B981')
         .text('✓ Registration Confirmed', { align: 'center' })
         .moveDown(2);

      // Content
      doc.fontSize(14)
         .font('Helvetica')
         .fillColor('#1F2937')
         .text(`Dear ${data.userName},`, { align: 'left' })
         .moveDown(1)
         .fontSize(12)
         .text('Your registration has been successfully confirmed for SHACKLES 2025.')
         .moveDown(2);

      // Details box
      doc.rect(50, doc.y, 495, 200)
         .lineWidth(1)
         .strokeColor('#E5E7EB')
         .stroke();

      doc.moveDown(1);

      doc.font('Helvetica-Bold').text('Registration Details:', 70);
      doc.moveDown(0.5);
      doc.font('Helvetica').text(`Registration Number: ${data.registrationNumber}`, 70);
      doc.text(`Event: ${data.eventName}`, 70);
      doc.text(`Amount Paid: ₹${data.amount}`, 70);
      doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 70);

      doc.moveDown(2);
      doc.fontSize(11)
         .fillColor('#6B7280')
         .text('Please download your ticket from the dashboard to get entry to the event.', { align: 'center' });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};
