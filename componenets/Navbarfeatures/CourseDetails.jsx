import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axiosClient from "../../src/utils/axiosClient";
import {
  FaChalkboardTeacher,
  FaRupeeSign,
  FaClock,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const viterazorpaykeyid = import.meta.env.VITE_RAZORPAY_KEY_ID;

  useEffect(() => {
    fetchData();
    loadRazorpayScript();
  }, [id]);

  // In CourseDetails.jsx

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!user?._id) return; // Skip if no user logged in

      try {
        const response = await axiosClient.post("/premium/premiumdetails", {
          userid: user._id,
        });

        const purchasedCourses = response.data.courses;
        const isPurchased = purchasedCourses.some(
          (course) => course._id === id
        );

        if (isPurchased) {
          navigate("/mycourses");
        }
      } catch (err) {
        console.error("Error checking purchase status:", err);
        // Optionally show error notification to user
      }
    };

    checkPurchaseStatus();
  }, [id, navigate, user]);
  const Datasave = async () => {
    try {
      const reply = {
        userId: user._id,
        courses: id,
      };
      console.log(reply);
      const response = await axiosClient.post("/premium/premiumsave", reply);
      console.log(response);
      setLoading(true);
      navigate("/mycourses");
      setLoading(false);
    } catch (err) {
      console.error(
        "Error saving premium data:",
        err.response?.data || err.message
      );
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/course/getCourse/${id}`);
      setCourse(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load course details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyClick = async () => {
    if (!id) return;

    try {
      setProcessingId(id);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const response = await axiosClient.post(`/course/courseid/${id}`);

      const options = {
        key: viterazorpaykeyid,
        amount: response.data.order.amount,
        currency: "INR",
        order_id: response.data.order.id,
        name: course.CourseName,
        description: `Purchase of ${course.CourseName}`,
        image: course.CourseThumbnail || "",
        handler: async (razorpayResponse) => {
          await verifyPayment(razorpayResponse);
        },
        prefill: {
          name: user?.firstName || "Customer",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            setProcessingId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed:", err);
      alert("Failed to initialize payment");
      setProcessingId(null);
    }
  };

  const verifyPayment = async (razorpayResponse) => {
    try {
      await axiosClient.post("/goodies/paymentverify", {
        productId: id,
        order_id: razorpayResponse.razorpay_order_id,
        payment_id: razorpayResponse.razorpay_payment_id,
        signature: razorpayResponse.razorpay_signature,
      });

      setShowThankYouModal(true);
    } catch (error) {
      console.error("Verification error:", error);
      alert("Error verifying payment");
    } finally {
      setProcessingId(null);
    }
  };

  const closeThankYouModal = () => {
    setShowThankYouModal(false);
    Datasave();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff] flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Error Loading Course
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff] flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md">
          <div className="text-gray-500 text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist or may have been
            removed.
          </p>
          <button
            onClick={() => navigate(-1)}
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
      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You!
              </h2>
              <p className="text-gray-700 mb-6">
                You've successfully enrolled in{" "}
                <span className="font-semibold">{course.CourseName}</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeThankYouModal}
                  className="flex-1 bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg"
                >
                  Keep Learning
                </button>
                <button
                  onClick={() => navigate("/my-courses")}
                  className="flex-1 border border-gray-300 text-gray-900 font-medium py-3 px-6 rounded-lg"
                >
                  My Courses
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <div className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-medium mb-6"
        >
          <FaArrowLeft className="text-sm" />
          Back to Courses
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Course Details */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Course Thumbnail */}
                <div className="sm:w-1/3 flex-shrink-0">
                  <div className="relative pt-[100%] bg-gradient-to-r from-indigo-200 to-purple-200 rounded-xl overflow-hidden">
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
                </div>

                {/* Course Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {course.CourseName}
                    </h1>
                    <div className="flex items-center gap-2 bg-indigo-100 px-4 py-1.5 rounded-full">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < 4 ? "text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-indigo-800 font-medium">4.8</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">
                    {course.CourseDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FaChalkboardTeacher className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Mentor</p>
                        <p className="font-medium text-gray-900">
                          {course.CourseMentor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FaClock className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Validity</p>
                        <p className="font-medium text-gray-900">
                          {course.validityDays >= 365
                            ? `${(course.validityDays / 365).toFixed(1)} years`
                            : `${course.validityDays} days`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Enrolled</p>
                        <p className="font-medium text-gray-900">
                          1,250+ students
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Modules</p>
                        <p className="font-medium text-gray-900">12 modules</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      What You'll Learn
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Master core concepts and techniques",
                        "Build real-world projects",
                        "Get personalized feedback",
                        "Develop industry-relevant skills",
                        "Join a supportive community",
                        "Prepare for career advancement",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Course Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 mt-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Course Curriculum
              </h2>

              <div className="space-y-4">
                {[1, 2, 3, 4].map((module) => (
                  <div
                    key={module}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        Module {module}: Introduction to Concepts
                      </h3>
                      <span className="text-sm text-gray-500">
                        6 lectures • 45 min
                      </span>
                    </div>
                    <div className="bg-white p-4">
                      <ul className="space-y-3">
                        {[1, 2, 3].map((lecture) => (
                          <li
                            key={lecture}
                            className="flex items-center justify-between py-2 border-b border-gray-100"
                          >
                            <div className="flex items-center">
                              <svg
                                className="h-5 w-5 text-indigo-500 mr-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-gray-700">
                                Lecture {lecture}: Important Concepts
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              15 min
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Pricing & Action */}
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 sm:p-8 text-white"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="text-4xl font-bold flex items-center justify-center">
                  <FaRupeeSign className="text-2xl mr-1" />
                  {course.CoursePrice}
                </div>
                <p className="text-indigo-200">One-time payment</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-400 mr-3 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{course.validityDays} days access</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-400 mr-3 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Certificate of completion</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-400 mr-3 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Downloadable resources</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-400 mr-3 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Q&A with instructor</span>
                </li>
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyClick}
                disabled={processingId === id}
                className={`w-full bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg ${
                  processingId === id ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {processingId === id ? "Processing..." : "Enroll Now"}
              </motion.button>

              <p className="text-center text-indigo-200 mt-4 text-sm">
                30-day money-back guarantee
              </p>
            </motion.div>

            {/* Instructor Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 mt-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About the Instructor
              </h2>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 text-xl font-bold">
                  {course.CourseMentor.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {course.CourseMentor}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Senior Developer & Educator
                  </p>
                  <p className="text-gray-700 text-sm">
                    With over 10 years of industry experience,{" "}
                    {course.CourseMentor.split(" ")[0]} has helped thousands of
                    students master modern development techniques.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Buy Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total</p>
            <p className="font-bold text-xl flex items-center">
              <FaRupeeSign className="text-base mr-1" />
              {course.CoursePrice}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBuyClick}
            disabled={processingId === id}
            className={`bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg ${
              processingId === id ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {processingId === id ? "Processing..." : "Enroll Now"}
          </motion.button>
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

export default CourseDetails;
