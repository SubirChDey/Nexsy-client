import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaArrowUp } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../providers/AuthProvider";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const FeaturedProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await axiosPublic.get("/featuredProducts");
      return res.data;
    },
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
          toast.info("Your vote has been removed.");
        }
        queryClient.invalidateQueries(["featured-products"]);
      } else {
        toast.info("No changes were made.");
      }
    },
    onError: () => {
      toast.error("Failed to process your vote.");
    },
  });

  if (isLoading)
    return (
      <p className="text-center py-10 text-gray-500">
        Loading featured products...
      </p>
    );

  return (
    <section className="px-4 md:px-10 my-12">
      <h2 className="text-4xl font-bold mb-4 text-center text-indigo-700">
        Featured Products
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Explore our handpicked favorites — the most loved, top-rated products on
        Nexsy, curated just for you!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const hasVoted = product.votedEmails?.includes(user?.email);
          const isOwner = product.ownerEmail === user?.email;

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
                className="text-xl font-semibold text-[#0F172A] hover:text-indigo-700 cursor-pointer transition"
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
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  if (isOwner) {
                    return toast.error("You cannot vote on your own product.");
                  }

                  upvoteMutation.mutate(product._id);
                }}
                disabled={upvoteMutation.isLoading}
                className={`flex items-center justify-center gap-2 w-full mt-4 py-2 text-sm rounded-full font-medium transition ${
                  isOwner
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : hasVoted
                    ? "bg-indigo-500 text-white hover:bg-yellow-600"
                    : "bg-indigo-700 text-white hover:bg-[#1D4ED8]"
                }`}
              >
                <FaArrowUp />
                {product.upVote || 0} {hasVoted ? "Voted" : "Vote"}
              </button>
            </div>
          );
        })}
      </div>

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

export default FeaturedProducts;
