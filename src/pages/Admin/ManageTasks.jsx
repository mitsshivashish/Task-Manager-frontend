import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS, BASE_URL } from '../../utils/ApiPaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../components/Cards/TaskCard'
import Modal from '../../components/Modal'
import TaskCardSkeleton from '../../components/Cards/TaskCardSkeleton'

const ManageTasks = () => {

  const [allTasks , setAllTasks] = useState([])
  const [tabs , setTabs] = useState([])
  const [filterStatus , setFilterStatus] = useState("All")
  const [checkpointStats, setCheckpointStats] = useState([]);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedUserStats, setSelectedUserStats] = useState(null);
  const [statsTaskTitle, setStatsTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const getAllTasks =  async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS  , {
        params : {
          status : filterStatus === "All" ? "" : filterStatus ,
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])

      //Map statusSummary data with fixed labels and order 
      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        {label: "All", count : statusSummary.all || 0},
        {label: "In Progress", count : statusSummary.inProgressTasks || 0},
        {label: "Completed", count : statusSummary.completedTasks || 0},
        {label : "Pending" , count : statusSummary.pendingTasks || 0 }
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching Tasks : " , error)
    } finally {
      setLoading(false);
    }
  };

  const handleClicks = (taskData) => {
    navigate(`/admin/create-task` , {state : {taskId : taskData._id}})
  };

  //download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading details:", error);
      toast.error("Failed to download details. Please try again.");
    }
  };

  const fetchCheckpointStats = async (taskId, taskTitle) => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_CHECKPOINT_STATS(taskId));
      setCheckpointStats(response.data.stats);
      setStatsTaskTitle(taskTitle);
      setShowStatsModal(true);
      console.log('Fetched checkpointStats:', response.data.stats);
    } catch (error) {
      console.error('Error fetching checkpoint stats:', error);
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  } , [filterStatus])
  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

            <button className="flex lg:hidden download-btn " onClick={handleDownloadReport}><LuFileSpreadsheet className='text-lg '></LuFileSpreadsheet>Download Report</button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs tabs = {tabs} activeTab = {filterStatus} setActiveTab = {setFilterStatus}></TaskStatusTabs>
             <button className="hidden lg:flex download-btn" onClick={handleDownloadReport}>
              <LuFileSpreadsheet className='text-lg'>
              </LuFileSpreadsheet>  Download Report
             </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {loading ? (
            <TaskCardSkeleton count={6} />
          ) : (
            [...allTasks]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item,index) => (
              <div key={item._id}>
                <TaskCard
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => {
                    handleClicks(item)
                  }}
                />
                {/* Per-user checkpoint completion UI */}
                <div className="mt-2 px-4">
                  <button
                    className="flex items-center gap-2 text-sm font-semibold border border-blue-500 text-blue-600 rounded-lg px-3 py-1.5 bg-white hover:bg-blue-50 transition shadow-sm"
                    onClick={() => fetchCheckpointStats(item._id, item.title)}
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
                    View Task Done By User
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Modal for per-user checkpoint stats */}
        <Modal isOpen={showStatsModal} onClose={() => { setShowStatsModal(false); setSelectedUserStats(null); }} title={`Task Done By User${statsTaskTitle ? ` - ${statsTaskTitle}` : ''}`} closeOnOutsideClick={true}>
          {selectedUserStats ? (
            <div>
              <div className="flex items-center gap-3 mb-4 bg-white rounded-lg shadow border border-gray-200 p-3">
                <img src={selectedUserStats.user.profileImageUrl} alt={selectedUserStats.user.name} className="w-12 h-12 rounded-full border-2 border-blue-200" />
                <div>
                  <div className="font-semibold text-lg text-blue-900">{selectedUserStats.user.name}</div>
                  <div className="text-xs text-gray-700 font-medium">{selectedUserStats.user.email}</div>
                </div>
              </div>
              <div className="mb-2 text-sm font-medium text-gray-700">Checkpoints Done:</div>
              <ul className="pl-5 bg-blue-50 rounded-lg py-2 px-3 mt-2">
                {selectedUserStats.checkpoints.map((cp, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-blue-800 text-[15px] font-medium mb-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {cp.text}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold"
                  onClick={() => setSelectedUserStats(null)}
                >
                  Back to Users
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-2 text-sm font-semibold text-white">Click a user below to see their checkpoints:</div>
              {checkpointStats.length === 0 && <div className="text-gray-500 text-xs">No checkpoints completed yet.</div>}
              <div className="space-y-3">
                {checkpointStats.map((stat, idx) => (
                  <div
                    key={stat.user._id}
                    className="flex items-center gap-3 cursor-pointer bg-white rounded-lg shadow border border-gray-200 p-3 hover:bg-blue-50 transition"
                    onClick={() => setSelectedUserStats(stat)}
                  >
                    <img src={stat.user.profileImageUrl} alt={stat.user.name} className="w-10 h-10 rounded-full border-2 border-blue-200" />
                    <div className="flex-1">
                      <div className="font-semibold text-blue-900">{stat.user.name}</div>
                      <div className="text-xs text-gray-700 font-medium">{stat.user.email}</div>
                    </div>
                    <div className="text-xs text-blue-600 font-semibold">{stat.count} done</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default ManageTasks
