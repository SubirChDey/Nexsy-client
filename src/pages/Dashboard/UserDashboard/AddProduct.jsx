import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import { AuthContext } from "../../../providers/AuthProvider";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [tags, setTags] = useState([]);

  const { data: myProducts = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ["myProducts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/myProducts?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: isSubscribed = false, isLoading: isSubLoading } = useQuery({
    queryKey: ["isSubscribed", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/isSubscribed");
      const userInfo = res.data.find((u) => u.email === user?.email);
      return userInfo?.isSubscribed || false;
    },
    enabled: !!user?.email,
  });

  const addProduct = async (newProduct) => {
    const res = await axiosSecure.post("/products", newProduct);
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      toast.success("Product added successfully!");
      queryClient.invalidateQueries(["myProducts"]);
      navigate("/dashboard/myProducts");
    },
    onError: () => {
      toast.error("Failed to add product.");
    },
  });

  const handleDelete = (i) => {
    setTags(tags.filter((_, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productName || !productImage || !description) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!isSubscribed && myProducts.length >= 1) {
      toast.warn("Upgrade your plan to post more products.");
      return;
    }

    const newProduct = {
      productName,
      productImage,
      description,
      externalLink,
      tags: tags.map((tag) => tag.text),
      ownerName: user.displayName,
      ownerEmail: user.email,
      ownerImage: user.photoURL,
      createdAt: new Date(),
      status: "Pending",
      featured: false,
      upVote: 0,
      votedEmails: [],
      reportedBy: [],
    };

    mutation.mutate(newProduct);
  };

  if (!user || isProductsLoading || isSubLoading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Product Name *"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={mutation.isLoading}
        />

        <input
          type="text"
          placeholder="Product Image URL *"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={mutation.isLoading}
        />

        <textarea
          placeholder="Product Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={mutation.isLoading}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={user.displayName}
              disabled
              className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 text-gray-600"
            />
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border border-gray-300 p-3 mt-3 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
          <div className="shrink-0 self-start sm:self-auto">
            <img
              src={user.photoURL}
              alt="User"
              className="w-20 h-20 rounded-full border-4 border-indigo-500 shadow-md"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Tags</label>
          <ReactTags
            tags={tags}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            inputFieldPosition="bottom"
            placeholder="Add a tag"
            classNames={{
              tagInput: "border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",
              tag: "bg-indigo-100 text-indigo-700 px-2 py-1 rounded mr-2 mt-1 inline-block",
              remove: "ml-2 text-red-500 cursor-pointer",
            }}
            readOnly={mutation.isLoading}
          />
        </div>

        <input
          type="text"
          placeholder="External Link (optional)"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={mutation.isLoading}
        />

        <button
          type="submit"
          disabled={mutation.isLoading}
          className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
            mutation.isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {mutation.isLoading ? "Submitting..." : "Submit Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
