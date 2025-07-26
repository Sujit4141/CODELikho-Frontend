import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import axiosClient from "../../src/utils/axiosClient";
import { 
  FiEdit, FiTrash2, FiCalendar, FiAward, 
  FiActivity, FiCode, FiSettings, FiLogOut,
  FiArrowLeft, FiArrowRight, FiUser, FiBriefcase, 
  FiBook, FiTool, FiMapPin, FiMail, FiPhone, FiGlobe
} from "react-icons/fi";
import Footer from "../../src/pages/Footer";
import { useNavigate } from "react-router";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const navigate= useNavigate()
  const [activeTab, setActiveTab] = useState("profile");
  const [bio, setBio] = useState("I love solving DSA problems and building cool projects.");
  const [submissions, setSubmissions] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [streakData, setStreakData] = useState([]);
  const [badges, setBadges] = useState([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    github: "",
    linkedin: "",
    leetcode: "",
    twitter: "",
    age: "",
    phone: "",
    roleType: "",
    college: "",
    branch: "",
    skillsLearning: "",
    company: "",
    jobRole: "",
    experience: "",
    professionalSkills: "",
    location: ""
  });
  const [editStep, setEditStep] = useState(1);
  // Inside the Profile component function
const easySolved = solvedProblems.filter(problem => problem.difficulty === "easy").length;
const mediumSolved = solvedProblems.filter(problem => problem.difficulty === "medium").length;
const hardSolved = solvedProblems.filter(problem => problem.difficulty === "hard").length;
const totalSolved = solvedProblems.length;

