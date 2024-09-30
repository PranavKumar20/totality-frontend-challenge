"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Navbar from '@/app/components/Navbar';
import Loading from '@/app/components/Loading'; // Import Loading component
import { API_URL } from '@/app/config';

interface Property {
  propertyId: string;
  name: string;
  type: string;
  price: number;
  address: string;
  rating: number;
  imageUrls: string[];
}

interface DecodedToken {
  userId: string;
}

const PropertyDetailsPage = () => {
  const [property, setProperty] = useState<Property | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { propertyId } = useParams();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/properties/${propertyId}`);
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt.decode(token) as DecodedToken;
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleAddToCart = async () => {
    if (!userId) {
      alert('User not logged in');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          propertyId: property?.propertyId,
          quantity,
        }),
      });

      if (response.ok) {
        alert('Property added to cart successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error adding property to cart:', errorData);
        alert('Failed to add property to cart.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding property to cart.');
    }
  };

  if (isLoading) {
    return <Loading />; // Use the Loading component
  }

  if (!property) {
    return <p>Property not found.</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Slideshow for images */}
          <div className="relative">
            <div className="overflow-hidden w-full h-64 relative">
              <div className="whitespace-nowrap transition-transform duration-500 ease-in-out">
                {property.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={property.name}
                    className="w-full h-64 object-cover inline-block rounded"
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Property details */}
          <div>
            <p>Type: {property.type}</p>
            <p>Price: ₹{property.price}</p>
            <p>Address: {property.address}</p>
            <p>Rating: {property.rating} / 5</p>
            <div className="mt-4">
              <label htmlFor="quantity" className="block mb-2">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border p-2"
                min="1"
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
