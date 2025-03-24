import { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import VideoCall from "../components/VideoCall"; // Import Video Call Component
import useAuthStore from "../store/useAuthStore.js";
import Loader from "../components/Loader.jsx";
import { FiMenu, FiX } from "react-icons/fi";

const StudentDashboard = () => {
  const { user, getProfile, loading, error } = useAuthStore();
  const [userName, setUserName] = useState("");
  const [firstLetter, setFirstLetter] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false); // Video Call State

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?._id) {
        const profileData = await getProfile(user._id);
        if (profileData?.username) {
          setUserName(profileData.username);
          setFirstLetter(profileData.username.charAt(0).toUpperCase());
        }
      }
    };
    fetchProfile();
  }, [user?._id, getProfile]);

  const toggleVideoCall = () => {
    setIsVideoCallOpen(!isVideoCallOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="text-center text-red-500">
          <p>Error loading profile: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-pink-50 to-purple-100">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <StudentSidebar onVideoCallToggle={toggleVideoCall} />
      </div>

      {/* Hamburger Menu */}
      <button
        className="absolute top-5 left-5 text-gray-700 text-3xl md:hidden z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Main Content */}
      <main
        className={`flex-1 p-4 md:p-8 relative overflow-y-auto transition ${
          isVideoCallOpen ? "blur-lg pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-white bg-opacity-80 rounded-3xl shadow-lg p-6 md:p-8 mb-6 md:mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                Hello, {userName || "Student"}
              </h1>
              <p className="text-gray-600 mt-2 text-sm md:text-lg">
                Let’s make learning amazing today! ✨
              </p>
            </div>
            <div className="relative group mt-4 md:mt-0">
              <div className="relative bg-white rounded-full p-1">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white text-xl md:text-2xl font-bold">
                    {firstLetter || "S"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Other Dashboard Content */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <p className="text-gray-600">Check out your enrolled courses here!</p>
        </div>
      </main>

      {/* Full-Screen Video Call Overlay */}
      {isVideoCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <VideoCall onClose={toggleVideoCall} />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
