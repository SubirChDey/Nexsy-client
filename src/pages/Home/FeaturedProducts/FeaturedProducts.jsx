import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaArrowUp } from "react-icons/fa";
import { AuthContext } from "../../../providers/AuthProvider";

const FeaturedProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch featured products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/featuredProducts`);
      return res.data;
    },
  }); 

  // Upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: async (productId) => {
      await axios.post(`/api/products/upvote/${productId}`, {
        userId: user._id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });

  const handleUpvote = (product) => {
    if (!user) {
      navigate("/login");
    } else if (!product.voters?.includes(user._id) && product.ownerId !== user._id) {
      upvoteMutation.mutate(product._id);
    }
  };

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <section className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const hasVoted = product.voters?.includes(user?._id);
          const isOwner = product.ownerId === user?._id;

          return (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <img
                src={product.productImage}
                alt={product.productName}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3
                className="text-lg font-semibold mt-2 hover:text-blue-500 cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {product.Name}
              </h3>
              <div className="flex flex-wrap gap-2 my-2">
                {product.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleUpvote(product)}
                disabled={isOwner || hasVoted}
                className={`flex items-center gap-2 mt-4 px-3 py-2 text-sm rounded-full ${
                  isOwner || hasVoted
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                <FaArrowUp />
                {product.votes || 0}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProducts;
