import React from "react";
import { useDispatch } from "react-redux";
import { RiDeleteBin3Line } from "react-icons/ri";
import { updateCartItem, removeFromCart } from "../../redux/slices/cartSlice";

function CartContent({ cart, userId, guestId }) {
  const dispatch = useDispatch();
  const cartItems = cart?.products || [];

  const handleIncrease = (item) => {
    dispatch(
      updateCartItem({
        productId: item.productId,
        size: item.size,
        color: item.color,
        quantity: item.quantity + 1,
        userId,
        guestId,
      })
    );
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCartItem({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity - 1,
          userId,
          guestId,
        })
      );
    }
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        productId: item.productId,
        size: item.size,
        color: item.color,
        userId,
        guestId,
      })
    );
  };

  if (!cartItems || cartItems.length === 0) {
    return <p className="text-center text-gray-500">Your cart is empty</p>;
  }

  return (
    <div>
      {cartItems.map((product, index) => (
        <div
          key={product.productId + product.size + product.color + index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">
                size: {product.size} | color: {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleDecrease(product)}
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  -
                </button>
                <span className="mx-2">{product.quantity}</span>
                <button
                  onClick={() => handleIncrease(product)}
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <p className="font-medium">$ {(product.price * product.quantity).toLocaleString()}</p>
            <button onClick={() => handleRemove(product)}>
              <RiDeleteBin3Line className="h-5 w-5 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartContent;
