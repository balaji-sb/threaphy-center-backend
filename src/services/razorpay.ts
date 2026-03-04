import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "dummy_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

/**
 * Creates a new Razorpay order
 * @param amount Amount in smallest currency unit (e.g., paise for INR)
 * @param currency Currency code (e.g., INR)
 */
export const createOrder = async (amount: number, currency: string = "INR") => {
  const options = {
    amount,
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error("Failed to create Razorpay Order");
  }
};

/**
 * Verifies Razorpay signature
 */
export const verifySignature = (
  orderId: string,
  paymentId: string,
  signature: string,
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};
