import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ReportedContents = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch reported products
  const {
    data: reportedProducts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reported-products'],
    queryFn: async () => {
      const res = await axiosSecure.get('/products/reported');
      return res.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.deletedCount > 0) {
        Swal.fire('Deleted!', 'Product has been removed.', 'success');
        queryClient.invalidateQueries({ queryKey: ['reported-products'] });
      }
    },
    onError: () => {
      Swal.fire('Error!', 'Failed to delete the product.', 'error');
    },
  });

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading reported products...</p>;
  if (isError) return <p className="text-red-500 text-center mt-10">Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reported Contents</h2>
      {reportedProducts.length === 0 ? (
        <p className="text-gray-500">No reported products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Product Name</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportedProducts.map((product) => (
                <tr key={product._id}>
                  <td className="py-2 px-4 border-b">{product.productName}</td>
                  <td className="py-2 px-4 border-b flex gap-3">
                    <Link
                      to={`/product/${product._id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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

export default ReportedContents;
