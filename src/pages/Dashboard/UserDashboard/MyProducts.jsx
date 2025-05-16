import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../../../providers/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyProducts = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const fetchUserProducts = async () => {
    const res = await axiosSecure.get(`/myProducts?email=${user.email}`);
    return res.data;
  };

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ["products", user?.email],
    queryFn: fetchUserProducts,
    enabled: !!user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Your product has been deleted.", "success");
      queryClient.invalidateQueries(["products", user?.email]);
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <div className="p-6 text-center text-blue-600">Loading...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Products</h2>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V7a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414a1 1 0 00-.707-.293H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2v-5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 16l4-4m0 0l-4-4m4 4H10"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
          <p className="text-gray-500 text-sm text-center max-w-md">
            It looks like there are no products available right now. Please check back later or add a new one.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 border">SL</th>
                <th className="px-4 py-3 border">Product Name</th>
                <th className="px-4 py-3 border">Votes</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id} className="hover:bg-indigo-50 transition duration-200">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{product.productName}</td>
                  <td className="px-4 py-2 border text-center">{product.votes || 0}</td>
                  <td className="px-4 py-2 border text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : product.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    <Link
                      to={`/dashboard/myProduct/update/${product._id}`}
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="inline-block bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
