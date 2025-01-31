// src/components/Orders.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner.js'

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/orders'); // Adjust the endpoint as needed
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load orders.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleUpdate = (orderId) => {
        // Handle order update logic here (e.g., open a modal or navigate to update form)
        console.log('Update order:', orderId);
    };

    const handleDelete = async (orderId) => {
        try {
            await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
            alert("Record Deleted Successfully")
            setOrders(orders.filter(order => order._id !== orderId)); 
        } catch (err) {
            console.error('Failed to delete order:', err);
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Order Management</h2>
            {loading && <Spinner />}
            {orders.length === 0 ? (
                <p className="text-center text-gray-600">No orders found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto bg-white shadow-lg rounded-lg border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Order ID</th>
                                <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Product Image</th>
                                <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Category</th>
                                {/* <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Quantity</th> */}
                                <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Price</th>
                                <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Total Price</th>
                                <th className="py-3 px-4 border-b text-center text-gray-700 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <React.Fragment key={order._id}>
                                    {order.items.map((item, index) => (
                                        <tr key={item._id} className="hover:bg-gray-50 transition duration-200">
                                            {/* Display order ID only for the first item in each order */}
                                            {index === 0 && (
                                                <td rowSpan={order.items.length} className="py-3 px-4 border-b text-gray-600">
                                                    {order._id}
                                                </td>
                                            )}
                                            <td className="py-3 px-4 border-b">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.title} 
                                                    className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200"
                                                />
                                            </td>
                                            <td className="py-3 px-4 border-b text-gray-600">{item.category}</td>
                                            {/* <td className="py-3 px-4 border-b text-gray-600">{item.quantity}</td> */}
                                            <td className="py-3 px-4 border-b text-gray-700 font-bold">${item.price.toFixed(2)}</td>
                                            {/* Only display total price once per order */}
                                            {index === 0 && (
                                                <td rowSpan={order.items.length} className="py-3 px-4 border-b text-gray-700 font-bold">
                                                    ${order.totalPrice.toFixed(2)}
                                                </td>
                                            )}
                                            {/* Uncomment and update for action buttons */}
                                            {index === 0 && (
                                                <td rowSpan={order.items.length} className="py-3 px-4 border-b text-center">
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg mr-2 shadow-md transition duration-200 transform hover:scale-105"
                                                        onClick={() => handleUpdate(order._id)}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
                                                        onClick={() => handleDelete(order._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Orders;
