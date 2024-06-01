import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import EmployeeRegister from "./pages/employeeRegister";
import Employee from "./pages/employee";
import NotFound from "./pages/404";
import { useSelector } from "react-redux";
import EmployeeDetails from "./pages/employeeDetails";
import Hours from "./pages/hours";
import Shop from "./pages/shop";
import VideoUpload from "./pages/employee-lead/videoUpload";
import VideoGallery from "./pages/employee/videoGallery";
import PrivateRoutes from "./middlewares/PrivateRoutes";
import Unauthorized from "./pages/unauthorized";
import EmployeeLeadDashboard from "./pages/employee-lead/employeeDashboard";
import DashboardEmployee from "./pages/employee/dashboard";
import EmployeeList from "./pages/employee-lead/employeeList";
import MentorRegistration from "./pages/employee-lead/MentorRegistration";
import MenteeRegistration from "./pages/employee/MenteeRegistration";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PrivateRoutes allowedRoles={["admin-hr"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee-register" element={<EmployeeRegister />} />
          <Route path="/employee" element={<Employee />} />
          <Route
            path="/employee-details/:emp_id"
            element={<EmployeeDetails />}
          />
          <Route path="/hours" element={<Hours />} />
          <Route path="/shop" element={<Shop />} />
        </Route>
        <Route element={<PrivateRoutes allowedRoles={["employee_lead"]} />}>
          <Route
            path="/employee-lead-dashboard"
            element={<EmployeeLeadDashboard />}
          />
          <Route path="/department-employee" element={<EmployeeList />} />
          <Route path="/video-upload" element={<VideoUpload />} />
          <Route path="/mentor" element={<MentorRegistration />} />
        </Route>
        <Route element={<PrivateRoutes allowedRoles={["employee"]} />}>
          <Route path="/employee-dashboard" element={<DashboardEmployee />} />
          <Route path="/video-gallery" element={<VideoGallery />} />
          <Route path="/mentee" element={<MenteeRegistration />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
