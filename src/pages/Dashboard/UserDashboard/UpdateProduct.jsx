import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import { WithContext as ReactTags } from "react-tag-input";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/product/${id}`);
      return res.data;
    },
  });

  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (product?.tags) {
      const formattedTags = product.tags.map((tag, index) => ({
        id: index.toString(),
        text: tag,
      }));
      setTags(formattedTags);
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/product/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries(["product", id]);
      navigate("/dashboard/myProducts");
    },
    onError: () => toast.error("Update failed. Try again."),
  });

  const handleDelete = (i) => {
    setTags(tags.filter((_, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedProduct = {
      productName: form.productName.value.trim(),
      productImage: form.productImage.value.trim(),
      description: form.description.value.trim(),
      tags: tags.map((tag) => tag.text.trim()),
      externalLink: form.externalLink.value.trim(),
    };

    updateMutation.mutate(updatedProduct);
  };

  if (isLoading)
    return (
      <div className="p-12 text-center text-gray-600 font-semibold">
        Loading product details...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto my-12 p-10 bg-white rounded-xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700">
        Update Product
      </h2>
      <form onSubmit={handleUpdate} className="space-y-7">
        <div>
          <label
            htmlFor="productName"
            className="block mb-2 font-semibold text-gray-800"
          >
            Product Name <span className="text-red-600">*</span>
          </label>
          <input
            id="productName"
            type="text"
            name="productName"
            defaultValue={product?.productName}
            required
            placeholder="Enter product name"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        <div>
          <label
            htmlFor="productImage"
            className="block mb-2 font-semibold text-gray-800"
          >
            Product Image URL <span className="text-red-600">*</span>
          </label>
          <input
            id="productImage"
            type="text"
            name="productImage"
            defaultValue={product?.productImage}
            required
            placeholder="https://example.com/image.jpg"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-2 font-semibold text-gray-800"
          >
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            defaultValue={product?.description}
            required
            placeholder="Write a detailed description of your product"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-800">
            Tags{" "}
            <small className="text-gray-400">(Add with comma or enter)</small>
          </label>
          <ReactTags
            tags={tags}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            delimiters={delimiters}
            inputFieldPosition="bottom"
            autocomplete
            classNames={{
              tags:
                "min-h-[50px] border border-gray-300 rounded-lg p-3 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-600 transition",
              tag: "bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-sm font-semibold select-none",
              tagInputField: "flex-1 min-w-[140px] border-none p-0 m-0 focus:outline-none",
              remove:
                "ml-2 cursor-pointer text-red-500 font-bold hover:text-red-700 transition",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="externalLink"
            className="block mb-2 font-semibold text-gray-800"
          >
            External Link (Optional)
          </label>
          <input
            id="externalLink"
            type="url"
            name="externalLink"
            defaultValue={product?.externalLink}
            placeholder=""
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          disabled={updateMutation.isLoading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition
            ${
              updateMutation.isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }
          `}
        >
          {updateMutation.isLoading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
