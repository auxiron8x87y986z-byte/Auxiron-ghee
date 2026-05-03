import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { paymentMethod, orderId, ...paymentDetails } = data;

    const gateway = await prisma.paymentGateway.findUnique({
      where: { name: paymentMethod }
    });

    if (!gateway) return NextResponse.json({ error: "Gateway not found" }, { status: 404 });

    const isLive = gateway.mode === "live";
    const secretKey = isLive ? gateway.liveSecret : gateway.testSecret;

    if (!secretKey) return NextResponse.json({ error: "Secret key missing" }, { status: 500 });

    const order = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (paymentMethod === "Razorpay") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
      
      const text = razorpay_order_id + "|" + razorpay_payment_id;
      const generated_signature = crypto
        .createHmac("sha256", secretKey)
        .update(text)
        .digest("hex");

      if (generated_signature === razorpay_signature) {
        // Payment successful
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "PAID" }
        });
        return NextResponse.json({ success: true });
      } else {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "FAILED" }
        });
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }

    } else if (paymentMethod === "Stripe") {
      const { sessionId } = paymentDetails;
      const stripe = new Stripe(secretKey, { apiVersion: "2023-10-16" as any });
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === "paid") {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "PAID" }
        });
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
      }
    }

    return NextResponse.json({ error: "Unsupported gateway" }, { status: 400 });

  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
