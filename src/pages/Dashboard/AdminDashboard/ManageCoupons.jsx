import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageCoupons = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    code: '',
    expiryDate: '',
    description: '',
    discount: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/coupons');
      return res.data;
    }
  });

  // Create or Update coupon
  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (editingId) {
        return axiosSecure.put(`/api/coupons/${editingId}`, formData);
      }
      return axiosSecure.post('/api/coupons', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setForm({ code: '', expiryDate: '', description: '', discount: '' });
      setEditingId(null);
      Swal.fire({
        title: "Success!",
        text: editingId ? "Coupon updated successfully" : "Coupon added successfully",
        icon: "success"
      });
    },
    onError: () => {
      Swal.fire("Error!", "Failed to save the coupon.", "error");
    }
  });

  // Delete coupon
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/api/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      Swal.fire("Deleted!", "The coupon has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Coupon deletion failed.", "error");
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const handleEdit = (coupon) => {
    setForm({
      code: coupon.code,
      expiryDate: coupon.expiryDate.split('T')[0],
      description: coupon.description,
      discount: coupon.discount
    });
    setEditingId(coupon._id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        {editingId ? 'Edit Coupon' : 'Add New Coupon'}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 shadow-md rounded-lg mb-10"
      >
        <input
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Coupon Code"
          required
          className="w-full border rounded-md px-4 py-2"
        />
        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
          className="w-full border rounded-md px-4 py-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full border rounded-md px-4 py-2 md:col-span-2"
        />
        <input
          type="number"
          name="discount"
          value={form.discount}
          onChange={handleChange}
          placeholder="Discount"
          required
          className="w-full border rounded-md px-4 py-2"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="md:col-span-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {editingId ? 'Update Coupon' : 'Add Coupon'}
        </button>
      </form>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading coupons...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <motion.div
              key={coupon._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-indigo-50 to-white border border-gray-200 p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-indigo-700">{coupon.code}</h3>
              <p className="text-gray-600">
                <strong>Expires:</strong> {new Date(coupon.expiryDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 my-2">{coupon.description}</p>
              <p className="text-green-600 font-bold">
                <strong>Discount:</strong> ${coupon.discount}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
