import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
// import Admin from "./pages/Admin";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./pages/AdminPanel";
import Addproblem from "./pages/Admincontroller/Addproblem"
import UpdateProblem from "./pages/Admincontroller/UpdateProblem";
import ProblemContent from "./pages/ProblemContent"
import Store from "./pages/Admincontroller/Store";
import StoreManagment from "../componenets/Adminpage/StoreManagment";
import Explorecourses from "../componenets/Navbarfeatures/Explorecourses";
import StoreGoodies from "../componenets/Navbarfeatures/StoreGoodies";
import Discuss from "../componenets/Navbarfeatures/Discuss";
import CourseDetails from "../componenets/Navbarfeatures/CourseDetails";
import Mypurchased from "../componenets/Navbarfeatures/Mypurchased";
import Content from "../componenets/Navbarfeatures/CourseContent/Content"
import Alluser from "./pages/Admincontroller/Alluser";
import Adminregister from "./pages/Admincontroller/Adminregister";
import Profile from "../componenets/Navbarfeatures/Profile";
import Contact from "./pages/Contact";
import Contest from "./pages/Contest";
import NotFound from "./pages/NotFound";




function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,loading,user} = useSelector((state)=>state.auth);
  



   
  
  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

   if(loading){
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <span className="loading loading-spinner loading-lg text-white"></span>
    </div>
   }

  

  return(
  <>
    <Routes>
      <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/login" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
      <Route path="/admin" element={isAuthenticated && user.role==="admin"?<AdminPanel/>:<Navigate to="/"/>}></Route>
      <Route path='/admin/createProblem' element={isAuthenticated  && (user?.role==="admin")?<Addproblem></Addproblem>:<Navigate to="/"/>}></Route>
      <Route path='/admin/updateProblem' element={isAuthenticated  && (user?.role==="admin")?<UpdateProblem/>:<Navigate to="/"/>}></Route>
      <Route path="/problemcontent/:id" element={isAuthenticated?<ProblemContent/>:<Navigate to="/"/>}></Route>
      <Route path="/store" element={isAuthenticated ? <Store></Store>:<Navigate to="/"></Navigate>} ></Route>
      <Route path="/StoreManagment" element={isAuthenticated ? <StoreManagment/>:<Navigate to="/"></Navigate>} ></Route>
      <Route path="/explorecourses" element={isAuthenticated ? <Explorecourses/>:<Navigate to="/"></Navigate>} ></Route>
       <Route path="/goodies" element={isAuthenticated ? <StoreGoodies/>:<Navigate to="/"></Navigate>} ></Route>
       <Route path="/discuss" element={isAuthenticated ? <Discuss/>:<Navigate to="/"></Navigate>} ></Route>
        <Route path="/explore/:id" element={isAuthenticated ? <CourseDetails/>:<Navigate to="/"></Navigate>} ></Route>
        <Route path="/mycourses" element={isAuthenticated ? <Mypurchased/>:<Navigate to="/"></Navigate>} ></Route>
         <Route path="/course/:id" element={isAuthenticated ? <Content/>:<Navigate to="/"></Navigate>} ></Route>
         <Route path="/getalluser" element={isAuthenticated?<Alluser></Alluser>:<Navigate to="/"></Navigate>}></Route>
         <Route path="/registerUser" element={isAuthenticated?<Adminregister/>:<Navigate to="/"></Navigate>}></Route>
        <Route path="/profile" element={isAuthenticated?<Profile/>:<Navigate to="/"></Navigate>}></Route>
        <Route path="/contact" element={isAuthenticated?<Contact/>:<Navigate to="/"></Navigate>}></Route>
        <Route path="/contest" element={isAuthenticated?<Contest/>:<Navigate to="/"></Navigate>}></Route>
        <Route path="*" element={<NotFound />} />
    



       

   
        
      
    </Routes>
  </>
  )
}

export default App;