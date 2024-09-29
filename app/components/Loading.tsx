import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <h2 className="mt-4 text-center text-gray-500 text-xl font-semibold">Loading...</h2>
      </div>
    </div>
  );
};

export default Loading;
