import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from "react-redux";
import Navbar from '../../../componenets/Navbar';
import axiosClient from '../../utils/axiosClient';




function Addproblem() {
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // State for test cases
  const [visibleTestCases, setVisibleTestCases] = useState([
    { input: '', output: '', explanation: '' }
  ]);

   const [isLoading, setIsLoading] = useState(false);
  



  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: '', output: '' }
  ]);
  
  // State for tags - changed to single string
  const [selectedTag, setSelectedTag] = useState("");
  
  // State for code editors - restructured to match schema
  const [starterCode, setStarterCode] = useState([
    { 
      language: "cpp", 
      initialCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Write your code here\n    return 0;\n}' 
    },
    { 
      language: "java", 
      initialCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // Write your code here\n    }\n}' 
    },
    { 
      language: "javascript", 
      initialCode: 'const readline = require(\'readline\');\n\nconst rl = readline.createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nrl.question(\'\', (input) => {\n  // Write your code here\n  rl.close();\n});' 
    },
    { 
      language: "python", 
      initialCode: 'a, b = map(int, input().split())\n# Write your code here' 
    }
  ]);
  
  const [referenceSolution, setReferenceSolution] = useState([
    { 
      language: "cpp", 
      completeCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a - b;\n    return 0;\n}' 
    },
    { 
      language: "java", 
      completeCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(sc.nextInt() - sc.nextInt());\n    }\n}' 
    },
    { 
      language: "javascript", 
      completeCode: 'const readline = require(\'readline\');\n\nconst rl = readline.createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nrl.on(\'line\', (input) => {\n  const [a, b] = input.split(\' \').map(Number);\n  console.log(a - b);\n  rl.close();\n});' 
    },
    { 
      language: "python", 
      completeCode: 'a, b = map(int, input().split())\nprint(a - b)' 
    }
  ]);
  
  // Tag options
  const tagOptions = [
    "Array", "Linked List", "Graphs", "Trees", "Dynamic Programming",
    "Strings", "Sorting", "Searching", "Stack", "Queue", "Hash Table",
    "Heap", "Greedy", "Backtracking", "Math", "Bit Manipulation"
  ];
  
  const onSubmit = async (data) => {
    // Validate tag selection
    if (!selectedTag) {
      alert("Please select a tag");
      return;
    }

    try {
      // Construct formData object
      const formData = {
        ...data,
        tags: selectedTag,  // Single string
        visibleTestCases,
        hiddenTestCases,
        problemCreator: user._id,
        startCode: starterCode,
        referenceSolution
      };
      setIsLoading(true);
      // Make API call
      const response = await axiosClient.post('/problem/create', formData);
      
      // Show success message
      alert(response.data.message);
      
      // Reset form
      setVisibleTestCases([{ input: '', output: '', explanation: '' }]);
      setHiddenTestCases([{ input: '', output: '' }]);
      setSelectedTag("");
    } catch (err) {
      if (err.response) {
        alert(`Error: ${err.response.data.message}`);
      } else if (err.request) {
        alert('Network error: No response from server');
      } else {
        alert(`Error: ${err.message}`);
      }
      console.log(err)
    }
    finally {
      setIsLoading(false); // Hide loader regardless of outcome
    }

  };
  
  // Add a visible test case
  const addVisibleTestCase = () => {
    setVisibleTestCases([...visibleTestCases, { input: '', output: '', explanation: '' }]);
  };
  
  // Remove a visible test case
  const removeVisibleTestCase = (index) => {
    if (visibleTestCases.length > 1) {
      const newCases = [...visibleTestCases];
      newCases.splice(index, 1);
      setVisibleTestCases(newCases);
    }
  };
  
  // Add a hidden test case
  const addHiddenTestCase = () => {
    setHiddenTestCases([...hiddenTestCases, { input: '', output: '' }]);
  };
  
  // Remove a hidden test case
  const removeHiddenTestCase = (index) => {
    if (hiddenTestCases.length > 1) {
      const newCases = [...hiddenTestCases];
      newCases.splice(index, 1);
      setHiddenTestCases(newCases);
    }
  };
  
  // Handle test case input change
  const handleTestCaseChange = (index, field, value, type) => {
    if (type === 'visible') {
      const newCases = [...visibleTestCases];
      newCases[index][field] = value;
      setVisibleTestCases(newCases);
    } else {
      const newCases = [...hiddenTestCases];
      newCases[index][field] = value;
      setHiddenTestCases(newCases);
    }
  };
  
  // Toggle tag selection - now single selection
  const toggleTag = (tag) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
  };

  // Handle starter code change
  const handleStarterCodeChange = (language, value) => {
    const updatedCode = starterCode.map(item => 
      item.language === language ? { ...item, initialCode: value } : item
    );
    setStarterCode(updatedCode);
  };

  // Handle solution code change
  const handleSolutionCodeChange = (language, value) => {
    const updatedSolution = referenceSolution.map(item => 
      item.language === language ? { ...item, completeCode: value } : item
    );
    setReferenceSolution(updatedSolution);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          Create New Coding Problem
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
          {/* Problem Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-lg font-medium mb-2 text-indigo-300">
              Problem Title
            </label>
            <input
              id="title"
              placeholder="e.g., Subtract Two Numbers"
              className={`w-full px-4 py-3 rounded-lg bg-gray-700/80 border ${
                errors.title ? 'border-red-500' : 'border-gray-600'
              } focus:border-indigo-500 focus:outline-none transition-colors`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="mt-2 text-red-400">{errors.title.message}</p>
            )}
          </div>
          
          {/* Problem Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-lg font-medium mb-2 text-indigo-300">
              Problem Description
            </label>
            <textarea
              id="description"
              placeholder="Describe the problem in detail..."
              rows="4"
              className={`w-full px-4 py-3 rounded-lg bg-gray-700/80 border ${
                errors.description ? 'border-red-500' : 'border-gray-600'
              } focus:border-indigo-500 focus:outline-none transition-colors`}
              {...register("description", { required: "Description is required" })}
            ></textarea>
            {errors.description && (
              <p className="mt-2 text-red-400">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-lg font-medium mb-2 text-indigo-300">
                Difficulty
              </label>
              <select
                id="difficulty"
                className="w-full px-4 py-3 rounded-lg bg-gray-700/80 border border-gray-600 focus:border-indigo-500 focus:outline-none"
                {...register("difficulty", { required: "Please select a difficulty level" })}
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty && (
                <p className="mt-2 text-red-400">{errors.difficulty.message}</p>
              )}
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-lg font-medium mb-2 text-indigo-300">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                        : 'bg-gray-700/80 hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {!selectedTag && (
                <p className="mt-2 text-yellow-400">Select a tag</p>
              )}
            </div>
          </div>
          
          {/* Visible Test Cases */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-lg font-medium text-indigo-300">
                Visible Test Cases
              </label>
              <button
                type="button"
                onClick={addVisibleTestCase}
                className="px-3 py-1 bg-indigo-600 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
              >
                Add Test Case
              </button>
            </div>
            
            {visibleTestCases.map((testCase, index) => (
              <div key={index} className="mb-4 bg-gray-700/60 p-4 rounded-lg border border-gray-600">
                <div className="flex justify-between mb-2">
                  <span className="text-indigo-300">Test Case {index + 1}</span>
                  {visibleTestCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVisibleTestCase(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">Input</label>
                    <textarea
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value, 'visible')}
                      placeholder="Input values"
                      className="w-full px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none"
                      rows="2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">Expected Output</label>
                    <textarea
                      value={testCase.output}
                      onChange={(e) => handleTestCaseChange(index, 'output', e.target.value, 'visible')}
                      placeholder="Expected output"
                      className="w-full px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none"
                      rows="2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">Explanation</label>
                    <textarea
                      value={testCase.explanation}
                      onChange={(e) => handleTestCaseChange(index, 'explanation', e.target.value, 'visible')}
                      placeholder="Explanation for this test case"
                      className="w-full px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none"
                      rows="2"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Hidden Test Cases */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-lg font-medium text-indigo-300">
                Hidden Test Cases
              </label>
              <button
                type="button"
                onClick={addHiddenTestCase}
                className="px-3 py-1 bg-indigo-600 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
              >
                Add Test Case
              </button>
            </div>
            
            {hiddenTestCases.map((testCase, index) => (
              <div key={index} className="mb-4 bg-gray-700/60 p-4 rounded-lg border border-gray-600">
                <div className="flex justify-between mb-2">
                  <span className="text-indigo-300">Test Case {index + 1}</span>
                  {hiddenTestCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHiddenTestCase(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">Input</label>
                    <textarea
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value, 'hidden')}
                      placeholder="Input values"
                      className="w-full px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none"
                      rows="2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">Expected Output</label>
                    <textarea
                      value={testCase.output}
                      onChange={(e) => handleTestCaseChange(index, 'output', e.target.value, 'hidden')}
                      placeholder="Expected output"
                      className="w-full px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none"
                      rows="2"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Starter Code Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-indigo-300 border-b border-indigo-500 pb-2">
              Starter Code
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {starterCode.map((langObj) => (
                <div key={langObj.language} className="bg-gray-700/60 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      langObj.language === 'cpp' ? 'bg-blue-500' :
                      langObj.language === 'java' ? 'bg-red-500' :
                      langObj.language === 'javascript' ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}></div>
                    <h3 className="font-medium">{langObj.language}</h3>
                  </div>
                  <textarea
                    value={langObj.initialCode}
                    onChange={(e) => handleStarterCodeChange(langObj.language, e.target.value)}
                    className="w-full h-48 px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Reference Solution Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-indigo-300 border-b border-indigo-500 pb-2">
              Reference Solution
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {referenceSolution.map((langObj) => (
                <div key={langObj.language} className="bg-gray-700/60 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      langObj.language === 'cpp' ? 'bg-blue-500' :
                      langObj.language === 'java' ? 'bg-red-500' :
                      langObj.language === 'javascript' ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}></div>
                    <h3 className="font-medium">{langObj.language}</h3>
                  </div>
                  <textarea
                    value={langObj.completeCode}
                    onChange={(e) => handleSolutionCodeChange(langObj.language, e.target.value)}
                    className="w-full h-48 px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Created By */}
          <div className="mb-8">
            <label htmlFor="createdBy" className="block text-lg font-medium mb-2 text-indigo-300">
              Created By
            </label>
            <input
              id="createdBy"
              type="text"
              value={user ? user.firstName : "Loading..."}
              readOnly
              className="w-full px-4 py-3 rounded-lg bg-gray-700/60 border border-gray-600 cursor-not-allowed opacity-70"
            />
          </div>
          
          {/* Submit Button */}
           <div className="text-center mt-10">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-lg font-semibold transition-all shadow-lg transform hover:-translate-y-0.5 ${
                isLoading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/30'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </div>
              ) : 'Create Problem'}
            </button>
          </div>
        </form>
      </div>
      
     
    </div>
  );
}

export default Addproblem;