import { NextResponse } from 'next/server';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

export async function POST(request: Request) {
  try {
    const { to, customerName, orderDetails, emailType } = await request.json();
    let templateId = emailType === 'reservation' 
      ? process.env.EMAILJS_RESERVATION_TEMPLATE_ID! 
      : process.env.EMAILJS_RESERVATION_TEMPLATE_ID!;

    const orderSummary = orderDetails.items.map((item: any) => {
      const variantText = item.variant ? ` (${item.variant})` : '';
      return `${item.quantity}x ${item.name}${variantText} - ₦${(item.price * item.quantity).toLocaleString()}`;
    }).join('\n');

    // --- NEW: Retry Logic ---
    let response;
    let retries = 3; // We will try a maximum of 3 times before giving up

    for (let i = 0; i < retries; i++) {
      try {
        response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: templateId,
            user_id: process.env.EMAILJS_PUBLIC_KEY,     
            accessToken: process.env.EMAILJS_PRIVATE_KEY, 
            template_params: {
              to_email: to,
              customer_name: customerName,
              reservation_code: orderDetails.reservation_code || 'N/A',
              tracking_code: orderDetails.tracking_code || 'N/A',
              total_amount: orderDetails.total_amount.toLocaleString(),
              delivery_method: orderDetails.delivery_method.toUpperCase(),
              order_summary: orderSummary, 
            }
          })
        });
        
        // If it succeeds, break out of the loop immediately!
        break; 

      } catch (err: any) {
        console.warn(`EmailJS fetch failed on attempt ${i + 1}. Retrying...`);
        // If we are on the last attempt and it STILL fails, throw the error
        if (i === retries - 1) throw err;
        
        // Otherwise, wait 1 second before looping again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Check if the final response we got back was successful
    if (!response || !response.ok) {
      const errorText = await response?.text() || "Unknown network error";
      throw new Error(`EmailJS API error: ${errorText}`);
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error('Email sending failed completely:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}