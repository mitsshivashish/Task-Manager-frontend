import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  // You can extend this to support different skeleton types
  const skeletons = Array.from({ length: count });

  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow p-6 flex items-center gap-4 min-h-[100px]"
        >
          {/* Avatar */}
          <div className="w-14 h-14 bg-gray-200 rounded-full" />
          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader; 