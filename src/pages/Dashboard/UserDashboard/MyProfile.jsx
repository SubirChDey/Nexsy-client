import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../providers/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../Payments/CheckoutForm";
import Swal from "sweetalert2";

const MyProfile = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [finalAmount, setFinalAmount] = useState(199);

  const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

  const {
    data: profile = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/profile?email=${user.email}`);
      return res.data;
    },
  });

  const handleSubscribeClick = () => {
    setShowPaymentModal(true);
    setCoupon("");
    setDiscount(0);
    setFinalAmount(199);
    setCouponError("");
  };

  const validateCoupon = async () => {
    if (!coupon) return;
    try {
      const res = await axiosSecure.get(`/coupons/validate?code=${coupon}`);
      const data = res.data;
      if (!data?.valid) {
        setCouponError("Invalid or expired coupon code.");
        setDiscount(0);
        setFinalAmount(199);
      } else {
        setCouponError("");
        setDiscount(data.discount);
        setFinalAmount(Math.max(0, 199 - data.discount));
      }
    } catch (error) {
      setCouponError("Error validating coupon.");
      setDiscount(0);
      setFinalAmount(199);
    }
  };

  const handlePaymentSuccess = async () => {
    await axiosSecure.patch(`/user/subscribe?email=${user.email}`);
    setShowPaymentModal(false);
    refetch();
    Swal.fire({
      icon: "success",
      title: "Subscription Successful!",
      text: "Thank you for subscribing. Your profile is now verified.",
      confirmButtonColor: "#4f46e5", // indigo-600
    });
  };

  if (loading || isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="w-11/12 md:w-9/12 mx-auto mt-10 px-6 py-10 bg-gradient-to-b from-white to-indigo-50 rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-700">My Profile</h1>

      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={profile?.photo}
            alt={profile?.name}
            className="w-72 h-72 object-cover rounded-xl border-4 border-indigo-400 shadow-md"
          />
        </div>

        <div className="hidden md:block h-72 w-px bg-gray-300"></div>

        <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">{profile.name}</h2>
          <p className="text-gray-600 text-lg">{profile.email}</p>
          <p className="text-lg">
            Status:{" "}
            <span
              className={`font-semibold ${
                profile.isSubscribed ? "text-green-600" : "text-red-500"
              }`}
            >
              {profile.isSubscribed ? "Verified" : "Not Verified"}
            </span>
          </p>

          <button
            onClick={handleSubscribeClick}
            className={`mt-4 inline-block ${
              profile.isSubscribed
                ? "bg-green-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-medium px-6 py-2 rounded-lg transition`}
            disabled={profile.isSubscribed}
          >
            {profile.isSubscribed ? "Subscribed" : "Subscribe - $199"}
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-11/12 max-w-md relative animate-fadeIn">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-indigo-700">Complete Your Subscription</h3>
            <p className="mb-4 text-gray-700">
              Pay <strong>${finalAmount}</strong> to get verified access.
            </p>

            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Enter Coupon Code (optional)"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-indigo-300 disabled:bg-gray-100"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                disabled={discount > 0}
              />
              {discount > 0 && (
                <button
                  onClick={() => {
                    setCoupon("");
                    setDiscount(0);
                    setFinalAmount(199);
                    setCouponError("");
                  }}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-red-500 hover:text-red-700 text-xl"
                  title="Remove coupon"
                >
                  &times;
                </button>
              )}

              <button
                onClick={validateCoupon}
                disabled={discount > 0}
                className={`mt-2 w-full ${
                  discount > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                } text-white py-2 rounded transition`}
              >
                Apply Coupon
              </button>

              {couponError && <p className="text-red-500 mt-2">{couponError}</p>}
              {discount > 0 && (
                <p className="text-green-600 mt-2">Coupon applied! You saved ${discount}.</p>
              )}
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                email={user.email}
                amount={finalAmount}
                coupon={coupon}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
