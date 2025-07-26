import { Link } from "react-router";
import TrafficDonutChart from "./TrafficDonutChart";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Clock from "./Clock";

function Herosection() {
  const { user } = useSelector((state) => state.auth);
  const [userFirstName, setName] = useState(" User ");
  const [ismenuopen, setmenuopen] = useState(false);
  const [isusermenuopen, setusermenuopen] = useState(false);
  const [isvideomenuopen, setvideomenuopen] = useState(false);
  const [isstoremenuopen, setstoremenuopen] = useState(false);
  
  const [stats] = useState({
    users: 10,
    problems: 20,
    videos: 30,
    storeItems: 50
  });

  useEffect(() => {
    if (user) setName(user.firstName);
  }, [user]);

  return (
    <div className="relative">
      <div>
        <div className="mt-5 mb-3 drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="inline drawer-content">
            <label 
              htmlFor="my-drawer" 
              className="ml-5 btn bg-purple-400 hover:bg-purple-600 border-black text-black drawer-button"
            >
              DashBoard
            </label>
          </div>

          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content mt-10 min-h-full w-80 p-4">
              <div className="sticky ml-0 bg-orange-01">
                <div className="shadow-2xs shadow-orange-200 w-full p-6 border-2 border-blue-500 mb-8 mt-2.5 flex justify-between badge-info">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>Welcome,</span>
                    <span className="text-orange-200 font-bold text-[1.5rem] truncate">
                      {userFirstName}
                    </span>
                  </div>
                  <Clock />
                </div>
              </div>

              <button 
                onClick={() => setmenuopen(!ismenuopen)}
                className="btn btn-error text-[1.4em] text-white p-1 border-black border-1 rounded-2xl hover:text-black hover:border-white"
              >
                Problems
              </button>
              
              {ismenuopen && (
                <div className="flex w-full border menu menu-md bg-base-200 rounded-box">
                  <li className="m-2 mt-2.5  w-full text-blue-300 border-1 p-1 rounded-2xl">
                    <Link to="/admin/createProblem">Create new Problem</Link>
                    
                  </li>
                  <li className="m-2 mt-2.5  w-full text-blue-300 border-1 p-1 rounded-2xl">
                    <Link to="/admin/updateProblem">All Problem</Link>
                  </li>
                </div>
              )}

              <button 
                onClick={() => setusermenuopen(!isusermenuopen)}
                className="btn btn-error text-[1.4em] text-white p-1 border-black border-1 rounded-2xl hover:text-black hover:border-white mt-9"
              >
                User
              </button>
              
              {isusermenuopen && (
                <div className="flex w-full border menu menu-md bg-base-200 rounded-box">
                  <li className="m-2 mt-2.5  w-full text-blue-300 border-1 p-1 rounded-2xl">
                    <Link to="/getalluser" >All User</Link>
                  </li>
                  <li className="m-2 mt-2.5 w-full text-blue-300 border-1 p-1 rounded-2xl">
                    <Link to="/registerUser">Register User</Link>
                  </li>
                </div>
              )}

            
              

              <button 
                onClick={() => setstoremenuopen(!isstoremenuopen)}
                className="btn btn-error text-[1.4em] text-white p-1 border-black border-1 rounded-2xl hover:text-black hover:border-white mt-9"
              >
                Store Managment
              </button>
              
              {isstoremenuopen && (
                <div className="flex w-full border menu menu-md bg-base-200 rounded-box">
                  <li className="m-2 mt-2.5  w-full text-blue-300 border-1 p-1 rounded-2xl">
                    <Link to="/goodies">Goodies</Link>
                  </li>
                  <li className="m-2 mt-2.5 w-full text-blue-300 border-1 p-1 rounded-2xl">
                    <Link to="/StoreManagment">Courses</Link>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </div>


        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-400 text-sm">Total Users</h3>
                <p className="text-2xl font-bold">{stats.users}</p>
              </div>
              <div className="bg-indigo-500/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center text-green-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>12.4% increase</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-400 text-sm">Problems</h3>
                <p className="text-2xl font-bold">{stats.problems}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center text-green-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>8.2% increase</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-400 text-sm">Videos</h3>
                <p className="text-2xl font-bold">{stats.videos}</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center text-green-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>23.7% increase</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-400 text-sm">Store Items</h3>
                <p className="text-2xl font-bold">{stats.storeItems}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center text-green-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>5.1% increase</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Traffic Sources</h3>
            <div className="text-sm text-gray-400">Last 30 days</div>
          </div>
          <div className="flex justify-center">
            <TrafficDonutChart />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Activity Overview</h3>
            <div className="text-sm text-gray-400">This week</div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-indigo-500/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Problem Submissions</h4>
                  <p className="text-sm text-gray-400">42 new submissions</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">2h ago</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">New Users</h4>
                  <p className="text-sm text-gray-400">18 new registrations</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">4h ago</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Store Orders</h4>
                  <p className="text-sm text-gray-400">7 new orders</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">6h ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Herosection;