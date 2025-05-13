import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="hero min-h-screen relative">
      {/* Background Video */}
      <video
        className="absolute w-full h-full object-cover"
        src="/banner.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-label="Banner video showcasing tech visuals"
      ></video>

      {/* Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>

      {/* Content */}
      <div className="hero-content text-white text-center relative z-20">
        <div className="md:w-4/5">
          <p className="text-[#FF3600] font-bold text-lg tracking-wide uppercase">
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
            <button className="mt-6 px-6 py-3 font-semibold bg-gradient-to-r from-[#FF3600] to-[#FF6A00] text-white hover:bg-gradient-to-l duration-300 border-none rounded-lg hover:scale-105 transition-transform text-sm md:text-base lg:text-lg shadow-lg">
              View Products
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
