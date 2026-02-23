import { Link } from "react-router-dom";
import useSidebar from "@/hooks/useSidebar";
import canStarLogo from "@/assets/images/logo/canstar-logo.svg";

const SidebarLogo = ({ menuHover }) => {
  const [collapsed, setMenuCollapsed] = useSidebar();

  return (
    <div
      className={`logo-segment flex justify-between items-center z-[9] py-6 px-4  bg-primary
      ${menuHover ? "logo-hovered" : ""}
 
      `}
    >
      <Link to="/dashboard">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="h-[45px] w-auto">
            <div className="h-full flex items-center">
              <img
                src={canStarLogo}
                alt="Canstar Lights"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <div
          onClick={() => setMenuCollapsed(!collapsed)}
          className={`h-4 w-4 rounded-full transition-all duration-150 cursor-pointer
          ${
            collapsed
              ? "border-[1px] border-white/60 hover:border-white border-[#d42d27]"
              : "ring-1 ring-inset ring-offset-[4px] ring-white bg-white ring-offset-[#d42d27]"
          }
          `}
        ></div>
      )}
    </div>
  );
};

export default SidebarLogo;
