import { useState, useEffect, useContext } from "react";
import { FaArrowUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../providers/AuthProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Products = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/acceptedProducts?search=${search}&page=${page}&limit=6`
        );
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, [search, page]);

  const handleUpvote = async (id) => {
    if (!user?.email) {
      toast.warning("Please log in to vote.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/upvote/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();

      if (data.modifiedCount > 0) {
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (product._id === id) {
              const isUpvote = data.action === "upvoted";
              return {
                ...product,
                upVote: isUpvote
                  ? (product.upVote || 0) + 1
                  : (product.upVote || 1) - 1,
                userHasVoted: isUpvote,
              };
            }
            return product;
          })
        );

        if (data.action === "upvoted") {
          toast.success("Upvoted successfully!");
        } else if (data.action === "unvoted") {
          toast.info("Your vote was removed.");
        }
      } else {
        toast.error("Vote update failed.");
      }
    } catch (error) {
      toast.error("Failed to submit vote.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10 mt-15">
        Discover Products
      </h1>

      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search by tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-indigo-400 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <img
              src={product.productImage}
              alt={product.productName}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <Link
              to={`/product/${product._id}`}
              className="text-lg font-semibold text-indigo-700 hover:underline"
            >
              {product.productName}
            </Link>
            <div className="flex flex-wrap gap-2 my-3">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-indigo-100 text-indigo-600 rounded-full px-2 py-1 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleUpvote(product._id)}
              disabled={user?.email === product.ownerEmail}
              className={`flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg font-medium transition-transform duration-200 ${
                user?.email === product.ownerEmail
                  ? "bg-gray-300 cursor-not-allowed"
                  : product.userHasVoted
                  ? "bg-blue-700 text-white hover:bg-blue-800 hover:scale-105"
                  : "bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105"
              }`}
            >
              <FaArrowUp />
              {product.userHasVoted ? "Voted" : "Upvote"} ({product.upVote || 0})
            </button>
          </motion.div>
        ))}
      </div>
     
      <div className="mt-12 flex justify-center gap-3">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage(idx + 1)}
            className={`px-4 py-2 rounded-full border font-medium ${
              page === idx + 1
                ? "bg-indigo-600 text-white"
                : "bg-white hover:bg-indigo-100 text-indigo-700"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Products;
