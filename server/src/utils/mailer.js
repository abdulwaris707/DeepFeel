let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  // Nodemailer optional fallback
}

const logger = require('./logger');
const STORE_ADMIN_GMAIL = '2003abdulwaris@gmail.com';

// Configure nodemailer transporter if available
let transporter = null;
if (nodemailer) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || STORE_ADMIN_GMAIL,
      pass: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD || ''
    }
  });
}


/**
 * Generate luxury HTML Order Summary Email template
 */
const buildOrderSummaryHTML = (order) => {
  const customerName = order.customer ? order.customer.name : 'Valued Patron';
  const orderId = order.id || 'DF-' + Date.now();
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const items = order.items || [];
  const paymentMethod = order.paymentMethod || 'Cash on Delivery (COD)';
  const address = order.customer ? `${order.customer.address || ''}, ${order.customer.city || ''}` : 'Provided at dispatch';

  const itemsRows = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #E7E2DA;">
        <strong style="color: #18181B; font-size: 14px;">${item.name || item.productId}</strong><br>
        <span style="color: #71717A; font-size: 12px;">Flacon Size: ${item.size || '50ml'} | Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #E7E2DA; text-align: right; font-weight: 600; color: #18181B;">
        Rs. ${(Number(item.price || 0) * (Number(item.quantity) || 1)).toLocaleString()}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FBF9F5; color: #18181B; margin: 0; padding: 20px; }
        .email-card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E7E2DA; border-radius: 8px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .logo { font-size: 24px; font-weight: 700; letter-spacing: 4px; text-align: center; margin-bottom: 24px; color: #18181B; }
        .logo span { color: #8C6D53; }
        .header-title { font-size: 20px; font-weight: 600; text-align: center; margin-bottom: 8px; }
        .subtitle { font-size: 14px; color: #71717A; text-align: center; margin-bottom: 28px; }
        .order-meta { background: #F8FAFC; border-radius: 6px; padding: 16px; margin-bottom: 24px; font-size: 13px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .total-row { font-size: 16px; font-weight: 700; color: #8C6D53; }
        .footer { font-size: 12px; color: #A1A1AA; text-align: center; margin-top: 32px; border-top: 1px solid #E7E2DA; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="email-card">
        <div class="logo">DEEP<span>FEEL</span></div>
        <div class="header-title">Thank You For Your Order</div>
        <div class="subtitle">Dear ${customerName}, your fragrance chronicle has been recorded.</div>

        <div class="order-meta">
          <div><strong>Order Reference:</strong> ${orderId}</div>
          <div><strong>Order Date:</strong> ${orderDate}</div>
          <div><strong>Payment Method:</strong> ${paymentMethod}</div>
          <div><strong>Shipping Address:</strong> ${address}</div>
        </div>

        <table class="table">
          <thead>
            <tr style="border-bottom: 2px solid #18181B; text-align: left; font-size: 12px; text-transform: uppercase;">
              <th style="padding-bottom: 8px;">Flacon</th>
              <th style="padding-bottom: 8px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div style="border-top: 1px solid #18181B; padding-top: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px;">
            <span>Subtotal:</span>
            <span>Rs. ${(Number(order.subtotal) || Number(order.total) || 0).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px;">
            <span>Shipping:</span>
            <span>${order.shipping === 0 ? 'Complimentary' : 'Rs. ' + (Number(order.shipping) || 0).toLocaleString()}</span>
          </div>
          ${order.discount ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; color: #16A34A;">
              <span>Voucher Discount:</span>
              <span>- Rs. ${Number(order.discount).toLocaleString()}</span>
            </div>
          ` : ''}
          <div class="total-row" style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 18px;">
            <span>Grand Total:</span>
            <span>Rs. ${(Number(order.total) || 0).toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          DeepFeel Haute Parfumerie Atelier • Dispatch Contact: ${STORE_ADMIN_GMAIL}<br>
          This is an official transactional receipt for your order.
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Dispatch Order Summary Email to Client
 */
const sendOrderSummaryEmail = async (order) => {
  const recipientEmail = order.customer ? order.customer.email : null;
  if (!recipientEmail) {
    logger.warn('Order summary email skipped: recipient client email missing');
    return { success: false, reason: 'Client email missing' };
  }

  const mailOptions = {
    from: `"DeepFeel Haute Parfumerie" <${STORE_ADMIN_GMAIL}>`,
    to: recipientEmail,
    replyTo: STORE_ADMIN_GMAIL,
    subject: `Order Confirmation — ${order.id} | DeepFeel`,
    html: buildOrderSummaryHTML(order)
  };

  try {
    if (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD) {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Order summary email dispatched to ${recipientEmail} from ${STORE_ADMIN_GMAIL}`, { messageId: info.messageId });
      return { success: true, messageId: info.messageId };
    } else {
      logger.info(`[Email Dispatch Simulated] Sent Order ${order.id} summary to ${recipientEmail} from ${STORE_ADMIN_GMAIL}`);
      return { success: true, simulated: true, recipient: recipientEmail, sender: STORE_ADMIN_GMAIL };
    }
  } catch (err) {
    logger.error(`Failed to send order summary email to ${recipientEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  STORE_ADMIN_GMAIL,
  sendOrderSummaryEmail,
  buildOrderSummaryHTML
};
