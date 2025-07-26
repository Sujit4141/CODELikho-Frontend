import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from 'react-router';
import { logoutUser } from "../src/authSlice";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Logoutcall = () => {
    navigate('/login');
    dispatch(logoutUser());
  }

  const handleProblemShow = () => navigate('/#problems');
  const handlediscuss = () => navigate('/discuss');
  const storepage = () => navigate('/store');
  const Explorecourse = () => navigate('/explorecourses');
  const contactUs = () => navigate('/contact');
  const handlecontest=()=>navigate("/contest")

  return (
    <div className="sticky top-0 z-50 min-h-10 bg-gray-900 text-gray-100">
      <div className="navbar bg-gray-800 shadow-lg px-4 sm:px-6 py-2">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gray-700 rounded-box w-52">
              <li><button onClick={Explorecourse} className="text-emerald-400">Explore Courses</button></li>
              <li><button onClick={handleProblemShow} className="text-blue-400">Problem</button></li>
              <li><button className="text-purple-400">Contest</button></li>
              <li><button onClick={handlediscuss} className="text-cyan-400">Discuss</button></li>
              <li><button onClick={storepage} className="text-pink-400">Store</button></li>
              <li><button onClick={contactUs} className="text-amber-200">Contact Us</button></li>
              {user.role === "admin" && <li><Link to="/admin" className="text-white">Admin</Link></li>}
            </ul>
          </div>
          <Link to="/" className="text-2xl font-bold text-amber-200 hover:text-amber-300 ml-2 sm:ml-0">Code Likho</Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <div className="flex gap-1">
            <button onClick={Explorecourse} className="btn btn-ghost hover:bg-gray-700 text-emerald-400 h-12 min-h-12 px-4 text-lg">Explore Courses</button>
            <button onClick={handleProblemShow} className="btn btn-ghost hover:bg-gray-700 text-blue-400 h-12 min-h-12 px-4 text-lg">Problem</button>
            <button  onClick={handlecontest}  className="btn btn-ghost hover:bg-gray-700 text-purple-400 h-12 min-h-12 px-4 text-lg">Contest</button>
            <button onClick={handlediscuss} className="btn btn-ghost hover:bg-gray-700 text-cyan-400 h-12 min-h-12 px-4 text-lg">Discuss</button>
            <button onClick={storepage} className="btn btn-ghost hover:bg-gray-700 text-pink-400 h-12 min-h-12 px-4 text-lg">Store</button>
            <button onClick={contactUs} className="btn btn-ghost hover:bg-gray-700 text-amber-200 h-12 min-h-12 px-4 text-lg">Contact Us</button>
          </div>
        </div>

        <div className="navbar-end gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-gray-700/50 rounded-full px-4 py-2">
            <img className="w-5 h-5" src="/componenets/bonfire.png" alt="Streak" />
            <span className="text-yellow-400 font-medium text-lg">0</span>
          </div>

          <div className="badge badge-primary badge-lg hidden sm:flex">PRO</div>

          {user.role === "admin" && (
            <Link to="/admin" className="btn btn-sm sm:btn-md border-1 hidden sm:flex">Admin</Link>
          )}

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle p-0">
              <div className="w-10 rounded-full border-2 border-amber-400">
                <img   src="https://raw.githubusercontent.com/Sujit4141/CODELikho-Frontend/main/componenets/hacker.png" alt="User profile" className="object-cover" />
              </div>
            </div>
            <ul tabIndex={0} className="dropdown-content menu shadow bg-gray-700 rounded-box w-52 mt-2">
              <li><Link to="/profile" className="hover:bg-gray-600 text-lg">Profile <span className="badge badge-accent">New</span></Link></li>
              <li><Link to="/mycourses" className="hover:bg-gray-600 text-lg">Purchases</Link></li>
              <li><button onClick={Logoutcall} className="text-red-400 hover:bg-gray-600 text-lg">Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
