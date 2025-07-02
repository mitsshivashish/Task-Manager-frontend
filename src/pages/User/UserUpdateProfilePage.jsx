import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import UpdateProfile from "./UpdateProfile";

const UserUpdateProfilePage = () => (
  <DashboardLayout activeMenu="Update Profile">
    <UpdateProfile />
  </DashboardLayout>
);

export default UserUpdateProfilePage; 