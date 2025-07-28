import React from 'react';

const NotFoundPage = ({ navigate }) => {
  return (
    <div className="text-center py-16">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Page Not Found</p>
      <p className="mt-4 text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPage;
