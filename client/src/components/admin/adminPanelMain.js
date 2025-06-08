import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminPanelMain = () => {
  return (
    <div>
      <AdminNavbar />
      <Outlet />
    </div>
  );
};

export default AdminPanelMain;
