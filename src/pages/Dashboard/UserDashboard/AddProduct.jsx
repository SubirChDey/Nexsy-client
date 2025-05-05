import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import { AuthContext } from "../../../providers/AuthProvider";
import { toast } from "react-toastify";

const AddProduct = () => {
  const { user } = useContext(AuthContext); // user contains name, email, image
   const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [tags, setTags] = useState([]);

  if (!user) {
    return <div>Loading user data...</div>;
  }
  console.log(user)

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productImage || !description) {
      toast.error("Please fill all required fields.");
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
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        toast.success("Product added successfully!");
        navigate("/dashboard/myProducts");
      } else {
        toast.error("Failed to add product.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name *"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Product Image URL *"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Product Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-between items-center">
          <div className="gap-4 justify-between">
            <input
              type="text"
              value={user.displayName}
              disabled
              className="w-full border p-2 rounded bg-gray-100 mb-4"
            />
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>
          {/* <input
            type="text"
            value={user.photoURL}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          /> */}
          <img
            src={user.photoURL}
            alt="User"
            className="w-16 h-16 rounded-full border"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tags</label>
          <ReactTags
            tags={tags}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            inputFieldPosition="bottom"
            placeholder="Add a tag"
          />
        </div>

        <input
          type="text"
          placeholder="External Link (optional)"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
