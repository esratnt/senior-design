import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = ({ allowedRoles }) => {
  const { isAuth, role } = useSelector((state) => state.auth);

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
