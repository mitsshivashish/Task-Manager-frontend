import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/ApiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../components/Cards/UserCard';
import toast from 'react-hot-toast';
import UserCardSkeleton from '../../components/Cards/UserCardSkeleton';

const ManageUsers = () => {

  const [allUsers , setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response?.data.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  //Handle download report
  const handleDownloadReport = async () => {

    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS , {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Expense details : " , error);
      toast.error("Failed to download expense reports. Please try again.");
    }
  }

  const handleUserDelete = (deletedUserId) => {
    setAllUsers((prev) => prev.filter((user) => user._id !== deletedUserId));
    toast.success('Member removed from organization');
  };

  useEffect(() =>{ 
    getAllUsers();

    return () => {};
  }, [])

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

          <button className="flex md:flex download-btn" onClick={handleDownloadReport}><LuFileSpreadsheet className='text-lg'></LuFileSpreadsheet>Download Report</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {loading ? (
            <UserCardSkeleton count={6} />
          ) : (
            allUsers.map((user) => (
              <UserCard key={user._id} userInfo={user} onDelete={handleUserDelete} />
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}

export default ManageUsers