// Calculate percentages for progress bars
const easyPercentage = totalSolved ? (easySolved / totalSolved) * 100 : 0;
const mediumPercentage = totalSolved ? (mediumSolved / totalSolved) * 100 : 0;
const hardPercentage = totalSolved ? (hardSolved / totalSolved) * 100 : 0;
  
  useEffect(() => {
    if (user) {
      fetchUserData();
      generateStreakData();
      generateBadges();
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = () => {
    const savedProfile = localStorage.getItem(`userProfile_${user._id}`);
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setUserData(profileData);
      setBio(profileData.bio || "I love solving DSA problems and building cool projects.");
    } else {
      // Initialize with user data from Redux if available
      setUserData({
        ...userData,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.emailId || "",
      });
    }
  };

  const fetchUserData = async () => {
    try {
      const submissionsRes = await axiosClient.get(`/problem/submittedProblem/${user._id}`);
      const solvedRes = await axiosClient.get("problem/problemSolvedbyUser");
      
      setSubmissions(submissionsRes.data);
      setSolvedProblems(solvedRes.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const generateStreakData = () => {
    const today = new Date();
    const data = [];
    
    for (let i = 180; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const solved = Math.random() > 0.3;
      data.push({
        date: date.toISOString().split('T')[0],
        count: solved ? Math.floor(Math.random() * 5) + 1 : 0
      });
    }
    
    setStreakData(data);
  };

  const generateBadges = () => {
    const mockBadges = [
      { id: 1, name: "First Problem Solved", icon: "🥇", date: "2023-05-15" },
      { id: 2, name: "5-Day Streak", icon: "🔥", date: "2023-06-20" },
      { id: 3, name: "Top 10%", icon: "🏆", date: "2023-07-10" },
      { id: 4, name: "Community Helper", icon: "🤝", date: "2023-07-18" }
    ];
    
    setBadges(mockBadges);
  };

  const handleEditProfile = () => {
    setEditProfileModal(true);
    setEditStep(1);
  };

  const handleSaveProfile = () => {
    // Save to localStorage with user-specific key
    localStorage.setItem(`userProfile_${user._id}`, JSON.stringify(userData));
    setBio(userData.bio);
    setEditProfileModal(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await axiosClient.delete(`/user/deleteProfile/${user._id}`);
      // Clear user-specific profile data
      localStorage.removeItem(`userProfile_${user._id}`);
      setDeleteModal(false);
   navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  const handleNextStep = () => {
    setEditStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setEditStep(prev => prev - 1);
  };

  const handleRoleSelect = (role) => {
    setUserData({...userData, roleType: role});
    handleNextStep();
  };

  const renderStreakCalendar = () => {
    const last30Days = streakData.slice(-30);
    
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FiCalendar className="mr-3 text-amber-400 text-2xl" /> 
          Activity Calendar
        </h3>
        <div className="grid grid-cols-7 gap-1.5">
          {last30Days.map((day, index) => (
            <div 
              key={index} 
              className={`h-8 rounded-md text-sm flex items-center justify-center ${
                day.count === 0 
                  ? "bg-gray-700" 
                  : day.count < 3 
                    ? "bg-gradient-to-br from-green-600 to-emerald-700" 
                    : "bg-gradient-to-br from-green-400 to-emerald-600"
              }`}
              title={`${day.date}: ${day.count} problem${day.count !== 1 ? 's' : ''} solved`}
            >
              {day.count > 0 ? day.count : ''}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-400">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-700 rounded mr-2"></div> <span>No activity</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded mr-2"></div> <span>Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-400 rounded mr-2"></div> <span>Very active</span>
          </div>
        </div>
      </div>
    );
  };

  const renderBadges = () => {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FiAward className="mr-3 text-amber-400 text-2xl" /> 
          Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map(badge => (
            <div key={badge.id} className="flex flex-col items-center p-3 bg-gray-700 rounded-xl transform transition hover:scale-105">
              <span className="text-3xl">{badge.icon}</span>
              <span className="text-sm font-medium mt-2 text-center">{badge.name}</span>
              <span className="text-xs text-gray-400 mt-1">{badge.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRoleInfo = () => {
    if (!userData.roleType) return null;
    
    return (
      <div className="mt-6 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex items-center mb-4">
          <div className="bg-amber-600 p-2 rounded-lg mr-3">
            {userData.roleType === 'student' ? 
              <FiBook className="text-white text-xl" /> : 
              <FiBriefcase className="text-white text-xl" />
            }
          </div>
          <h3 className="text-xl font-bold text-amber-300">
            {userData.roleType === 'student' ? 'Academic Details' : 'Professional Details'}
          </h3>
        </div>
        
        {userData.roleType === 'student' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData.college && (
              <div className="bg-gray-750 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">College</p>
                <p className="text-lg font-medium">{userData.college}</p>
              </div>
            )}
            {userData.branch && (
              <div className="bg-gray-750 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Branch</p>
                <p className="text-lg font-medium">{userData.branch}</p>
              </div>
            )}
            {userData.skillsLearning && (
              <div className="bg-gray-750 p-4 rounded-lg md:col-span-2">
                <p className="text-sm text-gray-400 mb-1">Skills Learning</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData.skillsLearning.split(',').map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-amber-700 rounded-full text-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData.company && (
              <div className="bg-gray-750 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Company</p>
                <p className="text-lg font-medium">{userData.company}</p>
              </div>
            )}
            {userData.jobRole && (
              <div className="bg-gray-750 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Role</p>
                <p className="text-lg font-medium">{userData.jobRole}</p>
              </div>
            )}
            {userData.experience && (
              <div className="bg-gray-750 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Experience</p>
                <p className="text-lg font-medium">{userData.experience} years</p>
              </div>
            )}
            {userData.professionalSkills && (
              <div className="bg-gray-750 p-4 rounded-lg md:col-span-2">
                <p className="text-sm text-gray-400 mb-1">Professional Skills</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData.professionalSkills.split(',').map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-emerald-700 rounded-full text-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 min-h-screen text-white">
      <Navbar />
      
    {/* Edit Profile Modal */}
{editProfileModal && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div className="p-4 md:p-6 flex flex-col h-full">
        <h3 className="text-xl md:text-2xl font-bold mb-3 text-amber-300">
          {editStep === 1 && "Personal Details"}
          {editStep === 2 && "Select Your Role"}
          {editStep === 3 && userData.roleType === 'student' ? "Academic Details" : "Professional Details"}
          {editStep === 4 && "Review Profile"}
        </h3>
        
        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center w-1/4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                  step === editStep 
                    ? "bg-amber-500 text-white" 
                    : step < editStep 
                      ? "bg-emerald-500 text-white" 
                      : "bg-gray-700 text-gray-400"
                }`}>
                  {step}
                </div>
                <span className="text-xs mt-1 text-gray-400">
                  {step === 1 && "Personal"}
                  {step === 2 && "Role"}
                  {step === 3 && "Details"}
                  {step === 4 && "Review"}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-700 -mt-4 mx-8 md:mx-10 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 rounded-full" 
              style={{ width: `${(editStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto py-1">
          {/* Step 1: Personal Details */}
          {editStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">First Name</label>
                  <input
                    type="text"
                    value={userData.firstName}
                    onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Last Name</label>
                  <input
                    type="text"
                    value={userData.lastName}
                    onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-gray-300">Email</label>
                <p className="text-white bg-gray-750 rounded-lg px-4 py-2.5">{user?.emailId}</p>
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-gray-300">Bio</label>
                <textarea
                  rows={3}
                  value={userData.bio}
                  onChange={(e) => setUserData({...userData, bio: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-gray-300">Social Links</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FiCode className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={userData.github}
                      onChange={(e) => setUserData({...userData, github: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <FiBriefcase className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      value={userData.linkedin}
                      onChange={(e) => setUserData({...userData, linkedin: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Age</label>
                  <input
                    type="number"
                    placeholder="Age"
                    value={userData.age}
                    onChange={(e) => setUserData({...userData, age: e.target.value})}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2.5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2.5"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-gray-300">Location</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={userData.location}
                  onChange={(e) => setUserData({...userData, location: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2.5"
                />
              </div>
            </div>
          )}
          
          {/* Step 2: Role Selection */}
          {editStep === 2 && (
            <div className="space-y-4">
              <p className="text-gray-300 text-center md:text-lg">
                Are you a student or a working professional?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect('student')}
                  className={`p-4 md:p-5 rounded-xl flex flex-col items-center justify-center transition-all transform hover:scale-[1.02] ${
                    userData.roleType === 'student'
                      ? "bg-gradient-to-br from-blue-700 to-blue-900 border-2 border-blue-400"
                      : "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                  }`}
                >
                  <FiBook className="text-3xl md:text-4xl mb-2 text-blue-300" />
                  <span className="text-lg md:text-xl font-bold">Student</span>
                  <p className="text-gray-300 mt-2 text-center text-sm md:text-base">
                    Currently enrolled in an educational institution
                  </p>
                </button>
                
                <button
                  onClick={() => handleRoleSelect('working')}
                  className={`p-4 md:p-5 rounded-xl flex flex-col items-center justify-center transition-all transform hover:scale-[1.02] ${
                    userData.roleType === 'working'
                      ? "bg-gradient-to-br from-emerald-700 to-emerald-900 border-2 border-emerald-400"
                      : "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                  }`}
                >
                  <FiBriefcase className="text-3xl md:text-4xl mb-2 text-emerald-300" />
                  <span className="text-lg md:text-xl font-bold">Working Professional</span>
                  <p className="text-gray-300 mt-2 text-center text-sm md:text-base">
                    Currently employed in a professional role
                  </p>
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Role Details */}
          {editStep === 3 && (
            <div className="space-y-4">
              {userData.roleType === 'student' ? (
                <>
                  <h4 className="text-lg md:text-xl font-bold text-blue-400 flex items-center mb-3">
                    <FiBook className="mr-2" /> Student Information
                  </h4>
                  
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">College Name</label>
                    <input
                      type="text"
                      placeholder="Your College"
                      value={userData.college}
                      onChange={(e) => setUserData({...userData, college: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Branch/Department</label>
                    <input
                      type="text"
                      placeholder="Your Branch (e.g., CSE, ECE)"
                      value={userData.branch}
                      onChange={(e) => setUserData({...userData, branch: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Skills Learning</label>
                    <input
                      type="text"
                      placeholder="e.g., React, DSA, Machine Learning"
                      value={userData.skillsLearning}
                      onChange={(e) => setUserData({...userData, skillsLearning: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-lg md:text-xl font-bold text-emerald-400 flex items-center mb-3">
                    <FiBriefcase className="mr-2" /> Professional Information
                  </h4>
                  
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Company</label>
                    <input
                      type="text"
                      placeholder="Your Company"
                      value={userData.company}
                      onChange={(e) => setUserData({...userData, company: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Job Role</label>
                    <input
                      type="text"
                      placeholder="Your Position"
                      value={userData.jobRole}
                      onChange={(e) => setUserData({...userData, jobRole: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Experience (years)</label>
                    <input
                      type="number"
                      placeholder="Years of experience"
                      value={userData.experience}
                      onChange={(e) => setUserData({...userData, experience: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Professional Skills</label>
                    <input
                      type="text"
                      placeholder="e.g., JavaScript, Project Management"
                      value={userData.professionalSkills}
                      onChange={(e) => setUserData({...userData, professionalSkills: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Step 4: Review */}
          {editStep === 4 && (
            <div className="space-y-4">
              <div className="bg-gray-750 p-4 rounded-xl">
                <h4 className="text-lg font-bold text-amber-300 mb-3">Personal Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Name:</span>
                    <span className="text-base font-medium">{userData.firstName} {userData.lastName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Email:</span>
                    <span className="text-base font-medium">{user?.emailId}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Age:</span>
                    <span className="text-base font-medium">{userData.age || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Phone:</span>
                    <span className="text-base font-medium">{userData.phone || '-'}</span>
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <span className="text-xs text-gray-400">Bio:</span>
                    <p className="text-gray-300 text-sm mt-1">{userData.bio || '-'}</p>
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <span className="text-xs text-gray-400">Location:</span>
                    <span className="text-base font-medium">{userData.location || '-'}</span>
                  </div>
                </div>
              </div>
              
              {userData.roleType && (
                <div className="bg-gray-750 p-4 rounded-xl">
                  <h4 className="text-lg font-bold text-amber-300 mb-3">
                    {userData.roleType === 'student' ? 'Academic Details' : 'Professional Details'}
                  </h4>
                  {userData.roleType === 'student' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">College:</span>
                        <span className="text-base font-medium">{userData.college || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Branch:</span>
                        <span className="text-base font-medium">{userData.branch || '-'}</span>
                      </div>
                      <div className="flex flex-col sm:col-span-2">
                        <span className="text-xs text-gray-400">Skills Learning:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {userData.skillsLearning ? 
                            userData.skillsLearning.split(',').map((skill, index) => (
                              <span key={index} className="px-2 py-0.5 bg-blue-700 rounded-full text-xs">
                                {skill.trim()}
                              </span>
                            )) : 
                            <span>-</span>
                          }
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Company:</span>
                        <span className="text-base font-medium">{userData.company || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Role:</span>
                        <span className="text-base font-medium">{userData.jobRole || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Experience:</span>
                        <span className="text-base font-medium">{userData.experience ? `${userData.experience} years` : '-'}</span>
                      </div>
                      <div className="flex flex-col sm:col-span-2">
                        <span className="text-xs text-gray-400">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {userData.professionalSkills ? 
                            userData.professionalSkills.split(',').map((skill, index) => (
                              <span key={index} className="px-2 py-0.5 bg-emerald-700 rounded-full text-xs">
                                {skill.trim()}
                              </span>
                            )) : 
                            <span>-</span>
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-gray-750 p-4 rounded-xl">
                <h4 className="text-lg font-bold text-amber-300 mb-3">Social Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">GitHub:</span>
                    <span className="text-base font-medium truncate">{userData.github || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">LinkedIn:</span>
                    <span className="text-base font-medium truncate">{userData.linkedin || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-700">
          <button 
            onClick={() => editStep > 1 ? handlePrevStep() : setEditProfileModal(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition flex items-center text-base"
          >
            {editStep > 1 ? <FiArrowLeft className="mr-2" /> : null}
            {editStep > 1 ? "Back" : "Cancel"}
          </button>
          
          {editStep < 4 ? (
            <button 
              onClick={handleNextStep}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-lg transition flex items-center text-base"
              disabled={editStep === 2 && !userData.roleType}
            >
              Next <FiArrowRight className="ml-2" />
            </button>
          ) : (
            <button 
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-lg transition text-base"
            >
              Save Profile
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
)}
      
      {/* Delete Account Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-8">
              <div className="text-red-500 text-5xl mb-5 flex justify-center">
                <FiTrash2 />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Delete Your Account?</h3>
              <p className="text-gray-300 text-center mb-6 text-lg">
                This will permanently remove all your data. This action cannot be undone.
              </p>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setDeleteModal(false)}
                  className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 rounded-lg transition text-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition text-lg"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src="./hacker.png"
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-amber-400 object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-amber-500 rounded-full p-1 border-2 border-gray-900">
                  <FiUser className="text-white text-sm" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-4 text-amber-300 text-center">
                {userData.firstName || "Anonymous"} {userData.lastName || "Hacker"}
              </h2>
              <div className="text-emerald-400 mt-1 font-medium">{user?.role?.toUpperCase()}</div>
              
              {userData.location && (
                <div className="flex items-center mt-2 text-gray-400">
                  <FiMapPin className="mr-1" /> {userData.location}
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-white">{solvedProblems.length}</p>
                <p className="text-sm text-emerald-200">Solved</p>
              </div>
              <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-white">{submissions.length}</p>
                <p className="text-sm text-blue-200">Submissions</p>
              </div>
              <div className="bg-gradient-to-br from-amber-800 to-amber-900 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-white">5</p>
                <p className="text-sm text-amber-200">Streak</p>
              </div>
              <div className="bg-gradient-to-br from-pink-800 to-pink-900 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-white">{badges.length}</p>
                <p className="text-sm text-pink-200">Badges</p>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="mt-8">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center px-5 py-3 rounded-xl mb-3 text-left transition ${
                  activeTab === "profile" 
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg" 
                    : "hover:bg-gray-700"
                }`}
              >
                <FiUser className="mr-3 text-lg" /> 
                <span className="text-lg">Profile</span>
              </button>
              <button 
                onClick={() => setActiveTab("activity")}
                className={`w-full flex items-center px-5 py-3 rounded-xl mb-3 text-left transition ${
                  activeTab === "activity" 
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg" 
                    : "hover:bg-gray-700"
                }`}
              >
                <FiActivity className="mr-3 text-lg" /> 
                <span className="text-lg">Activity</span>
              </button>
              <button 
                onClick={() => setActiveTab("submissions")}
                className={`w-full flex items-center px-5 py-3 rounded-xl mb-3 text-left transition ${
                  activeTab === "submissions" 
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg" 
                    : "hover:bg-gray-700"
                }`}
              >
                <FiCode className="mr-3 text-lg" /> 
                <span className="text-lg">Submissions</span>
              </button>
            </div>
            
            {/* Actions */}
            <div className="mt-8 border-t border-gray-700 pt-5">
              <button 
                onClick={handleEditProfile}
                className="w-full flex items-center px-5 py-3 rounded-xl mb-3 hover:bg-gray-700 text-left transition text-lg"
              >
                <FiEdit className="mr-3" /> Edit Profile
              </button>
              <button 
                onClick={() => setDeleteModal(true)}
                className="w-full flex items-center px-5 py-3 rounded-xl hover:bg-red-900 text-red-400 text-left transition text-lg"
              >
                <FiTrash2 className="mr-3" /> Delete Account
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 mb-6 border border-gray-700">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-amber-300">Profile Overview</h1>
                  <button 
                    onClick={handleEditProfile}
                    className="flex items-center text-amber-400 hover:text-amber-300 text-lg"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">About Me</h3>
                  <p className="text-gray-300 text-lg">{bio}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Personal Info</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="bg-amber-600 p-2 rounded-lg mr-3">
                          <FiUser className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Name</p>
                          <p className="text-lg font-medium">{userData.firstName} {userData.lastName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-blue-600 p-2 rounded-lg mr-3">
                          <FiMail className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-lg font-medium">{user?.emailId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-emerald-600 p-2 rounded-lg mr-3">
                          <FiAward className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Role</p>
                          <p className="text-lg font-medium text-emerald-400">{user?.role?.toUpperCase()}</p>
                        </div>
                      </div>
                      
                      {userData.age && (
                        <div className="flex items-center">
                          <div className="bg-purple-600 p-2 rounded-lg mr-3">
                            <FiCalendar className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Age</p>
                            <p className="text-lg font-medium">{userData.age}</p>
                          </div>
                        </div>
                      )}
                      
                      {userData.phone && (
                        <div className="flex items-center">
                          <div className="bg-pink-600 p-2 rounded-lg mr-3">
                            <FiPhone className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Phone</p>
                            <p className="text-lg font-medium">{userData.phone}</p>
                          </div>
                        </div>
                      )}
                      
                      {userData.location && (
                        <div className="flex items-center">
                          <div className="bg-cyan-600 p-2 rounded-lg mr-3">
                            <FiMapPin className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Location</p>
                            <p className="text-lg font-medium">{userData.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                   <div>
                    <h3 className="text-xl font-bold mb-4">Problem Solving Stats</h3>
                    <div className="space-y-5">
                      <div className="bg-gradient-to-br from-gray-750 to-gray-800 p-5 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-lg">Easy Solved</span>
                          <span className="text-2xl font-bold text-emerald-400">
                            {easySolved}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${easyPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-750 to-gray-800 p-5 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-lg">Medium Solved</span>
                          <span className="text-2xl font-bold text-amber-400">
                            {mediumSolved}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full" 
                            style={{ width: `${mediumPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-750 to-gray-800 p-5 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-lg">Hard Solved</span>
                          <span className="text-2xl font-bold text-red-400">
                            {hardSolved}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${hardPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-750 to-gray-800 p-5 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-lg">Acceptance Rate</span>
                          <span className="text-2xl font-bold text-blue-400">82%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: '82%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Social Links */}
                {(userData.github || userData.linkedin) && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-3">Social Profiles</h3>
                    <div className="flex space-x-5">
                      {userData.github && (
                        <a 
                          href={userData.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-gray-750 hover:bg-gray-700 rounded-lg transition flex items-center"
                        >
                          <FiCode className="mr-2" /> GitHub
                        </a>
                      )}
                      {userData.linkedin && (
                        <a 
                          href={userData.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-gray-750 hover:bg-gray-700 rounded-lg transition flex items-center"
                        >
                          <FiBriefcase className="mr-2" /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {renderRoleInfo()}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {renderStreakCalendar()}
                {renderBadges()}
              </div>
            </div>
          )}
          
          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <h1 className="text-3xl font-bold text-amber-300 mb-8">Recent Activity</h1>
              
              <div className="space-y-5">
                <div className="flex items-start bg-gray-750 p-5 rounded-xl">
                  <div className="bg-emerald-600 p-3 rounded-full mr-4 mt-1">
                    <FiCode className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Solved "Two Sum"</h3>
                    <p className="text-gray-400 text-lg mt-1">2 days ago • Runtime: 8ms (beats 95% of users)</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-emerald-800 rounded-full text-sm">Arrays</span>
                      <span className="px-3 py-1 bg-emerald-800 rounded-full text-sm">Hash Map</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start bg-gray-750 p-5 rounded-xl">
                  <div className="bg-amber-600 p-3 rounded-full mr-4 mt-1">
                    <FiCode className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Solved "Reverse Linked List"</h3>
                    <p className="text-gray-400 text-lg mt-1">3 days ago • Runtime: 12ms (beats 87% of users)</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-amber-800 rounded-full text-sm">Linked List</span>
                      <span className="px-3 py-1 bg-amber-800 rounded-full text-sm">Recursion</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start bg-gray-750 p-5 rounded-xl">
                  <div className="bg-blue-600 p-3 rounded-full mr-4 mt-1">
                    <FiAward className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Earned "5-Day Streak" badge</h3>
                    <p className="text-gray-400 text-lg mt-1">4 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-gray-750 p-5 rounded-xl">
                  <div className="bg-red-600 p-3 rounded-full mr-4 mt-1">
                    <FiCode className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Attempted "Median of Two Sorted Arrays"</h3>
                    <p className="text-gray-400 text-lg mt-1">5 days ago • Wrong answer on test case 15</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-red-800 rounded-full text-sm">Arrays</span>
                      <span className="px-3 py-1 bg-red-800 rounded-full text-sm">Binary Search</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start bg-gray-750 p-5 rounded-xl">
                  <div className="bg-emerald-600 p-3 rounded-full mr-4 mt-1">
                    <FiCode className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Solved "Valid Parentheses"</h3>
                    <p className="text-gray-400 text-lg mt-1">1 week ago • Runtime: 4ms (beats 98% of users)</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-emerald-800 rounded-full text-sm">Stack</span>
                      <span className="px-3 py-1 bg-emerald-800 rounded-full text-sm">String</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Submissions Tab */}
          {activeTab === "submissions" && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <h1 className="text-3xl font-bold text-amber-300 mb-8">Recent Submissions</h1>

              {/* Submissions Table */}
              <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full">
                  <thead className="bg-gray-750">
                    <tr>
                      <th className="py-4 px-6 text-left">Problem</th>
                  
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.slice(0, 5).map((submission, index) => (
                      <tr key={submission._id || index} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-4 px-6">
                          <div className="font-medium text-lg text-white">{submission.title}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {submission.tags?.split(',').map((tag, i) => (
                              <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-lg">{submission.language || "JavaScript"}</td>
                        <td className="py-4 px-6 text-lg">{submission.runtime || "8ms"}</td>
                        <td className="py-4 px-6 text-lg">{submission.memory || "40.1MB"}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              submission.status === "Accepted"
                                ? "bg-emerald-900 text-emerald-300"
                                : "bg-red-900 text-red-300"
                            }`}
                          >
                            {submission.status || "Accepted"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-400">
                          {submission.date || "Jul 23, 2025"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Solved Problems Section */}
              <div className="mt-10">
                <h3 className="text-2xl font-bold mb-6 text-amber-300">Solved Problems</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {solvedProblems.slice(0, 6).map((problem, index) => (
                    <div key={problem._id || index} className="bg-gradient-to-br from-gray-750 to-gray-800 p-4 rounded-xl border border-gray-700 hover:border-amber-500 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-lg text-white">{problem.title}</div>
                          <div className="text-gray-400 mt-1">
                            {problem.tags} • {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-900 text-emerald-300 text-sm font-medium">
                          Solved
                        </span>
                      </div>
                      <div className="mt-3 flex text-gray-400">
                        <span className="mr-4">Runtime: {problem.runtime || "8ms"}</span>
                        <span>Memory: {problem.memory || "40.1MB"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Profile;
