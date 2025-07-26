import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import axiosClient from "../../src/utils/axiosClient";
import { FaChalkboardTeacher, FaRupeeSign, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import Footer from "../../src/pages/Footer";

function Explorecourses() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const navigate=useNavigate()

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/course/Allcourses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = (courseId) => {
    navigate(`/explore/${courseId}`)
  };
 
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#C7D9DD] via-[#ADB2D4] to-[#EEF1DA] text-gray-800 overflow-x-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-32 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-300/30 via-blue-300/20 to-transparent rounded-full blur-3xl z-0 pointer-events-none animate-float" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-pink-300/30 via-purple-200/20 to-transparent rounded-full blur-2xl z-0 pointer-events-none animate-float delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-[450px] h-[450px] bg-gradient-to-r from-yellow-300/20 to-red-300/10 rounded-full blur-3xl z-0 pointer-events-none animate-float delay-1500" />
      <div className="absolute top-40 right-1/3 w-[300px] h-[300px] bg-gradient-to-r from-emerald-300/20 to-blue-300/10 rounded-full blur-3xl z-0 pointer-events-none animate-float delay-500" />
      
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/40"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${15 + Math.random() * 15}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `scale(${0.5 + Math.random()})`
          }}
        />
      ))}

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-pink-500 mb-4 drop-shadow">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Discover our expertly crafted courses designed to boost your skills and career
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">No courses found</div>
            <button className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#3a9bed] hover:to-[#33a0a6] text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              New Course will be Added Soon
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white/50 backdrop-blur-lg border border-white/30 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                {/* Image container with 16:9 aspect ratio */}
                <div className="relative pt-[56.25%] bg-gradient-to-r from-indigo-200 to-purple-200">
                  {course.CourseThumbnail ? (
                    <img
                      src={course.CourseThumbnail}
                      alt={course.CourseName}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl text-indigo-500 font-bold">
                        {course.CourseName.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 truncate">
                      {course.CourseName}
                    </h3>
                    <span className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white text-sm font-semibold px-3 py-1 rounded-full">
                      ₹{course.CoursePrice}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-6 line-clamp-3 h-18">
                    {course.CourseDescription}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center text-sm text-gray-700">
                      <FaChalkboardTeacher className="text-indigo-500 mr-2" />
                      <span>{course.CourseMentor}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {course.validityDays >= 365
                          ? `${(course.validityDays / 365).toFixed(1)} years`
                          : `${course.validityDays} days`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleExplore(course._id)}
                    className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#3a9bed] hover:to-[#33a0a6] w-full text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Explore More
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animated CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
      `}</style>

      <Footer/>
    </div>
  );
}

export default Explorecourses;