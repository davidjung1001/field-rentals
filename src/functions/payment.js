const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.secret_key);

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Error creating payment intent:", error);
    res.status(500).send(error.message);
  }
});