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

  // const mutation = useMutation({
  //   mutationFn: ({ id, update }) =>
  //     axios.patch(`/products/${id}`, update),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['products'] });
  //   },
  // });

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

  if (isLoading) return <div className="p-8 text-center text-lg font-medium">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Product Review Queue</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 border">Product Name</th>
              <th className="px-6 py-3 border">Status</th>
              <th className="px-6 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-6 py-4 border">{product.productName}</td>
                <td className="px-6 py-4 border font-semibold text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs ${product.status === 'Pending'
                        ? 'bg-yellow-500'
                        : product.status === 'Accepted'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 border">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      View
                    </button>
                    <button
                      className={`${product.featured ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'
                        } text-white px-3 py-1 rounded`}
                      onClick={() => handleUpdate(product._id, { featured: true })}
                      disabled={product.featured}
                    >
                      {product.featured ? 'Featured' : 'Make Featured'}
                    </button>
                    <button
                      className={`${product.status === 'Accepted' ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                        } text-white px-3 py-1 rounded`}
                      onClick={() => handleUpdate(product._id, { status: 'Accepted' })}
                      disabled={product.status === 'Accepted'}
                    >
                      Accept
                    </button>
                    <button
                      className={`${product.status === 'Rejected' ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600 cursor-pointer'
                        } text-white px-3 py-1 rounded`}
                      onClick={() => handleUpdate(product._id, { status: 'Rejected' })}
                      disabled={product.status === 'Rejected'}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-6 text-center text-gray-500">
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
