import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import useAuthStore from './store/useAuthStore';
import ProtectedRoute from './components/ProtectedRoute';
import Home from "./pages/Home";
import StudentLoginSignup from "./pages/StudentLoginSignup";
import TeacherLoginSignup from "./pages/TeacherLoginSignup";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import VideoCall from "./components/VideoCall";  // ✅ Import Video Call Page

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
                    
                    <Route 
                        path="/api/studentDashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/api/teacherDashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['teacher']}>
                                <TeacherDashboard />
                            </ProtectedRoute>
                        } 
                    />

                    {/* ✅ Add the missing route for Video Call */}
                    <Route path="/video-call" element={<VideoCall />} />  
                </Routes>
            </Router>
            <ToastContainer position='top-center' />
        </>
    );
}

export default App;
