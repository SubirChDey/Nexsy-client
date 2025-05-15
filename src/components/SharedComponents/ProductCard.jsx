import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaThumbsUp, FaFlag } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const {
    _id,
    productName,
    description,
    category,
    productImage,
    upVote = 0
  } = product;

  const navigate = useNavigate();

  const handleUpvote = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/products/upvote/${_id}`);
      toast.success('Thanks for the upvote!');
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const handleReport = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/products/report/${_id}`);
      toast.success('Product reported!');
    } catch (error) {
      toast.error('Failed to report');
    }
  };

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
          className="text-lg font-bold mb-2 text-neutral-800 cursor-pointer hover:text-blue-600 transition"
          onClick={() => navigate(`/product/${_id}`)}
        >
          {productName}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {description}
        </p>
        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-2">
          {category}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handleUpvote}
          className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
        >
          <FaThumbsUp className="text-sm" /> {upVote}
        </button>

        <button
          onClick={handleReport}
          className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
        >
          <FaFlag className="text-sm" /> Report
        </button>

        <button
          onClick={() => navigate(`/product/${_id}`)}
          className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
