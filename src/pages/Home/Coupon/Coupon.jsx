import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const fetchCoupons = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/couponCode`);
  if (!res.ok) throw new Error("Failed to fetch coupons");
  return res.json();
};

const bgColors = [
  "bg-slate-800",
  "bg-indigo-900",
  "bg-teal-800",
  "bg-gray-700",
  "bg-purple-800",
  "bg-blue-900",
  "bg-amber-700",
];

const textColors = [
  "text-gray-100",
  "text-gray-100",
  "text-gray-100",
  "text-gray-100",
  "text-gray-100",
  "text-gray-100",
  "text-gray-900",
];

const CopyIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v2m4 4v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-2"
    />
  </svg>
);

const Coupon = () => {
  const { data: coupons = [], isLoading, isError } = useQuery({
    queryKey: ["coupons"],
    queryFn: fetchCoupons,
  });

  const [copiedCode, setCopiedCode] = useState(null);

  const today = new Date();
  const validCoupons = coupons.filter(
    (coupon) => new Date(coupon.expiryDate) >= today
  );

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  if (isLoading)
    return <p className="text-center">Loading coupons...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500">
        Failed to load coupons.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
         Active Coupon Offers
      </h2>

      {validCoupons.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {validCoupons.map((coupon, idx) => {
            const bgColor = bgColors[idx % bgColors.length];
            const textColor = textColors[idx % textColors.length];
            const isCopied = copiedCode === coupon.code;

            return (
              <SwiperSlide key={coupon._id}>
                <div
                  className={`${bgColor} ${textColor} shadow-lg rounded-lg p-6 border border-gray-600 transition hover:scale-[1.02] duration-300`}
                >
                  <div
                    className="flex items-center space-x-2 mb-2 cursor-pointer select-all text-cyan-400 hover:text-cyan-300"
                    onClick={() => handleCopy(coupon.code)}
                    title="Click to copy coupon code"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCopy(coupon.code);
                      }
                    }}
                  >
                    <h3 className="text-xl font-bold">{coupon.code}</h3>
                    <CopyIcon className="w-5 h-5" />
                  </div>
                  {isCopied && (
                    <p className="text-green-400 text-sm mb-2">Copied!</p>
                  )}
                  <p className="mb-1">
                    <strong>Discount:</strong> ${coupon.discount}
                  </p>
                  <p className="mb-1 opacity-90">
                    <strong>Expires:</strong>{" "}
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2 opacity-90">{coupon.description}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <p className="text-center text-gray-500">
          No valid coupons available right now.
        </p>
      )}
    </div>
  );
};

export default Coupon;
