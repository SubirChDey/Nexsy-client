import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import banner1 from '../../../assets/banner1.webp'
import banner2 from '../../../assets/banner2.webp'
import banner3 from '../../../assets/banner3.webp'

const Banner = () => {
  const images = [banner1, banner2, banner3];

  return (
    <div className="hero h-[550px] relative overflow-hidden">
      {/* Background Image Slider */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        loop={true}
        className="absolute w-full h-full object-cover z-0"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`Banner slide ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>

      {/* Content */}
      <div className="hero-content text-white text-center relative z-20">
        <div className="md:w-4/5">
          <p className="text-indigo-200 font-bold text-lg tracking-wide uppercase mt-10">
            Welcome To Nexsy
          </p>
          <h1 className="mb-5 md:mb-8 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Discover and Launch Tech Products
          </h1>
          <p className="mb-5 text-lg md:text-xl text-gray-200">
            Join a community of innovators discovering, sharing, and launching
            the next big thing in tech — from AI tools to mobile apps and beyond.
          </p>
          <Link to="/products" aria-label="View products page">
            <button className="mt-6 px-6 py-3 font-semibold bg-indigo-600 text-white hover:bg-gradient-to-l duration-300 border-none rounded-lg hover:scale-105 transition-transform text-sm md:text-base lg:text-lg shadow-lg">
              View Products
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
