import React, { useContext, useState, useEffect } from "react";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/ApiPaths";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { user, updateUser, loading } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Sync local state with user context
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Reset image state when user.profileImageUrl changes
  useEffect(() => {
    setImage(null);
  }, [user?.profileImageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setError("");
    setSuccess("");
    // Require image
    if (!image && !user?.profileImageUrl) {
      setError("Profile image is required.");
      setLoadingUpdate(false);
      return;
    }
    try {
      let profileImageUrl = user?.profileImageUrl;
      // If a new image is selected, upload it first
      if (image && image instanceof File) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadRes = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        profileImageUrl = uploadRes.data?.imageUrl;
      }
      // Update user details
      const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name,
        email,
        profileImageUrl,
      });
      updateUser(res.data);
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        const role = res.data?.role || user?.role;
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Show loading while user data is being fetched
  if (loading || !user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProfilePhotoSelector image={image || user?.profileImageUrl} setImage={setImage} />
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          type="text"
        />
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
          disabled={loadingUpdate}
        >
          {loadingUpdate ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile; 