import { useState, useEffect, useContext } from "react";
import { FaArrowUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../providers/AuthProvider";
import { Link } from "react-router-dom";

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
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/upvote/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success("Upvoted!");
        setProducts(products.map(p => p._id === id ? { ...p, votes: (p.votes || 0) + 1 } : p));
      }
    } catch {
      toast.error("Failed to upvote");
    }
  };

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="Search by tag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 border rounded w-full max-w-md"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={product.productImage}
              alt={product.productName}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <Link to={`/product/${product._id}`} className="text-xl font-semibold mb-2">{product.productName}</Link>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-gray-200 rounded-full px-2 py-1">
                  #{tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleUpvote(product._id)}
              disabled={user?.email === product.ownerEmail}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded ${
                user?.email === product.ownerEmail
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
            >
              <FaArrowUp />
              {product.votes || 0}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage(idx + 1)}
            className={`px-3 py-1 border rounded ${
              page === idx + 1 ? "bg-indigo-500 text-white" : "bg-white"
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
