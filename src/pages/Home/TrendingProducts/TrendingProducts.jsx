import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFlag, FaArrowUp } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../../providers/AuthProvider';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

const TrendingProducts = () => {
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  const { data: trendingProducts = [], isLoading, isError } = useQuery({
    queryKey: ['trendingProducts'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/trendingProducts`);
      return res.data;
    },
    enabled: !!user,
  });

  const upvoteMutation = useMutation({
    mutationFn: async (productId) => {
      const res = await axiosPublic.patch(`/products/upvote/${productId}`, {
        email: user.email,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.modifiedCount > 0) {
        if (data.action === "upvoted") {
          toast.success("Thank you! Your upvote has been recorded.");
        } else if (data.action === "unvoted") {
          toast.info("Upvote removed");
        }
        queryClient.invalidateQueries(['trendingProducts']);
      } else {
        toast.info("No changes made");
      }
    },
    onError: () => {
      toast.error("Failed to upvote");
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (productId) => {
      const res = await axiosPublic.post(`/products/report/${productId}`, {
        reporterEmail: user.email,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) toast.success('Product reported successfully');
      else toast.info('You have already reported this product');
    },
    onError: () => toast.error('Failed to report product'),
  });

  const ProductCard = ({ product }) => {
    const {
      _id,
      productName,
      description,
      category,
      productImage,
      upVote = 0,
      votedEmails = [],
    } = product;

    const userHasVoted = votedEmails.includes(user?.email);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <img
          src={productImage}
          alt={productName}
          className="rounded-xl w-full h-48 object-cover mb-4"
        />
        <div className="flex-1">
          <h3
            className="text-lg font-bold mb-2 text-neutral-800 cursor-pointer hover:text-indigo-700 transition"
            onClick={() => navigate(`/product/${_id}`)}
          >
            {productName}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{description}</p>
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-2">
            {category}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => {
              if (!user) {
                navigate("/login");
                return;
              }
              if (product.ownerEmail == user.email) {
                    return toast.error('You can not vote your own product');
                  }
              upvoteMutation.mutate(_id);
            }}
            className={`flex items-center gap-1 transition px-3 py-1 rounded 
              ${userHasVoted
                ? 'text-green-600 hover:text-green-800'
                : 'text-indigo-400 hover:text-indigo-700'
              }`}
            disabled={upvoteMutation.isLoading}
          >
            <FaArrowUp className="text-sm" /> {upVote}
          </button>

          <button
            onClick={() => {
              if (!user) {
                navigate('/login');
                return;
              }
              reportMutation.mutate(_id);
            }}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
          >
            <FaFlag className="text-sm" /> Report
          </button>

          <button
            onClick={() => navigate(`/product/${_id}`)}
            className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            View Details
          </button>
        </div>
      </motion.div>
    );
  };

  if (!user) {
    return <p className="text-center py-10 text-gray-500">Please log in to view trending products.</p>;
  }

  if (isLoading) return <p className="text-center py-10">Loading trending products...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load trending products.</p>;

  return (
    <section className="my-12 px-4 md:px-10">
      <h2 className="text-4xl font-bold mb-4 text-center text-indigo-700">Trending Products</h2>
      <p className="text-center text-gray-600 mb-12 text-sm md:text-base">
        Discover what's hot right now — the most loved and upvoted products on Nexsy.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate('/products')}
          className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Show All Products
        </button>
      </div>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
};

export default TrendingProducts;
