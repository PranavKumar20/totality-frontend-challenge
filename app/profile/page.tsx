"use client"; // Ensure this component is client-side rendered
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';

interface UserDetails {
  name: string;
  email: string;
  userId: string; // Include userId in the interface
}

interface OrderItem {
  propertyId: string;
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); // Assuming the token is stored in local storage

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token) return;

      try {
        // Decode the JWT token to get userId
        const decodedToken: any = jwt.decode(token);
        const userId = decodedToken?.userId;

        if (!userId) {
          throw new Error('User ID not found in token');
        }

        const userResponse = await fetch(`${API_URL}/userdetails`, {
          method: 'GET',
          headers: {
            'Authorization': token, // Include the token in the Authorization header
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user details');
        }

        const userData = await userResponse.json();
        setUserDetails(userData);

        const ordersResponse = await fetch(`${API_URL}/orders/view?userId=${userId}`);

        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }

        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching user details or orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        {userDetails ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p>Name: {userDetails.name}</p>
            <p>Email: {userDetails.email}</p>

            <h2 className="text-lg font-semibold mt-4">Orders</h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="border p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Order ID: {order._id}</h3>
                    <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                    <p>Total Amount: ₹{order.totalAmount}</p>
                    <h4 className="font-semibold mt-2">Items:</h4>
                    <ul className="list-disc ml-5">
                      {order.items.map((item: OrderItem) => ( // Explicitly define the type for item
                        <li key={item._id}>
                          Property ID: {item.propertyId}, Quantity: {item.quantity}, Price: ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders found.</p>
            )}
          </>
        ) : (
          <p>User details not found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
