import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import Navbar from "../../componenets/Navbar";
import { useNavigate, useLocation } from 'react-router';
import { useRef } from "react";
import Footer from "./Footer";

function Homepage() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const problemsRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(10);

  useEffect(() => {
    // Scroll to problems when hash is present
    if (location.hash === '#problems' && problemsRef.current) {
      setTimeout(() => {
        problemsRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location, loading]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [{ data: problemsData }, { data: solvedData }] = await Promise.all([
          axiosClient.get("problem/getAllProblem"),
          user ? axiosClient.get("/problem/problemSolvedbyUser") : { data: [] }
        ]);
        setProblems(problemsData);
        setSolvedProblems(solvedData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);



  // Filter problems
  
  const filteredProblems = problems && problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesTag = tagFilter === 'all' || problem.tags.toLowerCase().includes(tagFilter.toLowerCase());
    return matchesSearch && matchesDifficulty && matchesTag;
  });

  // Pagination logic
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleProblemClick = (problemId) => {
    navigate(`/problemcontent/${problemId}`);
  };

  const getUniqueTags = () => {
    const allTags = problems.flatMap(problem => 
      problem.tags.split(',').map(tag => tag.trim())
    );
    return ['all', ...new Set(allTags)];
  };

  if (loading) {
    return (
      <div className=" inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative">
          <span className="loading loading-spinner loading-lg text-white"></span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-sm';
      case 'medium':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-sm';
      case 'hard':
        return 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-sm';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  const userAvatar = user?.avatarUrl || `https://api.dicebear.com/8.x/pixel-art/svg?seed=${encodeURIComponent(user?.name || "User")}`;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#C7D9DD] via-[#ADB2D4] to-[#EEF1DA] text-gray-800 overflow-x-hidden">
      
      {/* Enhanced decorative elements */}
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

      {/* Enhanced Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 mt-6 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-12 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-pink-500 mb-4 drop-shadow animate-text-shine">
              Welcome to <span className="text-gray-900">Code Likho</span>
            </h2>
            <p className="text-gray-700 text-lg mb-6 max-w-lg">
              Level up your coding skills with curated challenges, track your progress, and join a growing community.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#problems" className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#3a9bed] hover:to-[#33a0a6] text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                Get Started
              </a>
              {user && (
                <div className="flex items-center bg-white/60 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-gray-300 transform transition-transform duration-300 hover:scale-105">
                  <div className="relative">
                    <img src={userAvatar} className="w-10 h-10 rounded-full border-2 border-blue-400 shadow" alt="User" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-600">Solved: {solvedProblems.length}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative mt-8 md:mt-0">
            <img 
              src="\src\assets\hompage.png"
              alt="Coding" 
              className="w-60 md:w-64 drop-shadow-xl transition-transform duration-500 hover:scale-105" 
              draggable={false} 
            />
            <div className="absolute -z-10 -inset-6 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse-slow"></div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main 
        ref={problemsRef} 
        id="problems" 
        className="container mx-auto px-4 py-8 max-w-6xl relative z-10"
      >
        
        {/* Enhanced Filter Section */}
        <div className="bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-lg border border-white/30 rounded-2xl p-6 mb-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full p-3 pl-10 rounded-xl bg-white/80 text-gray-800 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-inner transition-all duration-300"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
              <svg className="h-5 w-5 absolute left-3 top-3.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <select
              className="w-full p-3 pr-8 rounded-xl bg-white/80 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none shadow-inner transition-all duration-300 cursor-pointer"
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setCurrentPage(1); // Reset to first page when changing difficulty
              }}
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              className="w-full p-3 pr-8 rounded-xl bg-white/80 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none shadow-inner transition-all duration-300 cursor-pointer"
              value={tagFilter}
              onChange={(e) => {
                setTagFilter(e.target.value);
                setCurrentPage(1); // Reset to first page when changing tag
              }}
            >
              {getUniqueTags().map(tag => (
                <option key={tag} value={tag}>
                  {tag === 'all' ? 'All Tags' : tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Enhanced Problems list */}
        <div className="bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 py-4 px-6 font-semibold text-gray-700 border-b border-white/50 backdrop-blur-sm">
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-7">Title</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-2">Tags</div>
          </div>
          {currentProblems.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="mt-4 text-lg">No problems found matching your filters</p>
              <button 
                className="mt-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-full shadow transition-all duration-300 hover:scale-105"
                onClick={() => {
                  setSearchTerm('');
                  setDifficultyFilter('all');
                  setTagFilter('all');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/50">
              {currentProblems.map(problem => {
                const isSolved = solvedProblems.includes(problem._id);
                return (
                  <div
                    key={problem._id}
                    className="grid grid-cols-12 py-5 px-6 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-purple-50/60 cursor-pointer transition-all duration-300 group hover:shadow-inner"
                    onClick={() => handleProblemClick(problem._id)}
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      {isSolved ? (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-green-sm">
                          <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="w-2 h-2 rounded-full bg-gray-500 group-hover:bg-gray-700 transition-all"></div>
                          <div className="absolute inset-0 rounded-full bg-gray-400 animate-ping opacity-0 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                      )}
                    </div>
                    <div className="col-span-7 font-medium flex items-center">
                      <span className="text-gray-800 group-hover:text-blue-600 transition-colors text-lg flex items-center">
                        {problem.title}
                        {isSolved && (
                          <span className="ml-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                            Solved
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${getDifficultyStyle(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm flex flex-wrap items-center gap-2">
                      {problem.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="bg-gradient-to-r from-blue-300 to-indigo-400 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredProblems.length > problemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-lg border border-white/30 rounded-xl px-6 py-4 shadow-lg">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-bold">{indexOfFirstProblem + 1}</span> to{' '}
              <span className="font-bold">
                {Math.min(indexOfLastProblem, filteredProblems.length)}
              </span>{' '}
              of <span className="font-bold">{filteredProblems.length}</span> problems
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'} shadow transition-all duration-300`}
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === pageNum ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-white/80 hover:bg-white'} transition-all duration-300`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="flex items-end px-1">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => paginate(totalPages)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === totalPages ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-white/80 hover:bg-white'} transition-all duration-300`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'} shadow transition-all duration-300`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-lg border border-white/30 rounded-xl px-6 py-4 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="text-gray-700 text-sm font-medium">
            Showing <span className="font-bold text-blue-600">{filteredProblems.length}</span> of <span className="font-bold">{problems.length}</span> problems
          </div>
          {solvedProblems.length > 0 && user && (
            <div className="flex items-center mt-3 md:mt-0 text-sm bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold px-4 py-2 rounded-full shadow-green-sm">
              <svg className="h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M5 13l4 4L19 7" />
              </svg>
              You've solved {solvedProblems.length} problems!
            </div>
          )}
          <div className="mt-3 md:mt-0">
            <button 
              className="text-sm bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-full shadow transition-all duration-300 hover:scale-105"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top
            </button>
          </div>
        </div>
      </main>

   
      {/* Animated CSS */}
      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes text-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-text-shine { 
          background-size: 200% auto;
          animation: text-shine 3s linear infinite; 
        }
        .animate-ping-slow { animation: ping 4s cubic-bezier(0,0,0.2,1) infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s cubic-bezier(0.4,0,0.6,1) infinite; }
        .shadow-green-sm { box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2), 0 2px 4px -1px rgba(16, 185, 129, 0.1); }
        .shadow-amber-sm { box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.2), 0 2px 4px -1px rgba(245, 158, 11, 0.1); }
        .shadow-rose-sm { box-shadow: 0 4px 6px -1px rgba(244, 63, 94, 0.2), 0 2px 4px -1px rgba(244, 63, 94, 0.1); }
      `}</style>
      <Footer/>
    </div>
  );
}

export default Homepage;