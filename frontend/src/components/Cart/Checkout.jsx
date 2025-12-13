import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import PayPalButton from "./PayPalButton";
import { createCheckoutSession } from "../../redux/slices/checkoutSlice";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    if (!cart || cart.products.length === 0) return;

    const res = await dispatch(
      createCheckoutSession({
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "Paypal",
        totalPrice: cart.totalPrice,
      })
    );

    if (res.payload?.checkoutSession?._id) {
      setCheckoutId(res.payload.checkoutSession._id);
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      navigate("/order-confirmation");
    } catch (err) {
      console.error("Payment Error:", err);
    }
  };

  if (loading) return <p>Loading Cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  const isFormComplete = Object.values(shippingAddress).every((field) =>
    field.trim()
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      {/* LEFT */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>

        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>

          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full p-2 border rounded mb-4"
          />

          <h3 className="text-lg mb-4">Delivery</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={shippingAddress.firstName}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={shippingAddress.lastName}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
          </div>

          <input
            name="address"
            placeholder="Address"
            value={shippingAddress.address}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mb-4"
            required
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              name="postalCode"
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
          </div>

          <input
            name="country"
            placeholder="Country"
            value={shippingAddress.country}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mb-4"
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            value={shippingAddress.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mb-6"
            required
          />

          {!checkoutId ? (
            <button
              type="submit"
              disabled={!isFormComplete}
              className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
            >
              Continue to Payment
            </button>
          ) : (
            <div className="border-t pt-4">
              <h3 className="text-lg mb-4">Pay with PayPal</h3>
              <PayPalButton
                amount={cart.totalPrice}
                onSuccess={handlePaymentSuccess}
                onError={() => alert("Payment failed")}
              />
            </div>
          )}
        </form>
      </div>

      {/* RIGHT */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>

        {cart.products.map((product, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <p>{product.name}</p>
            <p>${product.price}</p>
          </div>
        ))}

        <div className="flex justify-between mt-4 font-semibold">
          <p>Total</p>
          <p>${cart.totalPrice}</p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
