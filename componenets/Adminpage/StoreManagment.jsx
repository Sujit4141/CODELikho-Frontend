// src/pages/StoreManagement.jsx
import  { useState, useEffect } from "react";
import axiosClient from "../../src/utils/axiosClient";
import Navbar from "../Navbar";

function StoreManagement() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    CourseName: "",
    CourseDescription: "",
    CoursePrice: "",
    validityDays: "",
    CourseMentor: "",
    CourseThumbnail: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axiosClient.get('/course/Allcourses');
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setFormData({
      CourseName: "",
      CourseDescription: "",
      CoursePrice: "",
      validityDays: "",
      CourseMentor: "",
      CourseThumbnail: ""
    });
    setIsModalOpen(true);
    setError("");
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setFormData({
      CourseName: course.CourseName,
      CourseDescription: course.CourseDescription,
      CoursePrice: course.CoursePrice,
      validityDays: course.validityDays,
      CourseMentor: course.CourseMentor,
      CourseThumbnail: course.CourseThumbnail
    });
    setIsEditModalOpen(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isEditModalOpen && currentCourse) {
           const dataToSend = {
     ...formData,
     CoursePrice: Number(formData.CoursePrice),
     validityDays: Number(formData.validityDays)
   };
    
        
        await axiosClient.put(`course/updatecourse/${currentCourse._id}`, dataToSend);
        setIsEditModalOpen(false);
      } else {
             const dataToSend = {
     ...formData,
     CoursePrice: Number(formData.CoursePrice),
     validityDays: Number(formData.validityDays)};
        await axiosClient.post('/course/addCourse', dataToSend);
        setIsModalOpen(false);
      }
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      console.error("Operation failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axiosClient.delete(`/course/deletecourse/${id}`);
        fetchCourses();
      } catch (err) {
        setError("Failed to delete course");
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar  />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          <button 
            onClick={openAddModal}
            className="btn btn-primary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Course
          </button>
        </div>

        {error && (
          <div className="alert alert-error shadow-lg mb-6">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {loading ? (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
) : courses.length === 0 ? (
  <div className="text-center py-12">
    <div className="text-gray-500 mb-4">No courses found</div>
    <button onClick={openAddModal} className="btn btn-primary">Add Your First Course</button>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {courses.map((course) => (
      <div key={course._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow flex flex-col h-full">
        {/* Fixed image container */}
        <figure className="relative pt-[56.25%]"> {/* 16:9 aspect ratio container */}
          {course.CourseThumbnail ? (
            <img 
              src={course.CourseThumbnail} 
              alt={course.CourseName} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </figure>
        
        <div className="card-body flex-grow">
          <h2 className="card-title text-l font-bold">{course.CourseName}</h2>
          <p className="text-gray-600 mb-2 line-clamp-2">{course.CourseDescription}</p> {/* Added line clamp */}
          
          <div className="flex items-center text-sm mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">Mentor: {course.CourseMentor} </span> 
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="badge badge-primary p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.validityDays} days access
            </div>
            
            <div className="text-xl font-bold text-primary">
              ₹{course.CoursePrice}
            </div>
          </div>
          
          <div className="card-actions justify-end">
            <button 
              onClick={() => openEditModal(course)}
              className="btn btn-outline btn-primary btn-sm"
            >
              Edit
            </button>
            <button 
              onClick={() => handleDelete(course._id)}
              className="btn btn-outline btn-error btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>

        )}
      </div>

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-xl mb-6">Add New Course</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Course Name</span>
                  </label>
                  <input
                    type="text"
                    name="CourseName"
                    value={formData.CourseName}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Course Price (₹)</span>
                  </label>
                  <input
                    type="number"
                    name="CoursePrice"
                    value={formData.CoursePrice}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                    min="1"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Mentor Name</span>
                  </label>
                  <input
                    type="text"
                    name="CourseMentor"
                    value={formData.CourseMentor}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Validity (Days)</span>
                  </label>
                  <input
                    type="number"
                    name="validityDays"
                    value={formData.validityDays}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                    min="1"
                  />
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="CourseDescription"
                    value={formData.CourseDescription}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-24"
                    required
                  ></textarea>
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Thumbnail URL (Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="CourseThumbnail"
                    value={formData.CourseThumbnail}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="Leave empty for default thumbnail"
                  />
                </div>
              </div>
              
              <div className="modal-action mt-6">
                <button 
                  type="button" 
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {isEditModalOpen && currentCourse && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-xl mb-6">Edit Course</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Course Name</span>
                  </label>
                  <input
                    type="text"
                    name="CourseName"
                    value={formData.CourseName}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Course Price (₹)</span>
                  </label>
                  <input
                    type="number"
                    name="CoursePrice"
                    value={formData.CoursePrice}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                    min="1"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Mentor Name</span>
                  </label>
                  <input
                    type="text"
                    name="CourseMentor"
                    value={formData.CourseMentor}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Validity (Days)</span>
                  </label>
                  <input
                    type="number"
                    name="validityDays"
                    value={formData.validityDays}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                    min="1"
                  />
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="CourseDescription"
                    value={formData.CourseDescription}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-24"
                    required
                  ></textarea>
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Thumbnail URL</span>
                  </label>
                  <input
                    type="text"
                    name="CourseThumbnail"
                    value={formData.CourseThumbnail}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="Leave empty for default thumbnail"
                  />
                </div>
              </div>
              
              <div className="modal-action mt-6">
                <button 
                  type="button" 
                  className="btn btn-ghost"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoreManagement;