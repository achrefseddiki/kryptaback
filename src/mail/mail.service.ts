import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { OrderLineItem } from '../orders/entities/order.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly apiKey: string | undefined;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('RESEND_API_KEY');
    this.from = this.config.get<string>('MAIL_FROM') ?? 'Krypta <noreply@krypta.tn>';
  }

  private get resend(): Resend | null {
    if (!this.apiKey || this.apiKey === 'your_resend_api_key_here') return null;
    return new Resend(this.apiKey);
  }

  async sendWelcome(email: string, firstName: string) {
    const client = this.resend;
    if (!client) { this.logger.warn('RESEND_API_KEY not configured — skipping welcome email'); return; }
    try {
      await client.emails.send({
        from: this.from,
        to: email,
        subject: `Welcome to Krypta, ${firstName}!`,
        html: welcomeHtml(firstName),
      });
    } catch (err) {
      this.logger.error(`Failed to send welcome email to ${email}`, err);
    }
  }

  async sendOrderConfirmation(email: string, order: {
    id: string;
    firstName: string;
    lastName: string;
    items: OrderLineItem[];
    subtotal: number;
    total: number;
    address: string;
    city: string;
    governorate: string;
    phone: string;
    createdAt: Date;
  }) {
    const client = this.resend;
    if (!client) { this.logger.warn('RESEND_API_KEY not configured — skipping order confirmation email'); return; }
    try {
      await client.emails.send({
        from: this.from,
        to: email,
        subject: `Order Confirmed – #${order.id.slice(0, 8).toUpperCase()}`,
        html: orderConfirmationHtml(order),
      });
    } catch (err) {
      this.logger.error(`Failed to send order confirmation to ${email}`, err);
    }
  }
}

// ─── Templates ────────────────────────────────────────────────────────────────

