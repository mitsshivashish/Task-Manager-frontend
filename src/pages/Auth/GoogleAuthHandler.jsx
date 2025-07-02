import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";
import { UserContext } from "../../context/userContext";

export default function GoogleAuthHandler() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [orgCode, setOrgCode] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [showOrgForm, setShowOrgForm] = useState(false);

  // Parse query params and decide flow
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const organizationCode = params.get("organizationCode");
    if (!token) {
      setError("Google authentication failed.");
      return;
    }
    setToken(token);
    // If org code is set, fetch user and redirect
    if (organizationCode && organizationCode !== "00000000000000") {
      // Store token
      sessionStorage.setItem("token", token);
      // Fetch user details from DB
      axios.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((userRes) => {
          sessionStorage.setItem("user", JSON.stringify(userRes.data));
          updateUser({ ...userRes.data, token });
          if (userRes.data.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        })
        .catch((err) => {
          setError("Failed to fetch user details.");
        });
    } else {
      setShowOrgForm(true);
    }
  }, [navigate, updateUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        API_PATHS.AUTH.UPDATE_ROLE_ORG,
        {
          organizationCode: orgCode,
          adminInviteToken: adminToken || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Store token
      sessionStorage.setItem("token", res.data.token);
      // Fetch user details from DB
      const userRes = await axios.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });
      sessionStorage.setItem("user", JSON.stringify(userRes.data));
      updateUser({ ...userRes.data, token: res.data.token });
      // Redirect to dashboard based on role
      if (userRes.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update info.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!showOrgForm) return null;

  // Always show org code form after Google auth if needed
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your 14-digit Organization Code"
            value={orgCode}
            onChange={(e) => setOrgCode(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            maxLength={14}
            minLength={14}
            pattern="\d{14}"
          />
          <input
            type="text"
            placeholder="Admin Invite Token (optional)"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </div>
  );
} 