import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      auctionId, 
      winnerEmail: clientEmail,
      winnerName: clientName,
      winnerUserId,
      finalAmount
    } = body;
    
    if (!auctionId) {
      return NextResponse.json({ error: 'Missing auctionId' }, { status: 400 });
    }

    console.log('Settlement triggered for auction:', auctionId);
    console.log('Winner from client:', { clientEmail, clientName, finalAmount });

    // 1. Fetch auction + farmer details (simple query, no joins needed)
    const { data: auction } = await supabaseServer
      .from('auctions')
      .select('*, farmer:profiles!auctions_farmer_id_fkey(id, full_name)')
      .eq('id', auctionId)
      .single();

    const farmerName = (auction?.farmer as any)?.full_name || 'Verified Producer';
    const auctionTitle = auction?.title || 'Agricultural Asset';

    // 2. Resolve winner details - prefer client-sent data, fallback to DB
    let winnerEmail = clientEmail || '';
    let winnerName = clientName || 'Partner';
    let bidAmount = finalAmount;

    // If client didn't send email (edge case: timer ran out, not winning bidder's browser),
    // try the RPC function as a fallback
    if (!winnerEmail && winnerUserId) {
      const { data: emailFromRpc } = await supabaseServer
        .rpc('get_user_email', { user_id: winnerUserId });
      winnerEmail = (emailFromRpc as string) || '';
    }

    // If still no bid amount, fetch from DB
    if (!bidAmount) {
      const { data: topBid } = await supabaseServer
        .from('auction_bids')
        .select('amount, user_id')
        .eq('auction_id', auctionId)
        .order('amount', { ascending: false })
        .limit(1)
        .single();
      bidAmount = topBid?.amount;
      
      // If we still have no email and got a user_id from DB
      if (!winnerEmail && topBid?.user_id) {
        const { data: emailFromRpc } = await supabaseServer
          .rpc('get_user_email', { user_id: topBid.user_id });
        winnerEmail = (emailFromRpc as string) || '';
      }
    }

    console.log('Resolved winner email:', winnerEmail);

    // 3. Generate QR code - Use local IP so phone scans work on same WiFi
    let prodUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    if (prodUrl.includes('localhost')) {
      prodUrl = 'http://172.16.5.55:3000'; 
    }
    const trackingUrl = `${prodUrl}/track?crop_id=${auctionId}`;

    const qrBuffer = await QRCode.toBuffer(trackingUrl, {
      color: { dark: '#065f46', light: '#ffffff' },
      margin: 3,
      width: 300
    });
    const qrDataUrl = await QRCode.toDataURL(trackingUrl, { margin: 3, width: 300 });

    // 4. Save winner + QR to auction record
    await supabaseServer
      .from('auctions')
      .update({ 
        winner_id: winnerUserId || null,
        qr_code: qrDataUrl 
      })
      .eq('id', auctionId);

    // 5. Send email — use winner email, fallback to admin email
    const toEmail = winnerEmail || process.env.ADMIN_EMAIL || process.env.EMAIL_USER!;
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER or EMAIL_PASS not set — skipping email');
      return NextResponse.json({ success: true, trackingUrl, warning: 'Email not configured' });
    }

    const cleanPass = process.env.EMAIL_PASS.replace(/"/g, '').replace(/\s/g, '');
    
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: cleanPass },
    });

    // Verify SMTP connection first
    await transporter.verify();
    console.log('SMTP connection verified ✅');

    await transporter.sendMail({
      from: `"GreenLedger Exchange" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `✅ You won the auction: ${auctionTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #065f46, #10b981); padding: 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; color: #fff;">🌿 Auction Won!</h1>
            <p style="margin: 8px 0 0; opacity: 0.8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">GreenLedger Exchange Protocol</p>
          </div>
          <div style="padding: 40px;">
            <p style="font-size: 16px; margin-top: 0;">Hello <strong>${winnerName}</strong>,</p>
            <p style="color: #aaa; line-height: 1.6; margin-bottom: 24px;">
              Congratulations! Your bid was the highest. You have successfully acquired:
            </p>
            <div style="background: #111; border-left: 4px solid #10b981; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #222;">
                  <td style="padding: 10px 0; color: #555; font-size: 11px; font-weight: 700; text-transform: uppercase; width: 40%;">Asset</td>
                  <td style="padding: 10px 0; color: #fff; font-weight: 700; font-size: 15px;">${auctionTitle}</td>
                </tr>
                <tr style="border-bottom: 1px solid #222;">
                  <td style="padding: 10px 0; color: #555; font-size: 11px; font-weight: 700; text-transform: uppercase;">Final Bid</td>
                  <td style="padding: 10px 0; color: #10b981; font-weight: 900; font-size: 20px;">₹${(bidAmount || 0).toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #222;">
                  <td style="padding: 10px 0; color: #555; font-size: 11px; font-weight: 700; text-transform: uppercase;">Source Farmer</td>
                  <td style="padding: 10px 0; color: #fff; font-weight: 700;">${farmerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555; font-size: 11px; font-weight: 700; text-transform: uppercase;">Asset ID</td>
                  <td style="padding: 10px 0; color: #444; font-family: monospace;">${auctionId.slice(0,8).toUpperCase()}</td>
                </tr>
              </table>
            </div>
            <div style="text-align: center; margin: 32px 0; background: #0d1117; border: 1px solid #1a2a1a; border-radius: 12px; padding: 32px;">
              <h2 style="color: #10b981; font-size: 13px; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 12px;">📦 Consumer Traceability QR</h2>
              <p style="color: #666; font-size: 12px; margin: 0 0 24px; line-height: 1.6;">
                Print this QR and attach it to the crop packaging. Customers scan it to see the farmer's verified profile and can tip them directly via UPI — free of charge.
              </p>
              <img src="cid:traceability_qr" alt="Crop Traceability QR" 
                   style="width: 200px; height: 200px; border: 8px solid white; border-radius: 12px; display: block; margin: 0 auto;" />
              <p style="margin: 16px 0 0; font-size: 10px; color: #444;">${trackingUrl}</p>
            </div>
            <div style="background: #0d2b1e; border: 1px solid #10b981; border-radius: 8px; padding: 16px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #10b981; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                ♻ Crop tips go directly to farmer ${farmerName} via UPI
              </p>
            </div>
          </div>
          <div style="padding: 20px 40px; border-top: 1px solid #1a1a1a; text-align: center;">
            <p style="font-size: 10px; color: #333; margin: 0; text-transform: uppercase;">Auto-generated settlement receipt • GreenLedger Network</p>
          </div>
        </div>
      `,
      attachments: [{
        filename: `crop-qr-${auctionId.slice(0,8)}.png`,
        content: qrBuffer,
        cid: 'traceability_qr',
        contentType: 'image/png'
      }]
    });

    console.log(`✅ Email dispatched → ${toEmail}`);
    return NextResponse.json({ success: true, trackingUrl, sentTo: toEmail });

  } catch (error: any) {
    console.error('Settlement Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
