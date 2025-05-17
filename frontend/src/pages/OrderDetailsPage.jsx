import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function OrderDetailsPage() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = React.useState(null);

  useEffect(() => {
    const mockOrderDetails = {
      _id: id,
      createdAt: new Date(),
      isPaid: true,
      isDelivered: false,
      paymentMethod: 'PayPal',
      shippingAddress: { 
        address: '123 Main St',
        city: 'New York', 
        postalCode: '10001',
        country: 'USA' 
      },
      orderItems: [
        {
          productId: '1',
          name: 'Jacket',
          price: 29.99,
          quantity: 1,
          image: 'https://picsum.photos/150?random=0',
        },
        {
          productId: '2',
          name: 'Shirt',
          price: 39.99,
          quantity: 2,
          image: 'https://picsum.photos/150?random=2',
        },
      ],
    };
    setOrderDetails(mockOrderDetails);
  }, [id]);  

  // Calculate total price
  const totalPrice = orderDetails?.orderItems.reduce(
    (acc, item) => acc + (item.price * item.quantity), 0
  );

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
      <h2 className='text-2xl md:text-3xl font-bold mb-6'>Order Details</h2>
      {!orderDetails ? (
        <p>No Order details found</p>
      ) : (
        <div className='p-4 sm:p-6 rounded-lg border space-y-8'>
          {/* Order Info */}
          <div className='flex flex-col sm:flex-row justify-between'>
            <div className='mb-4 sm:mb-0'>
              <h3 className='text-lg font-semibold'>Order ID: {orderDetails._id}</h3>
              <p>Created At: {new Date(orderDetails.createdAt).toLocaleString()}</p>
            </div>
            <div className='flex flex-col items-start sm:items-end space-y-2'>
              <span className={`${orderDetails.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full text-sm font-medium`}>
                {orderDetails.isPaid ? 'Approved' : 'Not Approved'}
              </span>
              <span className={`${orderDetails.isDelivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} px-3 py-1 rounded-full text-sm font-medium`}>
                {orderDetails.isDelivered ? 'Delivered' : 'Pending Delivery'}
              </span>
            </div>
          </div>

          {/* Shipping and Payment Info */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='border p-4 rounded-lg'>
              <h3 className='font-semibold mb-2'>Shipping Address</h3>
              <p>{orderDetails.shippingAddress.address}</p>
              <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}</p>
              <p>{orderDetails.shippingAddress.country}</p>
            </div>
            <div className='border p-4 rounded-lg'>
              <h3 className='font-semibold mb-2'>Payment Method</h3>
              <p className='mb-2'>{orderDetails.paymentMethod}</p>
              <span className={`${orderDetails.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full text-sm font-medium inline-block`}>
                Status: {orderDetails.isPaid ? 'Paid' : 'Not Paid'}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className='font-semibold mb-4'>Order Items</h3>
            <div className='space-y-4'>
              {orderDetails.orderItems.map((item) => (
                <div key={item.productId} className='flex items-center border-b pb-4'>
                  <img src={item.image} alt={item.name} className='w-20 h-20 object-cover rounded' />
                  <div className='ml-4 flex-1'>
                    <p className='font-medium'>{item.name}</p>
                    <p>{item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <p className='font-semibold'>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className='border-t pt-4'>
            <div className='flex justify-end'>
              <div className='w-full max-w-xs space-y-2'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className='flex justify-between font-bold text-lg'>
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
            <Link to="/my-orders" className='text-blue-500 hover:underline'>
              Back to My Orders
            </Link>
        </div>
      )}
    </div>
  );
}

export default OrderDetailsPage;