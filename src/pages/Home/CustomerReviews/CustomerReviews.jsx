import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const reviews = [
  {
    id: 1,
    name: "Francis Major",
    role: "UI Designer",
    image: "https://i.ibb.co/Pvhtmwh3/photo-1522529599102-193c0d76b5b6.jpg",
    feedback:
      "Nexsy helped me discover amazing products. The user interface is top-notch! I love how easy it is to browse and upvote new launches. It’s beautifully designed, intuitive to use, and makes product discovery a joy every single time. Highly recommended for creatives like me!",
  },
  {
    id: 2,
    name: "Sandra Caron",
    role: "Startup Founder",
    image: "https://i.ibb.co/cKq2Qfs4/fizkes201102042.jpg",
    feedback:
      "The upvote system and review features make Nexsy super engaging! It’s the perfect platform to gain traction before launch. Within a week of listing, I got dozens of new users. The visibility, feedback, and traffic are exactly what my startup needed.",
  },
  {
    id: 3,
    name: "Darnell Pena",
    role: "Product Marketer",
    image: "https://i.ibb.co/5gKPQW72/photo-1614023342667-6f060e9d1e04.jpg",
    feedback:
      "A great place to showcase my product and reach new customers. Highly recommended! Nexsy has become an essential part of my product marketing strategy. The exposure I received here helped us grow much faster than expected. Thank you Nexsy!",
  },
  {
    id: 4,
    name: "Jeffery James",
    role: "Software Engineer",
    image: "https://i.ibb.co/d4YCNXJz/istockphoto-1448167415-612x612.jpg",
    feedback:
      "Smooth experience! Loved the reporting and feedback system on Nexsy. It's efficient, reliable, and well-structured. I especially liked how users can engage directly with new tools and leave meaningful reviews. It creates a great developer-user feedback loop.",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "Creative Director",
    image: "https://i.ibb.co/5Xwvqtbs/istockphoto-1310814041-612x612.jpg",
    feedback:
      "Design-wise, Nexsy feels fresh and modern. It’s clearly built with both creators and users in mind. The aesthetics are just right! From fonts to layouts, every detail contributes to a seamless browsing experience. Love using it!",
  },
  {
    id: 6,
    name: "Michael Cash",
    role: "Tech Blogger",
    image: "https://i.ibb.co/tw2nq8bB/images.jpg",
    feedback:
      "I regularly review startups, and Nexsy makes it easier than ever to find unique and promising projects to write about. It’s like having a curated discovery engine built specifically for tech enthusiasts. It’s now part of my weekly routine.",
  },
];

const CustomerReviews = () => {
  return (
    <section className="bg-gradient-to-br from-white to-gray-100 py-20 px-4 md:px-20">
      <h2 className="text-4xl font-bold text-center text-indigo-600 mb-4">
        What Our Customers Say
      </h2>
      <p className='text-gray-600 text-center mb-12'>Real Stories. Honest Voices. Trusted Reviews that Reflect the Nexsy Experience.</p>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <div className="w-[300px] md:w-[320px] lg:w-[340px] h-[340px] mx-auto bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-3xl p-6 transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between">
              <p className="text-gray-700 text-[16px] leading-relaxed mb-6">
                “{review.feedback}”
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border-2 border-indigo-400"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {review.name}
                  </h4>
                  <p className="text-sm text-indigo-500">{review.role}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CustomerReviews;
