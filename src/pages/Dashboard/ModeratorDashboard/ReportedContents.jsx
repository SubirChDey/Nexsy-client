import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaRegFlag } from 'react-icons/fa';

const ReportedProducts = () => {
  const axiosSecure = useAxiosSecure();

  const { data: reportedProducts = [], refetch } = useQuery({
    queryKey: ['reported-products'],
    queryFn: async () => {
      const res = await axiosSecure.get('/products/reported');
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the product!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      const res = await axiosSecure.delete(`/products/${id}`);
      if (res.data.deletedCount > 0) {
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        refetch();
      }
    }
  };

  const handleIgnore = async (id) => {
    const res = await axiosSecure.patch(`/products/ignore-report/${id}`);
    if (res.data.modifiedCount > 0) {
      Swal.fire('Report Ignored', 'The report has been removed.', 'info');
      refetch();
    }
  };

  return (
    <div className="p-6 md:p-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center gap-4">
        <FaRegFlag /> Reported Products
      </h2>

      {reportedProducts.length === 0 ? (
        <p className="text-gray-600">No reported products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-900 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">View</th>
                <th className="px-6 py-4">Ignore</th>
                <th className="px-6 py-4">Delete</th>
              </tr>
            </thead>
            <tbody>
              {reportedProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition duration-200 border-t border-gray-100"
                >
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4">{product.productName}</td>
                  <td className="px-6 py-4">
                    <Link to={`/product/${product._id}`}>
                      <button className="px-4 py-1 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition">
                        View
                      </button>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleIgnore(product._id)}
                      className="px-4 py-1 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 transition"
                    >
                      Ignore
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-4 py-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
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

export default ReportedProducts;
