import { useState } from "react";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaArrowLeft } from "react-icons/fa"; 

const CheckoutForm = ({ amount, goBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage("");

    // Get Card Details
    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);

    if (!cardNumber || !cardExpiry || !cardCvc) {
      setErrorMessage("Card details are missing.");
      setLoading(false);
      return;
    }

    try {
      // Call Backend to Create Payment Intent
      const response = await fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await response.json();
      if (!clientSecret) {
        setErrorMessage("Unable to process payment.");
        setLoading(false);
        return;
      }

      // Confirm Payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardNumber },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        setPaymentSuccess(true);
      }
    } catch (error) {
      setErrorMessage("Payment failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md w-full">
      {/* Back Button */}
      <button onClick={goBack} className="flex items-center text-gray-600 hover:text-gray-800 mb-3">
        <FaArrowLeft className="mr-2" /> Adjust Booking
      </button>

      <h2 className="text-xl font-bold text-gray-800">💳 Secure Payment</h2>
      {paymentSuccess ? (
        <div className="text-center text-green-600 mt-4">
          ✅ Payment Successful! Your booking is confirmed.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Card Number (Full Width) */}
          <div className="border p-3 rounded-md">
            <CardNumberElement className="p-3 text-lg" />
          </div>

          {/* Expiration + CVC (Two Columns) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-3 rounded-md">
              <CardExpiryElement className="p-3 text-lg" />
            </div>
            <div className="border p-3 rounded-md">
              <CardCvcElement className="p-3 text-lg" />
            </div>
          </div>

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition mt-4"
          >
            {loading ? "Processing..." : `Pay $${amount}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;