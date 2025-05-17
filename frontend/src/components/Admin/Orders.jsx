import React, { useState } from 'react';
import { FiSearch, FiEye, FiTruck, FiCheckCircle, FiPackage, FiX, FiClock } from 'react-icons/fi';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([
    { id: 'ORD1001', customer: 'John Doe', date: '2023-05-15', amount: 129.99, status: 'processing' },
    { id: 'ORD1002', customer: 'Jane Smith', date: '2023-05-14', amount: 89.99, status: 'shipped' },
    { id: 'ORD1003', customer: 'Robert Johnson', date: '2023-05-13', amount: 199.99, status: 'delivered' },
    { id: 'ORD1004', customer: 'Emily Davis', date: '2023-05-12', amount: 59.99, status: 'processing' },
    { id: 'ORD1005', customer: 'Michael Wilson', date: '2023-05-11', amount: 249.99, status: 'shipped' },
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Processing</span>;
      case 'shipped':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Shipped</span>;
      case 'delivered':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Delivered</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Unknown</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FiClock className="h-5 w-5" />;
      case 'shipped':
        return <FiTruck className="h-5 w-5" />;
      case 'delivered':
        return <FiCheckCircle className="h-5 w-5" />;
      default:
        return <FiPackage className="h-5 w-5" />;
    }
  };

  const handleStatusChange = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const updateOrderStatus = () => {
    if (!selectedOrder || !newStatus) return;
    
    setOrders(orders.map(order => 
      order.id === selectedOrder.id ? { ...order, status: newStatus } : order
    ));
    
    setShowStatusModal(false);
    setSelectedOrder(null);
    setNewStatus('');
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders by ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No orders found matching your criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleStatusChange(order.id)}
                        className="hover:bg-gray-100 rounded-full transition"
                      >
                        {getStatusBadge(order.status)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        onClick={() => console.log(`View order ${order.id}`)}
                        title="View details"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button 
                        className={`p-1 rounded-full hover:bg-gray-50 ${
                          order.status === 'processing' 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : order.status === 'shipped' 
                              ? 'text-blue-600 hover:text-blue-900' 
                              : order.status === 'delivered' 
                                ? 'text-green-600 hover:text-green-900' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      >
                        {getStatusIcon(order.status)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Order Status</h2>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">Order ID: <span className="font-medium">{selectedOrder.id}</span></p>
              <p className="text-gray-700">Customer: <span className="font-medium">{selectedOrder.customer}</span></p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                <div className="inline-block">
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select new status</option>
                  {getStatusOptions(selectedOrder.status).map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateOrderStatus}
                disabled={!newStatus || newStatus === selectedOrder.status}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;