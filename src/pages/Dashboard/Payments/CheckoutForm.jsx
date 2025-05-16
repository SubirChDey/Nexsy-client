// components/CheckoutForm.jsx
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CheckoutForm = ({ email, onSuccess, amount, coupon }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Create payment intent from backend
      const { data: clientSecret } = await axiosSecure.post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
        amount,
        email,
        coupon,
      });

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { email },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess();
        setError("");
        setProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border rounded" />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
