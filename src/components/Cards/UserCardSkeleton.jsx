import React from "react";

const UserCardSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="user-card p-2 bg-white rounded-lg shadow animate-pulse mb-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-white" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-24 bg-gray-200 rounded mt-2" /> {/* delete btn skeleton */}
            </div>
          </div>
          <div className="flex items-end gap-3 mt-5">
            <div className="flex-1 text-[10px] px-4 py-2 rounded bg-gray-100">
              <div className="h-4 w-8 bg-gray-200 rounded mb-1 mx-auto" />
              <div className="h-3 w-12 bg-gray-200 rounded mx-auto" />
            </div>
            <div className="flex-1 text-[10px] px-4 py-2 rounded bg-gray-100">
              <div className="h-4 w-8 bg-gray-200 rounded mb-1 mx-auto" />
              <div className="h-3 w-16 bg-gray-200 rounded mx-auto" />
            </div>
            <div className="flex-1 text-[10px] px-4 py-2 rounded bg-gray-100">
              <div className="h-4 w-8 bg-gray-200 rounded mb-1 mx-auto" />
              <div className="h-3 w-16 bg-gray-200 rounded mx-auto" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserCardSkeleton; 