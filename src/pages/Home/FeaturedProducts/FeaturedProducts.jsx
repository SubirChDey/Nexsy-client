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
      await axios.patch(`${import.meta.env.VITE_API_URL}/products/upvote/${productId}`, {
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

  if (isLoading) return <p className="text-center py-10 text-gray-500">Loading featured products...</p>;

  return (
    <section className="px-4 md:px-10 my-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#1A2238]">⭐ Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const hasVoted = product.voters?.includes(user?._id);
          const isOwner = product.ownerId === user?._id;

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <img
                src={product.productImage}
                alt={product.productName}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
              <h3
                className="text-xl font-semibold text-[#0F172A] hover:text-[#2563EB] cursor-pointer transition"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {product.productName}
              </h3>

              <div className="flex flex-wrap gap-2 my-3">
                {product.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#F1F5F9] text-[#334155] px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleUpvote(product)}
                disabled={isOwner || hasVoted}
                className={`flex items-center justify-center gap-2 w-full mt-4 py-2 text-sm rounded-full font-medium transition ${
                  isOwner || hasVoted
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                }`}
              >
                <FaArrowUp />
                {product.upVote || 0}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProducts;
