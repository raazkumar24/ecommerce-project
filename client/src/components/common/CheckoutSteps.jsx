// FILE: client/src/components/common/CheckoutSteps.jsx

import React from 'react';

const CheckoutSteps = ({ step1, step2, step3, step4, navigate }) => {
  const onNavClick = (e, to) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <nav className="flex justify-center items-center space-x-4 my-8">
      {/* Step 1: Sign In */}
      <div>
        {step1 ? (
          <a href="/login" onClick={(e) => onNavClick(e, '/login')} className="font-bold text-blue-600">Sign In</a>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">Sign In</span>
        )}
      </div>

      <div className="text-gray-300">&gt;</div>

      {/* Step 2: Shipping */}
      <div>
        {step2 ? (
          <a href="/shipping" onClick={(e) => onNavClick(e, '/shipping')} className="font-bold text-blue-600">Shipping</a>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">Shipping</span>
        )}
      </div>

      <div className="text-gray-300">&gt;</div>

      {/* Step 3: Payment */}
      <div>
        {step3 ? (
          <a href="/payment" onClick={(e) => onNavClick(e, '/payment')} className="font-bold text-blue-600">Payment</a>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">Payment</span>
        )}
      </div>

      <div className="text-gray-300">&gt;</div>

      {/* Step 4: Place Order */}
      <div>
        {step4 ? (
          <a href="/placeorder" onClick={(e) => onNavClick(e, '/placeorder')} className="font-bold text-blue-600">Place Order</a>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">Place Order</span>
        )}
      </div>
    </nav>
  );
};

export default CheckoutSteps;
