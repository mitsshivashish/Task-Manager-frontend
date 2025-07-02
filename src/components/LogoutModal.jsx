import React, { useEffect, useRef } from "react";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/30">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 sm:p-8 text-center relative mx-2">
        <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
        <p className="mb-6 text-gray-700">Are you sure you want to log out?</p>
        <div className="flex gap-4 justify-center">
          <button
            className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal; 