import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const fetchCoupons = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/couponCode`);
  if (!res.ok) throw new Error('Failed to fetch coupons');
  return res.json();
};

const CouponCarousel = () => {
  const { data: coupons = [], isLoading, isError } = useQuery({
    queryKey: ['coupons'],
    queryFn: fetchCoupons,
  });

  const today = new Date();
  const validCoupons = coupons.filter(
    (coupon) => new Date(coupon.expiryDate) >= today
  );

  if (isLoading) return <p className="text-center">Loading coupons...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load coupons.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">🔥 Active Coupon Offers</h2>

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
          {validCoupons.map((coupon) => (
            <SwiperSlide key={coupon._id}>
              <div className="bg-white shadow-lg rounded-lg p-6 border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-600 mb-2">{coupon.code}</h3>
                <p className="text-gray-700 mb-1"><strong>Discount:</strong> ${coupon.discount}</p>
                <p className="text-gray-500 mb-1"><strong>Expires:</strong> {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                <p className="text-gray-600 text-sm mt-2">{coupon.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-gray-500">No valid coupons available right now.</p>
      )}
    </div>
  );
};

export default CouponCarousel;
