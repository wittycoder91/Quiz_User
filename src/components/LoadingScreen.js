import React from 'react';

const LoadingScreen = ({ backgroundColor = '#ffffff', textColor = '#000', fontFamily = 'OpalOrbit, sans-serif' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: textColor, fontFamily }}>
          Loading Quiz
        </h2>
        <p className="text-gray-600" style={{ fontFamily }}>
          Please wait while we prepare your quiz...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen; 