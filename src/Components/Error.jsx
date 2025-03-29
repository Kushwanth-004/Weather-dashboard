import React from "react";

const Error = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-red-100">
      <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-lg">Please enter a valid place.</p>
        <p className="mt-2">Make sure the city name is correct, and try again!</p>
      </div>
    </div>
  );
};

export default Error;
