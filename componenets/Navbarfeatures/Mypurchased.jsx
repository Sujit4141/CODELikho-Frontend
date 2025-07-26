// src/pages/MyPurchased.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../src/utils/axiosClient";
import { 
  FaChalkboardTeacher, 
  FaClock, 
  FaStar, 
  FaPlayCircle, 
  FaRupeeSign, 
  FaBookOpen, 
  FaTrophy 
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ 
    totalCourses: 0, 
    completedLessons: 0, 
    learningTime: 0 
  });
  const [purchasedDate, setPurchasedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Fetch purchased courses
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.post('/premium/premiumdetails', { 
          userid: user._id 
        });
        
        setCourses(response.data.courses);
        setPurchasedDate(response.data.purchasedDate);
        
        // Calculate stats
        const totalCourses = response.data.courses.length;
        const completedLessons = totalCourses * 0; // Example calculation
        const learningTime = totalCourses * 0; // Example calculation in hours
        
        setStats({
          totalCourses,
          completedLessons,
          learningTime
        });
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load your courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user._id) {
      fetchPurchasedCourses();
    }
  }, [user]);



  const daysSincePurchase = (purchaseDate) => {
    const purchase = new Date(purchaseDate);
    const today = new Date();
    const diffTime = Math.abs(today - purchase);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const getProgressPercentage = () => {
    return Math.floor(Math.random() * 0) + 0; // Random progress for demo
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff] flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Courses</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff] flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md">
          <div className="text-indigo-500 text-5xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Courses Yet</h2>
          <p className="text-gray-600 mb-6">You haven't enrolled in any courses yet. Explore our catalog to get started!</p>
          <button 
            onClick={() => navigate('/explorecourses')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff] pb-20">
      <Navbar />
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="pt-24 pb-12 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          My Purchased Courses
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-700 max-w-3xl mx-auto"
        >
          Continue learning from where you left off,  <span className="font-bold text-red-500 text-2xl  ">{user?.firstName || "Learner"}</span>
        </motion.p>
      </div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 mb-12"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Stats</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center">
                  <FaBookOpen className="text-white text-xl" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-700">{stats.totalCourses}</div>
                  <div className="text-gray-700">Courses Enrolled</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center">
                  <FaPlayCircle className="text-white text-xl" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{stats.completedLessons}</div>
                  <div className="text-gray-700">Lessons Completed</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center">
                  <FaClock className="text-white text-xl" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{stats.learningTime}h</div>
                  <div className="text-gray-700">Learning Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3"
        >
          <FaTrophy className="text-amber-500" />
          Your Courses
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Course Thumbnail */}
              <div className="relative h-48">
                {course.CourseThumbnail ? (
                  <img 
                    src={course.CourseThumbnail} 
                    alt={course.CourseName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{course.CourseName.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{course.CourseName}</h3>
                </div>
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  Purchased
                </div>
              </div>
              
              {/* Course Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaChalkboardTeacher className="text-indigo-600" />
                    <span className="font-medium text-gray-900">{course.CourseMentor}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-indigo-100 px-3 py-1 rounded-full">
                    <FaStar className="text-amber-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-2">{course.CourseDescription}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Purchased {daysSincePurchase(purchasedDate)} days ago
                    </span>
                  </div>
                  <div className="bg-indigo-100 text-indigo-800 font-medium px-3 py-1 rounded-full text-sm">
                    <FaRupeeSign className="inline mr-1" />
                    {course.CoursePrice}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Course Progress</span>
                    <span>{getProgressPercentage()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium py-2 px-4 rounded-lg text-center hover:opacity-90 transition-opacity"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/course/${course._id}/content`)}
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
                    title="Continue Learning"
                  >
                    <FaPlayCircle className="text-white text-xl" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default MyCourses;