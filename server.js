const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json()); // important to parse JSON bodies

const razorpay = new Razorpay({
  key_id: "rzp_live_OvYwjtLykLZwNR",
  key_secret: "Des4fKHuJO0FBaiKdS0AJS7Z",
});

// Create Order Endpoint
app.post("/createOrder", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Payment Endpoint
app.post("/verifyPayment", (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const generatedSignature = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  res.json({ valid: generatedSignature === signature });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
