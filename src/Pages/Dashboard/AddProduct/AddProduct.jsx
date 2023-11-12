import React, { useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
const img_hosting_Token = import.meta.env.VITE_IMAGE_UPLOAD;

const AddProduct = () => {
  const imgHostingUrl = `https://api.imgbb.com/1/upload?key=${img_hosting_Token}`;
  const [loadImage, setLoadImage] = useState(false);
  const { register, watch } = useForm();
  const image = watch("image"); // watch the 'image' input
  const { axiosSecure } = useAxiosSecure();
  const [error, setError] = useState("");
  const handelAddProduct = (e) => {
    e.preventDefault();
    const from = e.target;
    const selectedFile = from?.image?.files[0];
    const product_name = from?.product_name?.value;
    const price = from?.price?.value;
    const quantity = from?.quantity?.value;
    const discount = from?.discount?.value;
    const product_description = from?.product_description?.value;
    const navigate = useNavigate();

    if (!parseFloat(price) == true) {
      return setError("price is not a number");
    }
    if (!parseFloat(quantity) == true) {
      return setError("Quantity is not a number");
    }
    if (!parseFloat(discount) == true) {
      return setError("Discount is not a number");
    }
    if (!selectedFile) {
      console.log("You haven't selected an image.");
      return;
    }
    // Handle image submission
    const formData = new FormData();
    formData.append("image", selectedFile);
    setLoadImage(true);

    fetch(imgHostingUrl, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgResponse) => {
        if (imgResponse.success) {
          const imgURL = imgResponse.data.url;
          const updateImageFile = {
            product_name,
            product_description,
            price,
            product_image: imgURL,
            quantity,
          };
          console.log(updateImageFile);
          axiosSecure
            .post("/create-product", updateImageFile)
            .then((res) => {
              if (res?.data?.success) {
                Swal.fire({
                  position: "top-center",
                  icon: "success",
                  title: "Upload successfully",
                  showConfirmButton: false,
                  timer: 1500,
                });
                from.reset();
                setLoadImage(false);
                setError("");
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Warning",
                  text: "Something went wrong!",
                });
              }
            })
            .catch((err) => {
              console.log(err);
              setLoadImage(false);
            });
        }
      })
      .catch(() => {
        console.log("Error uploading image.");
        setLoadImage(false);
      });
  };
  return (
    <div className="max-w-[1200px] mx-auto">
      <h1 className="text-center my-5 md:text-5xl text-xl">Add Product</h1>
      <form onSubmit={handelAddProduct}>
        <div className="relative mx-auto h-full border-2 border-gray-400 bg-gray-200 border-dashed rounded-[20px]  text-gray-500 ">
          <label
            htmlFor="file-upload"
            className="h-[50vh] cursor-pointer  flex justify-center items-center flex-col"
          >
            <span className="text-3xl flex items-center gap-1">
              + <BsFillImageFill></BsFillImageFill>
            </span>
            <span className="mt-2">Add Product Image</span>
          </label>
          <input
            id="file-upload"
            type="file"
            className="custom-file-input"
            name="image"
          />
        </div>
        <div className="mt-5">
          <h1 className="my-5 md:text-1xl text-xl">Add Info</h1>
          <div className="flex justify-between items-center gap-5">
            <div className="flex flex-col w-full">
              <label htmlFor="product_name">Name</label>
              <input
                id="product_name"
                type="text"
                className="border outline-none px-2 py-3 mt-1 bg-gray-200"
                placeholder="Enter Product Name"
                name="product_name"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="price">price</label>
              <input
                id="price"
                type="text"
                placeholder="Enter Product Price"
                className="border outline-none px-2 py-3 mt-1 bg-gray-200"
                name="price"
              />
            </div>
          </div>
          <div className="flex justify-between items-center gap-5">
            <div className="flex flex-col w-full">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="text"
                className="border outline-none px-2 py-3 mt-1 bg-gray-200"
                name="quantity"
                placeholder="Enter Product Quantity"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="discount">Discount</label>
              <input
                id="discount"
                type="text"
                placeholder="Enter Product Discount"
                className="border outline-none px-2 py-3 mt-1 bg-gray-200"
                name="discount"
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="product_description">Description</label>
            <textarea
              name="product_description"
              id="product_description"
              cols="30"
              className="border outline-none px-2 py-3 mt-1 bg-gray-200"
              rows="10"
              placeholder="Enter Product Details"
            ></textarea>
            <span className="text-red-600">{error}</span>
          </div>

          <input
            type="submit"
            value="Uplaod Product"
            className="brand-btn px-7 mt-5 py-2"
          />
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
