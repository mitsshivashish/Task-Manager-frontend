import React, { useContext, useEffect, useState } from "react";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const [showOrgCode, setShowOrgCode] = useState(false);
  const [orgCode, setOrgCode] = useState("");
  const [orgCodeLoading, setOrgCodeLoading] = useState(false);
  const [orgCodeError, setOrgCodeError] = useState("");

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    if (route === "/admin/org-code") {
      setShowOrgCode(true);
      setOrgCode("");
      fetchOrgCode();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const fetchOrgCode = async () => {
    setOrgCodeLoading(true);
    setOrgCodeError("");
    try {
      const res = await fetch("/api/org-code");
      const data = await res.json();
      if (data.orgCode) {
        setOrgCode(data.orgCode);
      } else {
        setOrgCodeError("Organization code is not set in the environment.");
      }
    } catch (err) {
      setOrgCodeError("Failed to fetch organization code.");
    } finally {
      setOrgCodeLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }

    return () => {};
  }, [user]);
  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            src={user?.profileImageUrl || ""}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        </div>

        {user?.role === "admin" && (
          <>
            <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
              Admin
            </div>
            <button
              className="mt-2 text-[10px] font-medium text-white bg-blue-500 px-3 py-0.5 rounded transition hover:bg-blue-600"
              style={{letterSpacing: '1px'}}
              onClick={() => {
                setShowOrgCode(true);
                setOrgCode("");
                fetchOrgCode();
              }}
            >
              Show Organization Code
            </button>
          </>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>

        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu == item.label
              ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
              : ""
          } py-3 px-6 mb-3 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
      {/* Organization Code Modal */}
      {showOrgCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowOrgCode(false)}
            >
              &times;
            </button>
            <div className="text-2xl mb-2">🏢 Organization Code</div>
            {orgCodeLoading ? (
              <div className="text-blue-500 text-base font-semibold mb-2">Loading...</div>
            ) : orgCodeError ? (
              <div className="text-red-500 text-base font-semibold mb-2">{orgCodeError}</div>
            ) : orgCode ? (
              <div className="text-lg font-mono tracking-widest mb-2 text-blue-600 bg-blue-50 rounded px-4 py-2 inline-block">
                {orgCode}
              </div>
            ) : null}
            <div className="text-gray-500 text-sm">Share this code with new members to let them join your organization.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideMenu;
