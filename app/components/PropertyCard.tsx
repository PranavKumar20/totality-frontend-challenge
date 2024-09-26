"use client"; // Ensure this component is client-side rendered
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

interface PropertyCardProps {
  property: {
    propertyId: string;
    name: string;
    price: number;
    image: string; // Adjust as needed
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const router = useRouter(); // Initialize useRouter

  const handleViewDetails = () => {
    // Navigate to the property details page
    router.push(`/properties/${property.propertyId}`);
  };

  return (
    <div className="border p-4 rounded shadow">
      <img src={property.image} alt={property.name} className="w-full h-40 object-cover mb-2 rounded" />
      <h2 className="text-lg font-semibold">{property.name}</h2>
      <p className="text-gray-700">${property.price}</p>
      <button 
        onClick={handleViewDetails} // Set onClick to navigate
        className="mt-2 bg-blue-500 text-white rounded p-2"
      >
        View Details
      </button>
    </div>
  );
};

export default PropertyCard;
