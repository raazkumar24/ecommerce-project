
// FILE: client/src/pages/ShippingPage.jsx

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/common/CheckoutSteps';

const ShippingPage = ({ navigate }) => {
  const { shippingAddress, saveShippingAddress } = useCart();

  // Initialize state with data from context/localStorage or with empty strings
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the address to context and localStorage
    saveShippingAddress({ address, city, postalCode, country });
    // Navigate to the next step
    navigate('/payment');
  };

  return (
    <div className="flex flex-col items-center">
      <CheckoutSteps step1 step2 navigate={navigate} />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Shipping Address</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Postal Code</label>
            <input
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              type="text"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
