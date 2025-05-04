import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = ({ amount, clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setPaymentStatus("❌ Payment Failed");
      } else {
        setPaymentStatus("✅ Payment Successful!");
        onPaymentSuccess(); // ✅ Calls function to update Firestore & UI
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentStatus("❌ Payment Error");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h2 className="text-lg font-semibold">💳 Enter Payment Details</h2>
      <CardElement className="border p-2 rounded mt-2" />

      <button 
        onClick={handlePayment} 
        disabled={!stripe || loading} 
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
      >
        {loading ? "Processing..." : `Pay Now 💰 $${amount}`}
      </button>

      {paymentStatus && <p className="mt-2 text-center font-semibold">{paymentStatus}</p>}
    </div>
  );
};

export default CheckoutForm;