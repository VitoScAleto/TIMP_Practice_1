import { Outlet } from "react-router-dom";
import InspectorNavbar from "./InspectorNavbar";

const InspectorPanelMain = () => {
  return (
    <div>
      <InspectorNavbar />
      <Outlet />
    </div>
  );
};

export default InspectorPanelMain;
