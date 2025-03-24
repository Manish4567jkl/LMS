import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import useUserStore from "../store/useUserStore.js";
import { useSocket } from "../utils/socket.js"; // Import socket connection

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { getTeacherProfile, teacher } = useUserStore();
  const socket = useSocket(); // Get the socket instance
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    getTeacherProfile();

    // Listen for incoming video call requests
    socket.on("incoming-call", ({ roomId, studentName }) => {
      setIncomingCall({ roomId, studentName });
    });

    return () => {
      socket.off("incoming-call");
    };
  }, []);

  // Function to accept and join the call
  const acceptCall = () => {
    if (incomingCall) {
      navigate(`/videocall/${incomingCall.roomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E6FA] via-[#D6F0F7] to-[#FDE5E5] p-6">
      {/* Header */}
      <div className="flex justify-between items-center p-5 bg-white shadow-md rounded-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-indigo-800">📚 Teacher Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-300 rounded-full border border-gray-400 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-800">
              {teacher?.username?.charAt(0).toUpperCase() || "?"}
            </span>
          </div>
          <Button
            onClick={() => logout()}
            className="bg-indigo-500 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 
            hover:bg-indigo-600 hover:shadow-[0_0_15px_#6366f1] hover:scale-105"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Call Notification Popup */}
      {incomingCall && (
        <div className="fixed top-5 right-5 bg-white shadow-lg rounded-xl p-4 border border-green-300">
          <p className="text-gray-800 font-semibold">
            📞 {incomingCall.studentName} is calling...
          </p>
          <Button onClick={acceptCall} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">
            Accept Call
          </Button>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 bg-white shadow-lg rounded-xl border border-blue-300 hover:shadow-blue-500 hover:scale-105 transition duration-300">
          <Link to="/api/trackAllStudents">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">🎯 Track Students</h2>
            <p className="text-gray-600">Monitor student progress.</p>
          </Link>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-xl border border-teal-300 hover:shadow-teal-500 hover:scale-105 transition duration-300">
          <h2 className="text-xl font-semibold text-teal-800 mb-2">📝 View Tasks</h2>
          <p className="text-gray-600">Assign and manage tasks.</p>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-xl border border-purple-300 hover:shadow-purple-500 hover:scale-105 transition duration-300">
          <Link to="/teacherDashboard/manage_course">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">📖 Manage Course</h2>
            <p className="text-gray-600">Oversee your courses.</p>
          </Link>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-xl border border-indigo-300 hover:shadow-indigo-500 hover:scale-105 transition duration-300">
          <Link to="/teacherDashboard/create_course">
            <h2 className="text-xl font-semibold text-indigo-800 mb-2">🚀 Create Course</h2>
            <p className="text-gray-600">Build new courses.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
