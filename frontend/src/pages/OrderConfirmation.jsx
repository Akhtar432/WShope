import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

function OrderConfirmation() {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {checkout} = useSelector((state) => state.checkout);
  // Clear the cart when the order is confirmed
  useEffect(() => {
    if(checkout && checkout._id) {
      dispatch((clearCart()));
      localStorage.removeItem("cart");
    }
    else{
      navigate("/my-orders")
    }
  }, [checkout, dispatch, navigate])

  const calculatedEstimateDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return formatDate(orderDate);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-4xl font-bold text-emerald-700 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600">
          Thank you for your purchase. We've sent a confirmation email with your
          order details.
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Order Information</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-500">Order ID:</span> {checkout._id}
              </p>
              <p>
                <span className="text-gray-500">Order Date:</span>{" "}
                {formatDate(checkout.createdAt)}
              </p>
              <p>
                <span className="text-gray-500">Estimated Delivery:</span>{" "}
                <span className="text-emerald-600 font-medium">
                  {calculatedEstimateDelivery(checkout.createdAt)}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
            <div className="text-sm">
              <p>{checkout.shippingAddress.fullName}</p>
              <p>{checkout.shippingAddress.address}</p>
              <p>
                {checkout.shippingAddress.city}, {checkout.shippingAddress.state}{" "}
                {checkout.shippingAddress.postalCode}
              </p>
              <p>{checkout.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
          <p className="text-sm">{checkout.paymentMethod}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Items</h2>
        <div className="divide-y">
          {checkout.checkoutItems.map((item) => (
            <div key={item.productId} className="py-4 flex">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.color} | {item.size}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order Total</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${checkout.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>${checkout.shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>${checkout.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold text-lg">
            <span>Total</span>
            <span>${checkout.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium mr-4">
          Track Your Order
        </button>
        <button className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-md font-medium">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;