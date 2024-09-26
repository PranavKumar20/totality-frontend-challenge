"use client"
// app/page.tsx
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import PropertyCard from './components/PropertyCard';
import { API_URL } from './config';

// Define the Property type based on the API response
interface Property {
  propertyId: string;
  name: string;
  price: number;
  imageUrls: string[]; // Array of image URLs
  type: string;
  address: string;
  rating: number;
}

const HomePage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_URL}/properties/all`); // Updated to your specific endpoint
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Available Properties</h1>
        {isLoading ? (
          <p>Loading properties...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.propertyId}
                property={{
                  ...property,
                  image: property.imageUrls[0] // Pass the first image URL only
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
