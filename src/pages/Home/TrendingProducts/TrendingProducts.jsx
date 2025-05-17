import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../../components/SharedComponents/ProductCard';

const TrendingProducts = () => {
  const navigate = useNavigate();

  const { data: trendingProducts = [], isLoading, isError } = useQuery({
    queryKey: ['trendingProducts'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/trendingProducts`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading trending products...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load trending products.</p>;

  return (
    <section className="my-12 px-4 md:px-10">
      <h2 className="text-4xl font-bold mb-4 text-center text-indigo-700"> Trending Products</h2>
      <p className="text-center text-gray-600 mb-12 text-sm md:text-base">
        Discover what's hot right now the most loved and upvoted products on Nexsy.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingProducts.map(product => (
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
    </section>
  );
};

export default TrendingProducts;
