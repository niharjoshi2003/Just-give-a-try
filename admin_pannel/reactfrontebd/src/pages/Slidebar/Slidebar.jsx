import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Slidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { text: "Add Bill", path: "/" },
    { text: "Billing and Payment", path: "/billing" },
    { text: "Reports and Analysis", path: "/report" },
    { text: "Settings", path: "/setting" },
  ];

  return (
    <div
      className={`flex h-dvh ${isCollapsed ? "w-20" : "w-64"}
        bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out sticky top-0`}
    >
      <div className="flex-1 flex flex-col">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-50 rounded-full bg-indigo-600 p-1.5
             hover:bg-indigo-700 transition-colors w-8 h-8 flex items-center justify-center"
        >
          <span className="text-sm font-bold">{isCollapsed ? "→" : "←"}</span>
        </button>

        <div className="flex items-center p-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-sm">X</span>
          </div>
          {!isCollapsed && (
            <span className="ml-3 font-bold text-xl">Just Give a Try</span>
          )}
        </div>

        <nav className="mt-6 px-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 mb-2 rounded-lg 
                hover:bg-gray-800 transition-colors group relative
                ${isActive ? "bg-indigo-700 text-white" : ""}
              `}
            >
              <div
                className="w-2 h-2 rounded-sm bg-gray-400 group-hover:bg-indigo-500
                transition-colors"
              />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.text}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-bold">X</span>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <p className="font-medium">Xerox Centre</p>
                {/* <p className="text-sm text-gray-500">भाऊ</p> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slidebar;
