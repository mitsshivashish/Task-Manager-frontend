import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Dashboard from './pages/Admin/Dashboard'
import ManageUsers from './pages/Admin/ManageUsers'
import MyTasks from './pages/User/MyTasks'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/CreateTask'
import ViewTaskDetails from './pages/User/ViewTaskDetails'
import PrivateRoute from './routes/PrivateRoute'
import UserProvider, { UserContext } from './context/userContext'
import { Toaster } from "react-hot-toast";
import UserDashboard from './pages/User/DashBoard'
import UpdateProfile from './pages/User/UpdateProfile'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import VerifyOTP from './pages/Auth/VerifyOTP'
import GoogleAuthHandler from './pages/Auth/GoogleAuthHandler'

const App = () => {
  return (
    <UserProvider>  
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/signup' element={<SignUp></SignUp>}></Route> 
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/verify-otp' element={<VerifyOTP />} />
          <Route path='/google-auth' element={<GoogleAuthHandler />} />

          {/* {Admin Routes} */}
          <Route element={<PrivateRoute allowedRoles={['admin']}></PrivateRoute>}>
            <Route path='/admin/dashboard' element={<Dashboard></Dashboard>}></Route>
            <Route path='/admin/tasks' element={<ManageTasks></ManageTasks>}></Route>
            <Route path='/admin/create-task' element={<CreateTask></CreateTask>}></Route>
            <Route path='/admin/users' element={<ManageUsers></ManageUsers>}></Route>
            <Route path='/admin/update-profile' element={<UpdateProfile />}></Route>
          </Route>

          {/* {User Routes} */}
          <Route element={<PrivateRoute allowedRoles={['User']}></PrivateRoute>}>
            <Route path='/user/dashboard' element = {<UserDashboard></UserDashboard>}></Route>
            <Route path='/user/tasks' element = {<MyTasks></MyTasks>}></Route>
            <Route path='/user/task-details/:id' element = {<ViewTaskDetails></ViewTaskDetails>}></Route>
            <Route path='/user/update-profile' element={<UpdateProfile />}></Route>
          </Route>
          <Route path='/' element = {<Root></Root>}></Route>
        </Routes>
      </Router>
    </div>

    <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  )
}

export default App

const Root = () => {
  const {user , loading} = useContext(UserContext);

  if (loading) {
    return <Outlet></Outlet>
  }

  if (!user) {
    return <Navigate to="/login"></Navigate>;
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard"></Navigate> : <Navigate to="/user/dashboard"></Navigate>
}
