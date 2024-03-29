import React from "react";
import {
  cookies,
  cookiesOptions,
  useAuth,
} from "../../../AuthProvider/AuthProvider";
import { useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import UseGetCart from "../../../hooks/UseGetCart";
import { Link, useNavigate } from "react-router-dom";
import { useCheckoutData } from "../../../context/CheckoutProvider";
import HelmetSeo from "../../../Component/shared/Helmet";

const Cart = () => {
  const { user } = useAuth();
  const { axiosSecure } = useAxiosSecure();
  const navigate = useNavigate();
  const { cartProduct } = UseGetCart();
  const { controlCart, setControlCart, handleTop } = useAuth();
  const [availableQuantity, setAvailableQuantity] = useState({});
  const { checkoutData, setCheckoutData, control, setControl } =
    useCheckoutData();
  const totalPrice = cartProduct?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  console.log(cartProduct);
  const handleQuantity = (id, type) => {
    console.log("object");
    const product = cartProduct?.find((p) => p?._id == id);
    setAvailableQuantity(product);
    const updateQuantity = {
      id: id,
      type: type,
    };
    axiosSecure
      .put("/update-cart-product-quantity", updateQuantity)
      .then((res) => {
        if (res?.data?.success) {
          setControlCart(!controlCart);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // Handle Delete:
  const handleCartDelete = (id) => {
    axiosSecure.delete(`/delete-cart/${id}`).then((res) => {
      if (res.data.success) {
        setControlCart(!controlCart);
      }
    });
  };

  const handleCheckout = () => {
    try {
      const data = {
        duration: "cart",
      };

      cookies.set("data", data, cookiesOptions);
      setControl(!control);

      navigate("/checkout");
    } catch (error) { }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <HelmetSeo
        title="cart"
        canonical={"cart"}
        description="cart page"
      />
      <h2 className="my-10 md:text-5xl text-xl ms-2">My Cart Page</h2>
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-8 col-span-12 p-10">
          <div className="flex justify-between items-center">
            <span className="font-bold">{cartProduct?.length} item Added</span>
            <span className="font-bold">
              Total: ${totalPrice.toFixed(2)}
            </span>
          </div>
          {cartProduct?.map((item, i) => {
            console.log(item);
            return (
              <div key={i} className="p-2 border mt-4 relative">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 ">
                    <img
                      className="w-[70px]"
                      src={item?.product_image}
                      alt="image"
                    />
                    <div className="flex flex-col justify-between ps-3">
                      <div>
                        <h3 className="font-bold">
                          {item?.product_name?.length > 54
                            ? item?.product_name.slice(0, 54)
                            : item?.product_name}
                        </h3>
                        <h2 className="">${item?.price}</h2>
                      </div>
                      <Link
                        onClick={handleTop}
                        to={`/product-details/${item?.product_id}`}
                      >
                        <button className="btn-link">Details</button>
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantity(item._id, "dec")}
                        className="btn hover:bg-black btn-sm text-xl bg-black text-white"
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <p>{item?.quantity}</p>
                      <button
                        onClick={() => handleQuantity(item._id, "inc")}
                        className="btn hover:bg-black btn-sm text-xl bg-black text-white"
                        disabled={item?.quantity >= item?.product_quantity}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <button
                    onClick={() => handleCartDelete(item?._id)}
                    className="p-2 bg-red-500 text-white rounded-full"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="md:col-span-4 col-span-12 p-10 flex flex-col gap-2">
          <h3 className="text-black font-bold">Product Details</h3>
          <div>
            <div className="flex justify-between items-start">
              <p>Total Price</p>
              <p>{totalPrice <= 0 ? "0" : totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-start">
              <p>Discount</p>
              <p>0</p>
            </div>
            <div className="flex justify-between items-start">
              <p>Tax</p>
              <p>0</p>
            </div>
            <hr />
            <div className="flex justify-between items-start mt-5">
              <p>Order Total</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <button
              onClick={handleCheckout}
              className={`${totalPrice === 0 ? "cursor-not-allowed" : ""
                } brand-btn mt-5 w-full py-1`}
              disabled={totalPrice === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
