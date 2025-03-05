import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import useAuthStore from './store/useAuthStore';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from "./pages/Home";
import StudentLoginSignup from "./pages/StudentLoginSignup";
import TeacherLoginSignup from "./pages/TeacherLoginSignup";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import MentorDashboard from "./pages/MentorVideoCall";
import MenteeDashboard from "./pages/MenteeVideoCall";
import Grade from './pages/Grade';
import Courses from './pages/Courses';
import StudentProfile from "./pages/StudentProfile";
import ManageCoursePage from './pages/ManageCoursePage';
import CreateCoursePage from './pages/CreateCoursePage';
import CourseDetails from './components/CourseDetails';
import UpdateCoursePage from './pages/UpdateCoursePage';
import TrackAllStudents from './pages/TrackAllStudents';

// Video Calling Pages
import VideoCall from "./components/VideoCall";
import MentorVideoCall from "./pages/MentorVideoCall";
import MenteeVideoCall from "./pages/MenteeVideoCall";

function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/api/studentLoginSignup" element={<StudentLoginSignup />} />
                    <Route path="/api/teacherLoginSignup" element={<TeacherLoginSignup />} />

                    {/* Protected Routes */}
                    <Route 
                        path="/api/studentDashboard" 
                        element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} 
                    />
                    <Route 
                        path="/api/teacherDashboard" 
                        element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} 
                    />
                    <Route 
                        path="/api/mentorDashboard" 
                        element={<ProtectedRoute allowedRoles={['mentor']}><MentorDashboard /></ProtectedRoute>} 
                    />
                    <Route 
                        path="/api/menteeDashboard" 
                        element={<ProtectedRoute allowedRoles={['mentee']}><MenteeDashboard /></ProtectedRoute>} 
                    />

                    {/* Teacher Routes */}
                    <Route path="/teacherDashboard/create_course" element={<CreateCoursePage />} />
                    <Route path="/teacherDashboard/manage_course" element={<ManageCoursePage />} />
                    <Route path="/teacherDashboard/update_course/:courseId" element={<UpdateCoursePage />} />
                    <Route path="/courseDetails/:courseId" element={<CourseDetails />} />
                    <Route path="/api/trackAllStudents" element={<TrackAllStudents />} />

                    {/* Student Routes */}
                    <Route path="/grades" element={<Grade />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/studentDashboard/studentProfile" element={<StudentProfile />} />

                    {/* ✅ New Open Video Calling Routes */}
                    <Route path="/video-call" element={<VideoCall />} />
                    <Route path="/mentor/video-call" element={<MentorVideoCall />} />
                    <Route path="/mentee/video-call" element={<MenteeVideoCall />} />
                </Routes>
            </Router>
            <ToastContainer position='top-center' />
        </>
    );
}

export default App;
