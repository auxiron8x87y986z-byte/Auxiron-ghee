import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { items, totalAmount, customerInfo, paymentMethod } = data;

    // 1. Fetch enabled gateway config
    const gateway = await prisma.paymentGateway.findUnique({
      where: { name: paymentMethod }
    });

    if (!gateway || !gateway.enabled) {
      return NextResponse.json({ error: "Payment method not available" }, { status: 400 });
    }

    // 2. Create Order in Database (PENDING)
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
    const session = await getServerSession(authOptions);
    const userId = session?.user ? parseInt((session.user as any).id) : null;

    const order = await prisma.order.create({
      data: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        address: customerInfo.address,
        city: customerInfo.city,
        totalAmount,
        paymentMethod,
        paymentStatus: "PENDING",
        items: JSON.stringify(items),
        userId: userId && userId > 0 ? userId : null,
      }
    });

    // 3. Initialize Gateway Specific Flow
    const isLive = gateway.mode === "live";
    const apiKey = isLive ? gateway.liveApiKey : gateway.testApiKey;
    const secretKey = isLive ? gateway.liveSecret : gateway.testSecret;

    if (!apiKey || !secretKey) {
      return NextResponse.json({ error: "Payment gateway is not configured properly" }, { status: 500 });
    }

    if (paymentMethod === "Razorpay") {
      const razorpay = new Razorpay({ key_id: apiKey, key_secret: secretKey });
      const options = {
        amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_order_${order.id}`
      };
      const rzpOrder = await razorpay.orders.create(options);
      
      // Save Razorpay order ID to our order's transactionId
      await prisma.order.update({
        where: { id: order.id },
        data: { transactionId: rzpOrder.id }
      });

      return NextResponse.json({ 
        orderId: order.id,
        gatewayOrderId: rzpOrder.id,
        keyId: apiKey,
        amount: options.amount
      });

    } else if (paymentMethod === "Stripe") {
      const stripe = new Stripe(secretKey, { apiVersion: "2023-10-16" as any });
      
      // Calculate origin for redirect URLs
      const origin = request.headers.get("origin") || process.env.NEXTAUTH_URL || "https://auxiron.com";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.volume + " Bilona Ghee",
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${origin}/checkout/success?order_id=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout?canceled=true`,
        metadata: {
          orderId: order.id.toString()
        }
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { transactionId: session.id }
      });

      return NextResponse.json({ 
        orderId: order.id,
        sessionId: session.id,
        url: session.url 
      });
    }

    return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });

  } catch (error: any) {
    console.error("Order Creation Error:", error);
    const errorMessage = error?.error?.description || error.message || "Failed to create order";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
