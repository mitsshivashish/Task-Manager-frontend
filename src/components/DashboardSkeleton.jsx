import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <div className="h-14 w-full bg-gray-200 animate-pulse" />
      <div className="flex flex-1">
        {/* Side Menu */}
        <div className="w-56 bg-gray-200 animate-pulse flex flex-col gap-4 p-4">
          <div className="h-12 w-12 bg-gray-300 rounded-full mb-4" />
          <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
          <div className="h-4 w-2/3 bg-gray-300 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gray-300 rounded mb-2" />
          <div className="h-4 w-5/6 bg-gray-300 rounded mb-2" />
          <div className="h-4 w-2/3 bg-gray-300 rounded mb-2" />
        </div>
        {/* Main Content */}
        <div className="flex-1 p-8 space-y-6">
          {/* Greeting/Title */}
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-6" />
          {/* Cards Row */}
          <div className="flex gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-24 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
          {/* Charts Row */}
          <div className="flex gap-6 mb-6">
            <div className="flex-1 h-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 h-64 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          {/* Table/List Skeleton */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 w-1/4 bg-gray-200 rounded mb-4 animate-pulse" />
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-1 animate-pulse" />
                  <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton; 