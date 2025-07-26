import { useState } from 'react';
import Navbar from "../../componenets/Navbar";
import { FiPlus, FiEye, FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import axios from 'axios'; // or your preferred HTTP client
import Herosection from '../../componenets/Admin page/hero section';
import { Link } from 'react-router';
import Footer from './Footer';

function AdminPanel() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    tags: [],
    visibleTestCases: '',
    hiddenTestCases: '',
    startCode: '',
    referenceSolution: '',
    problemCreator: 'admin' // or get from auth context
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    // Only allow easy, medium, hard
    const allowedTags = ['easy', 'medium', 'hard'];
    if (allowedTags.includes(value.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [value.toLowerCase()] // Only one tag allowed as per requirement
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/problems', {
        ...formData,
        // Convert test cases from string to array if needed
        visibleTestCases: formData.visibleTestCases.split('\n').filter(c => c.trim()),
        hiddenTestCases: formData.hiddenTestCases.split('\n').filter(c => c.trim())
      });
      
      console.log('Problem created:', response.data);
      alert('Problem created successfully!');
      // Reset form or redirect
    } catch (error) {
      console.error('Error creating problem:', error);
      alert('Failed to create problem');
    }
  };

  return (
    <div className="   min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <Herosection/>
     
<Footer/>

      

    </div>
  );
}

export default AdminPanel;