function base(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #e0e0e0; }
    a { color: #00f5ff; text-decoration: none; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a; padding: 40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Header -->
        <tr><td style="background: linear-gradient(135deg,#0d1925,#0a0a0a); border-radius:16px 16px 0 0; padding:32px 40px; border-bottom:1px solid rgba(0,245,255,0.2);">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="font-size:24px; font-weight:800; letter-spacing:-0.5px; color:#ffffff;">KRYPTA</span>
              </td>
              <td align="right">
                <span style="font-size:11px; color:#00f5ff; font-weight:600; letter-spacing:2px; text-transform:uppercase;">Gaming Store</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#111111; padding:40px; border-radius: 0 0 16px 16px; border:1px solid rgba(255,255,255,0.07); border-top:none;">
          ${content}

          <!-- Footer -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:40px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.08);">
            <tr>
              <td align="center">
                <p style="font-size:12px; color:#555; line-height:1.6;">
                  Krypta — Tunisia's #1 Gaming PC Store<br/>
                  Questions? <a href="mailto:support@krypta.tn">support@krypta.tn</a>
                </p>
              </td>
            </tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function welcomeHtml(firstName: string) {
  return base(`
    <!-- Welcome banner -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td style="background:linear-gradient(135deg,rgba(0,245,255,0.08),rgba(30,58,255,0.08)); border:1px solid rgba(0,245,255,0.2); border-radius:12px; padding:32px; text-align:center;">
        <p style="font-size:36px; margin-bottom:8px;">🎮</p>
        <h1 style="font-size:26px; font-weight:800; color:#ffffff; margin-bottom:8px;">Welcome, ${firstName}!</h1>
        <p style="font-size:15px; color:#a0a0a0; line-height:1.6;">Your Krypta account is ready. Time to build your dream setup.</p>
      </td></tr>
    </table>

    <!-- What you can do -->
    <p style="font-size:13px; color:#777; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:16px;">What's waiting for you</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      ${[
        { icon: '🖥️', title: 'Browse Gaming PCs', desc: 'Pre-built machines ready to ship across Tunisia.', href: 'http://localhost:3000/products' },
        { icon: '⚙️', title: 'Build Your PC', desc: 'Configure your dream build with our PC builder.', href: 'http://localhost:3000/builder' },
        { icon: '⚡', title: 'Krypta Drops', desc: 'Limited-edition hardware drops — first come first served.', href: 'http://localhost:3000/drops' },
      ].map(({ icon, title, desc, href }) => `
        <tr><td style="padding-bottom:12px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a; border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:16px;">
            <tr>
              <td style="width:36px; font-size:20px; vertical-align:middle;">${icon}</td>
              <td style="padding-left:12px; vertical-align:middle;">
                <p style="font-size:14px; font-weight:600; color:#ffffff; margin-bottom:2px;">${title}</p>
                <p style="font-size:12px; color:#777;">${desc}</p>
              </td>
              <td align="right" style="vertical-align:middle;">
                <a href="${href}" style="font-size:12px; color:#00f5ff; white-space:nowrap;">Visit →</a>
              </td>
            </tr>
          </table>
        </td></tr>
      `).join('')}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="http://localhost:3000/products" style="display:inline-block; background:linear-gradient(90deg,#00f5ff,#1e3aff); color:#0a0a0a; font-size:15px; font-weight:700; padding:14px 36px; border-radius:12px; text-decoration:none;">
          Shop Now
        </a>
      </td></tr>
    </table>
  `);
}

function orderConfirmationHtml(order: {
  id: string;
  firstName: string;
  lastName: string;
  items: OrderLineItem[];
  subtotal: number;
  total: number;
  address: string;
  city: string;
  governorate: string;
  phone: string;
  createdAt: Date;
}) {
  const shortId = order.id.slice(0, 8).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const itemRows = order.items.map(item => `
    <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
      <td style="padding:12px 0;">
        <p style="font-size:14px; color:#ffffff; margin-bottom:2px;">${item.name}</p>
        <p style="font-size:12px; color:#666;">Qty: ${item.qty}</p>
      </td>
      <td align="right" style="padding:12px 0; font-size:14px; color:#ffffff; font-weight:600; white-space:nowrap;">
        ${(item.price * item.qty).toLocaleString()} DT
      </td>
    </tr>
  `).join('');

  return base(`
    <!-- Confirmed banner -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td style="background:linear-gradient(135deg,rgba(0,245,255,0.08),rgba(30,58,255,0.08)); border:1px solid rgba(0,245,255,0.2); border-radius:12px; padding:28px; text-align:center;">
        <div style="width:48px; height:48px; background:linear-gradient(90deg,#00f5ff,#1e3aff); border-radius:50%; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; font-size:22px; line-height:48px; color:#0a0a0a; font-weight:900;">✓</div>
        <h1 style="font-size:22px; font-weight:800; color:#ffffff; margin-bottom:6px;">Order Confirmed!</h1>
        <p style="font-size:13px; color:#a0a0a0;">Thank you, ${order.firstName}. We've received your order.</p>
        <p style="font-size:13px; color:#00f5ff; font-weight:700; margin-top:8px;">Order #${shortId} · ${date}</p>
      </td></tr>
    </table>

    <!-- Items -->
    <p style="font-size:13px; color:#777; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:16px;">Order Summary</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a; border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:0 20px; margin-bottom:8px;">
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${itemRows}
          <tr>
            <td style="padding:14px 0 4px; font-size:13px; color:#777;">Shipping</td>
            <td align="right" style="padding:14px 0 4px; font-size:13px; color:#00f5ff; font-weight:600;">Free</td>
          </tr>
          <tr>
            <td style="padding:8px 0 16px; font-size:15px; color:#ffffff; font-weight:700; border-top:1px solid rgba(255,255,255,0.08);">Total</td>
            <td align="right" style="padding:8px 0 16px; font-size:18px; color:#ffffff; font-weight:800; border-top:1px solid rgba(255,255,255,0.08);">${order.total.toLocaleString()} DT</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- Delivery details -->
    <p style="font-size:13px; color:#777; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; margin:24px 0 16px;">Delivery Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a; border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:20px; margin-bottom:32px;">
      <tr>
        <td style="font-size:13px; color:#777; padding-bottom:8px; width:100px;">Name</td>
        <td style="font-size:13px; color:#ffffff; padding-bottom:8px;">${order.firstName} ${order.lastName}</td>
      </tr>
      <tr>
        <td style="font-size:13px; color:#777; padding-bottom:8px;">Phone</td>
        <td style="font-size:13px; color:#ffffff; padding-bottom:8px;">${order.phone}</td>
      </tr>
      <tr>
        <td style="font-size:13px; color:#777; padding-bottom:8px;">Address</td>
        <td style="font-size:13px; color:#ffffff; padding-bottom:8px;">${order.address}, ${order.city}, ${order.governorate}</td>
      </tr>
      <tr>
        <td style="font-size:13px; color:#777;">Payment</td>
        <td style="font-size:13px; color:#ffffff;">Cash on Delivery</td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="http://localhost:3000/account/orders" style="display:inline-block; background:linear-gradient(90deg,#00f5ff,#1e3aff); color:#0a0a0a; font-size:14px; font-weight:700; padding:12px 32px; border-radius:12px;">
          Track Your Order
        </a>
      </td></tr>
    </table>
  `);
}
