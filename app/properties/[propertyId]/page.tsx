"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // To get the dynamic propertyId from the URL
import Navbar from '@/app/components/Navbar';
import { API_URL } from '@/app/config';

// Define the Property type based on the API response
interface Property {
  propertyId: string;
  name: string;
  type: string;
  price: number;
  address: string;
  rating: number;
  imageUrls: string[];
}

const PropertyDetailsPage = () => {
  const [property, setProperty] = useState<Property | null>(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [isLoading, setIsLoading] = useState(true);
  const { propertyId } = useParams(); // To get the propertyId from the URL

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

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_pya82fzn7bs', // Replace with actual logged-in user ID
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
    return <p>Loading property details...</p>;
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
          <img src={property.imageUrls[0]} alt={property.name} className="w-full h-64 object-cover rounded" />
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
              className="mt-4 p-2 bg-blue-500 text-white"
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
