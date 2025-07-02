import React from "react";

const AddMembersModal = ({ isOpen, onClose, allUsers, tempSelectedUsers, toggleUserSelection, handleAssign }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/30 bg-opacity-60">
      <div className="relative p-2 sm:p-4 w-full max-w-xl max-h-full">
        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100">
          {/* Modal header */}
          <div className="rounded-t-2xl bg-blue-600 px-8 py-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Add Members</h3>
            <button
              type="button"
              className="text-white bg-transparent hover:bg-blue-700 hover:text-white rounded-lg text-base w-9 h-9 inline-flex justify-center items-center cursor-pointer"
              onClick={onClose}
            >
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" /></svg>
            </button>
          </div>
          {/* Modal body */}
          <div className="space-y-4 h-[60vh] overflow-y-auto bg-white px-4 pb-2 pt-6 rounded-b-2xl">
            {allUsers.map((user) => (
              <div
                key={user._id}
                className={`flex items-center gap-4 p-3 border-b border-gray-100 rounded-lg transition cursor-pointer shadow-sm hover:bg-gray-50 ${tempSelectedUsers.includes(user._id) ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-200' : ''}`}
                onClick={() => toggleUserSelection(user._id)}
              >
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-sm object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-black">
                    {user.name}
                  </p>
                  <p className="text-[13px] text-gray-500">{user.email}</p>
                </div>
                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onClick={e => e.stopPropagation()}
                  readOnly
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4 pt-4 bg-white rounded-b-2xl px-4 pb-5">
            <button className="card-btn" onClick={onClose}>
              CANCEL
            </button>
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow" onClick={handleAssign}>
              DONE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal; 