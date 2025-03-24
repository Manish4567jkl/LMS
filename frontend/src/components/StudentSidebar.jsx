import React from "react";
import { Link } from "react-router-dom";
import useCourseStore from "../store/useCourseStore.js";
import useAuthStore from "../store/useAuthStore.js";

const StudentSidebar = ({ onVideoCallToggle }) => {
  const { getCourses } = useCourseStore();
  const { logout } = useAuthStore();

  return (
    <aside className="w-64 fixed h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col items-center py-6">
      <nav className="flex flex-col space-y-6 text-center w-full">
        <div className="hover:bg-blue-500 p-4 rounded-lg cursor-pointer transition">
          <Link to="/studentDashboard">
            <button className="w-full font-semibold">Dashboard</button>
          </Link>
        </div>
        <div className="hover:bg-blue-500 p-4 rounded-lg cursor-pointer transition">
          <Link to="/grades">
            <button className="w-full font-semibold">Grades</button>
          </Link>
        </div>
        <div className="hover:bg-blue-500 p-4 rounded-lg cursor-pointer transition">
          <Link to="/courses" onClick={() => getCourses()}>
            <button className="w-full font-semibold">Courses</button>
          </Link>
        </div>
        <div className="hover:bg-blue-500 p-4 rounded-lg cursor-pointer transition">
          <Link to="/studentDashboard/studentProfile">
            <button className="w-full font-semibold">Profile</button>
          </Link>
        </div>

        {/* Video Call Button */}
        <div className="hover:bg-green-500 p-4 rounded-lg cursor-pointer transition">
          <button className="w-full font-semibold" onClick={onVideoCallToggle}>
            Video Call 📹
          </button>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={() => logout()}
          className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25h6.75a2.25 2.25 0 002.25-2.25V15m3-3h-12m6 6l6-6m-6-6l6 6"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
