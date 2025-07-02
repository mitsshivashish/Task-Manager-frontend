import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import Modal from "../Modal";
import DeleteAlert from "../DeleteAlert";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";

const UserCard = ({userInfo, onDelete}) => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userInfo._id));
      setIsModalOpen(false);
      if (onDelete) onDelete(userInfo._id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.profileImageUrl}
            alt={`Avatar`}
            className="w-12 h-12 rounded-full border-2 border-white"
          />

          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
            {user?.role === "admin" && userInfo?.role !== "admin" && (
              <button
                className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                onClick={() => setIsModalOpen(true)}
              >
                Delete Member
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-end mt-5 px-1">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        ></StatCard>
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Delete Member?">
        <DeleteAlert
          content={`Are you sure you want to delete ${userInfo?.name}? This action cannot be undone.`}
          onDelete={handleDelete}
        />
        {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
        {deleting && <div className="text-gray-500 text-xs mt-2">Deleting...</div>}
      </Modal>
    </div>
  );
};

export default UserCard;

const StatCard = ({label , count , status}) => {

        const getStatusTagColor = () => {
            switch (status) {
                case "In Progress":
                    return "text-cyan-900 bg-cyan-100"
                    
                case "Completed":
                    return "text-indigo-900 bg-indigo-100"
            
                default:
                    return "text-violet-900 bg-violet-100"
            }
        }

        return (
            <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-2 rounded-full shadow-sm m-1 text-center`}
                style={{ boxShadow: '0 2px 8px 0 rgba(80,80,180,0.07)' }}>
                <span className="text-[13px] font-semibold">{count}</span> <br />
                <span className="whitespace-nowrap">{label}</span>
            </div>
        )
};
