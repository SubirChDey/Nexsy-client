import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchProducts = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
  // Sort: Pending -> Accepted -> Rejected
  return res.data.sort((a, b) => {
    const order = { Pending: 0, Accepted: 1, Rejected: 2 };
    return order[a.status] - order[b.status];
  });
};

const ProductReviewQueue = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const mutation = useMutation({
    mutationFn: ({ id, update }) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/products/${id}`, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleUpdate = (id, update) => {
    mutation.mutate({ id, update });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-xl font-medium text-gray-600 animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="px-6 py-10 w-full mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Product Review Queue</h2>
      <div className="overflow-x-auto bg-white shadow-lg">
        <table className="min-w-full table-auto border border-gray-200 rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 border text-left text-base font-semibold" rowSpan={2}>Product Name</th>
              <th className="px-6 py-4 border text-left text-base font-semibold" rowSpan={2}>Status</th>
              <th className="px-6 py-4 border text-center text-base font-semibold" colSpan={4}>Actions</th>
            </tr>
            <tr>
              <th className="px-4 py-2 border text-sm font-medium text-gray-600">View</th>
              <th className="px-4 py-2 border text-sm font-medium text-gray-600">Feature</th>
              <th className="px-4 py-2 border text-sm font-medium text-gray-600">Accept</th>
              <th className="px-4 py-2 border text-sm font-medium text-gray-600">Reject</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-t transition-all duration-300 hover:bg-gray-200 hover:shadow-sm">
                <td className="px-6 py-4 border text-sm font-medium text-gray-800">{product.productName}</td>
                <td className="px-6 py-4 border">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold transition-colors duration-200
                      ${product.status === 'Pending'
                        ? 'bg-yellow-500'
                        : product.status === 'Accepted'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-4 border text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-transform duration-200 hover:scale-105"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    View
                  </button>
                </td>
                <td className="px-4 py-4 border text-center">
                  <button
                    className={`${product.featured
                      ? 'bg-gray-400 hover:bg-gray-500'
                      : 'bg-yellow-500 hover:bg-yellow-600'
                      } text-white px-3 py-1 rounded transition-transform duration-200 hover:scale-105`}
                    onClick={() => handleUpdate(product._id, { featured: !product.featured })}
                  >
                    {product.featured ? 'Unfeature' : 'Make Featured'}
                  </button>
                </td>
                <td className="px-4 py-4 border text-center">
                  <button
                    className={`${product.status === 'Accepted'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                      } text-white px-3 py-1 rounded transition-transform duration-200 hover:scale-105`}
                    onClick={() => handleUpdate(product._id, { status: 'Accepted' })}
                    disabled={product.status === 'Accepted'}
                  >
                    Accept
                  </button>
                </td>
                <td className="px-4 py-4 border text-center">
                  <button
                    className={`${product.status === 'Rejected'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600'
                      } text-white px-3 py-1 rounded transition-transform duration-200 hover:scale-105`}
                    onClick={() => handleUpdate(product._id, { status: 'Rejected' })}
                    disabled={product.status === 'Rejected'}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-lg">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductReviewQueue;
