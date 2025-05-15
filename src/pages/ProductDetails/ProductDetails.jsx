import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaArrowUp, FaFlag } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../../providers/AuthProvider';
import { motion } from 'framer-motion';
import Rating from 'react-rating-stars-component';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [reviewDesc, setReviewDesc] = useState('');
  const [rating, setRating] = useState(0);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${id}`);
      if (!res.ok) throw new Error('Failed to load product');
      return res.json();
    },
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews?productId=${id}`);
      if (!res.ok) throw new Error('Failed to load reviews');
      return res.json();
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/upvote/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.modifiedCount > 0) {
        toast.success('Upvoted!');
        queryClient.invalidateQueries(['product', id]);
      } else {
        toast.info('You have already upvoted this product');
      }
    },
    onError: () => toast.error('Failed to upvote'),
  });

  const reportMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/report/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporterEmail: user.email }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) toast.success('Product reported successfully');
      else toast.info('You have already reported this product');
    },
    onError: () => toast.error('Failed to report product'),
  });

  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.insertedId) {
        toast.success('Review submitted successfully');
        queryClient.invalidateQueries(['reviews', id]);
        setReviewDesc('');
        setRating(0);
      }
    },
    onError: () => toast.error('Failed to submit review'),
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewDesc || rating === 0) {
      toast.error('Please provide a review description and rating');
      return;
    }
    const reviewData = {
      productId: id,
      reviewerName: user?.displayName,
      reviewerImage: user?.photoURL,
      description: reviewDesc,
      rating,
    };
    reviewMutation.mutate(reviewData);
  };

  if (productLoading) return <div className="text-center py-20 text-xl text-indigo-600">Loading Product...</div>;
  if (!product) return <div className="text-center py-20 text-red-600 text-lg">Product not found.</div>;

  return (
    <div className="px-4 md:px-10 py-10 max-w-7xl mx-auto">
      {/* Product Section */}
      <motion.div
        className="bg-white rounded-3xl shadow-xl p-8 mb-14"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-10">
          <img
            src={product.productImage}
            alt={product.productName}
            className="w-full lg:w-1/2 h-72 object-cover rounded-xl border"
          />
          <div className="flex-1 space-y-5">
            <h1 className="text-4xl font-bold text-gray-900">{product.productName}</h1>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                  <span key={i} className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {product.externalLinks?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-800">External Links</h4>
                <ul className="list-disc list-inside text-blue-600 space-y-1">
                  {product.externalLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={() => upvoteMutation.mutate()}
                disabled={user?.email === product.ownerEmail}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition hover:scale-105 ${user?.email === product.ownerEmail
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}
              >
                <FaArrowUp />
                Upvote ({product.upVote || 0})
              </button>

              <button
                onClick={() => reportMutation.mutate()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition hover:scale-105"
              >
                <FaFlag />
                Report
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        className="bg-white rounded-3xl shadow-xl p-8 mb-14"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900">User Reviews</h2>
        {reviewsLoading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow hover:shadow-lg transition">
                <div className="flex items-center gap-3 mb-3">
                  <img src={review.reviewerImage} alt={review.reviewerName} className="w-10 h-10 rounded-full border" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.reviewerName}</h4>
                    <Rating count={5} value={review.rating} size={20} edit={false} activeColor="#ffd700" />
                  </div>
                </div>
                <p className="text-gray-700">{review.description}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Review Form */}
      <motion.div
        className="bg-white rounded-3xl shadow-xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Write a Review</h2>
        <form onSubmit={handleReviewSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input type="text" value={user?.displayName} readOnly className="w-full px-4 py-2 rounded-lg bg-gray-100 border" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Photo URL</label>
            <input type="text" value={user?.photoURL} readOnly className="w-full px-4 py-2 rounded-lg bg-gray-100 border" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Review</label>
            <textarea
              value={reviewDesc}
              onChange={(e) => setReviewDesc(e.target.value)}
              rows={4}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Rating</label>
            <Rating count={5} size={30} activeColor="#ffd700" value={rating} onChange={setRating} />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg transition hover:scale-105">
            Submit Review
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductDetails;
