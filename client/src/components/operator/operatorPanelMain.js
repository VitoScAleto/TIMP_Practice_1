import { Outlet } from "react-router-dom";
import OperatorNavbar from "./OperatorNavbar";

const OperatorPanelMain = () => {
  return (
    <div>
      <OperatorNavbar />
      <Outlet />
    </div>
  );
};

export default OperatorPanelMain;
