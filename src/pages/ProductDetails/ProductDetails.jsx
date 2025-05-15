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

  // Fetch product
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${id}`);
      if (!res.ok) throw new Error('Failed to load product');
      return res.json();
    },
  });

  // Fetch reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews?productId=${id}`);
      if (!res.ok) throw new Error('Failed to load reviews');
      return res.json();
    },
  });

  // Upvote Mutation
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

  // Report Mutation
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

  // Review Mutation
  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      return res.json();
    },
    onSuccess: (data, variables) => {
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
      reviewerName: user.displayName,
      reviewerImage: user.photoURL,
      description: reviewDesc,
      rating,
    };

    reviewMutation.mutate(reviewData);
  };

  if (productLoading) return <div className="text-center py-10">Loading Product...</div>;
  if (!product) return <div className="text-center py-10 text-red-500">Product not found.</div>;

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Product Section */}
      <motion.div className="bg-white shadow-lg rounded-2xl p-6 mb-10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <img src={product.productImage} alt={product.productName} className="w-full md:w-1/2 h-64 object-cover rounded" />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.productName}</h2>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags?.map((tag, i) => (
                <span key={i} className="text-sm bg-gray-200 rounded-full px-3 py-1">#{tag}</span>
              ))}
            </div>
            {product.externalLinks?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">External Links:</h3>
                <ul className="list-disc list-inside text-blue-600">
                  {product.externalLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center gap-4 mt-6">
              <button onClick={() => upvoteMutation.mutate()}
                disabled={user?.email === product.ownerEmail}
                className={`flex items-center gap-2 px-4 py-2 rounded text-white transition-transform duration-200 hover:scale-105 ${
                  user?.email === product.ownerEmail ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
                }`}
              >
                <FaArrowUp />
                Upvote ({product.upVote || 0})
              </button>
              <button
                onClick={() => reportMutation.mutate()}
                className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition-transform duration-200 hover:scale-105"
              >
                <FaFlag />
                Report
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div className="bg-white shadow-lg rounded-2xl p-6 mb-10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h3>
        {reviewsLoading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-2">
                  <img src={review.reviewerImage} alt={review.reviewerName} className="w-10 h-10 rounded-full" />
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

      {/* Post Review Section */}
      <motion.div className="bg-white shadow-lg rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Post a Review</h3>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Reviewer Name</label>
            <input type="text" value={user.displayName} readOnly className="w-full px-4 py-2 border rounded bg-gray-100" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Reviewer Image</label>
            <input type="text" value={user.photoURL} readOnly className="w-full px-4 py-2 border rounded bg-gray-100" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Review Description</label>
            <textarea value={reviewDesc} onChange={(e) => setReviewDesc(e.target.value)} rows={4} className="w-full px-4 py-2 border rounded" placeholder="Write your review here..." />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Rating</label>
            <Rating count={5} size={30} activeColor="#ffd700" value={rating} onChange={(newRating) => setRating(newRating)} />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded text-lg transition-transform hover:scale-105">
            Submit Review
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductDetails;
