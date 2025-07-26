import React from "react";
import Navbar from "../../../componenets/Navbar";
import { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import { useForm } from "react-hook-form";

function UpdateProblem() {
  // Existing states
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [tags, setTags] = useState([]);
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New states for editing
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [editingProblem, setEditingProblem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Track deleting problem
  const [successMessage, setSuccessMessage] = useState(null); // Success messages

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // State for test cases
  const [visibleTestCases, setVisibleTestCases] = useState([
    { input: "", output: "", explanation: "" },
  ]);
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: "", output: "" },
  ]);

  // State for tags
  const [selectedTag, setSelectedTag] = useState("");

  // State for code editors
  const [starterCode, setStarterCode] = useState([
    { language: "cpp", initialCode: "" },
    { language: "java", initialCode: "" },
    { language: "javascript", initialCode: "" },
    { language: "python", initialCode: "" },
  ]);

  const [referenceSolution, setReferenceSolution] = useState([
    { language: "cpp", completeCode: "" },
    { language: "java", completeCode: "" },
    { language: "javascript", completeCode: "" },
    { language: "python", completeCode: "" },
  ]);

  // Tag options
  const tagOptions = [
    "Array",
    "Linked List",
    "Graphs",
    "Trees",
    "Dynamic Programming",
    "Strings",
    "Sorting",
    "Searching",
    "Stack",
    "Queue",
    "Hash Table",
    "Heap",
    "Greedy",
    "Backtracking",
    "Math",
    "Bit Manipulation",
  ];

  // Fetch problems
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("problem/getAllProblem");
      setProblems(data);
      extractTags(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch problems. Please try again later.");
      setLoading(false);
    }
  };

  // Extract unique tags
  const extractTags = (problems) => {
    const allTags = [];
    problems.forEach((problem) => {
      if (problem.tags) {
        problem.tags.split(",").forEach((tag) => {
          if (!allTags.includes(tag.trim()) && tag.trim() !== "") {
            allTags.push(tag.trim());
          }
        });
      }
    });
    setTags(allTags);
  };

  // Fetch problem details for editing
  const fetchProblemDetails = async (problemId) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `problem/problemById/${problemId}`
      );

      if (data) {
        setEditingProblem(data);
        setIsEditing(true);

        // Set form values from fetched problem
        reset({
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
        });

        // Set tags
        setSelectedTag(data.tags);

        // Set test cases
        if (data.visibleTestCases && data.visibleTestCases.length > 0) {
          setVisibleTestCases(data.visibleTestCases);
        }

        // Set hidden test cases (ensure we reset even if it's empty)
        setHiddenTestCases(
          data.hiddenTestCases && data.hiddenTestCases.length > 0
            ? data.hiddenTestCases
            : [{ input: "", output: "" }]
        );

        // Set starter code
        if (data.startCode && data.startCode.length > 0) {
          setStarterCode(data.startCode);
        }

        // Set reference solution
        if (data.referenceSolution && data.referenceSolution.length > 0) {
          setReferenceSolution(data.referenceSolution);
        }
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch problem details. Please try again later.");
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (problem) => {
    const confirmEdit = window.confirm(`Are you sure you want to edit "${problem.title}"?`);
    if (confirmEdit) {
      setSelectedProblem(problem);
      fetchProblemDetails(problem._id);
    }
  };

  // Handle form submission for updating
  const handleUpdateProblem = async (formData) => {
    if (!selectedTag) {
      setFormError("Please select a tag");
      return;
    }

    try {
      setIsUpdating(true);
      setFormError(null);

      // Construct updated problem data
      const updatedProblem = {
        ...formData,
        tags: selectedTag,
        visibleTestCases,
        hiddenTestCases,
        startCode: starterCode,
        referenceSolution,
      };

      // Make API call to update
      const response = await axiosClient.put(
        `/problem/update/${selectedProblem._id}`,
        updatedProblem
      );

      // Show success message
      setSuccessMessage(`Problem "${formData.title}" updated successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Refresh problem list
      fetchProblems();

      // Exit edit mode
      setIsEditing(false);
      setSelectedProblem(null);
      setEditingProblem(null);
    } catch (err) {
      if (err.response) {
        setFormError(`Error: ${err.response.data.message}`);
      } else if (err.request) {
        setFormError("Network error: No response from server");
      } else {
        setFormError(`Error: ${err.message}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel editing? All changes will be lost.");
    if (confirmCancel) {
      setIsEditing(false);
      setSelectedProblem(null);
      setEditingProblem(null);
      setFormError(null);
    }
  };

  // Test case handlers (same as in AddProblem)
  const addVisibleTestCase = () => {
    setVisibleTestCases([
      ...visibleTestCases,
      { input: "", output: "", explanation: "" },
    ]);
  };

  const removeVisibleTestCase = (index) => {
    if (visibleTestCases.length > 1) {
      const newCases = [...visibleTestCases];
      newCases.splice(index, 1);
      setVisibleTestCases(newCases);
    }
  };

  const addHiddenTestCase = () => {
    setHiddenTestCases([...hiddenTestCases, { input: "", output: "" }]);
  };

  const removeHiddenTestCase = (index) => {
    if (hiddenTestCases.length > 1) {
      const newCases = [...hiddenTestCases];
      newCases.splice(index, 1);
      setHiddenTestCases(newCases);
    }
  };

  const handleTestCaseChange = (index, field, value, type) => {
    if (type === "visible") {
      const newCases = [...visibleTestCases];
      newCases[index][field] = value;
      setVisibleTestCases(newCases);
    } else {
      const newCases = [...hiddenTestCases];
      newCases[index][field] = value;
      setHiddenTestCases(newCases);
    }
  };

  // Delete problem with confirmation
  const deleteProblem = async (problem) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${problem.title}"? This action cannot be undone.`);
    
    if (confirmDelete) {
      try {
        setDeletingId(problem._id);
        await axiosClient.delete(`/problem/delete/${problem._id}`);
        setSuccessMessage(`Problem "${problem.title}" deleted successfully!`);
        setTimeout(() => setSuccessMessage(null), 5000);
        fetchProblems();
      } catch (error) {
        setError(`Failed to delete problem: ${error.response?.data?.message || error.message}`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const toggleTag = (tag) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
  };

  const handleStarterCodeChange = (language, value) => {
    const updatedCode = starterCode.map((item) =>
      item.language === language ? { ...item, initialCode: value } : item
    );
    setStarterCode(updatedCode);
  };

  const handleSolutionCodeChange = (language, value) => {
    const updatedSolution = referenceSolution.map((item) =>
      item.language === language ? { ...item, completeCode: value } : item
    );
    setReferenceSolution(updatedSolution);
  };

  // Render difficulty badge
  const renderDifficulty = (difficulty) => {
    let color = "";
    switch (difficulty) {
      case "easy":
        color = "bg-green-600";
        break;
      case "medium":
        color = "bg-yellow-600";
        break;
      case "hard":
        color = "bg-red-600";
        break;
      default:
        color = "bg-gray-600";
    }
    return (
      <span
        className={`${color} text-white px-2 py-1 rounded text-xs capitalize`}
      >
        {difficulty}
      </span>
    );
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (problems.length === 0) return;

    let result = [...problems];

    // Apply filters
    if (searchTerm) {
      result = result.filter((problem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter !== "all") {
      result = result.filter(
        (problem) => problem.difficulty === difficultyFilter
      );
    }

    if (tagFilter !== "all") {
      result = result.filter((problem) => problem.tags.includes(tagFilter));
    }

    // Apply pagination
    const paginatedResult = result.slice(0, page * itemsPerPage);
    setFilteredProblems(paginatedResult);

    // Check if there are more items to load
    setHasMore(paginatedResult.length < result.length);
  }, [problems, searchTerm, difficultyFilter, tagFilter, page]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      {isEditing ? (
        // Edit Problem Form
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Edit Problem: {editingProblem?.title}
          </h1>

          {formError && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-300">{formError}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg">
              <p className="text-green-300">{successMessage}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(handleUpdateProblem)}
            className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700"
          >
            {/* Problem Title */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-lg font-medium mb-2 text-indigo-300"
              >
                Problem Title
              </label>
              <input
                id="title"
                placeholder="e.g., Subtract Two Numbers"
                className={`w-full px-4 py-3 rounded-lg bg-gray-700/80 border ${
                  errors.title ? "border-red-500" : "border-gray-600"
                } focus:border-indigo-500 focus:outline-none transition-colors`}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="mt-2 text-red-400">{errors.title.message}</p>
              )}
            </div>

            {/* Problem Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-lg font-medium mb-2 text-indigo-300"
              >
                Problem Description
              </label>
              <textarea
                id="description"
                placeholder="Describe the problem in detail..."
                rows="4"
                className={`w-full px-4 py-3 rounded-lg bg-gray-700/80 border ${
                  errors.description ? "border-red-500" : "border-gray-600"
                } focus:border-indigo-500 focus:outline-none transition-colors`}
                {...register("description", {
                  required: "Description is required",
                })}
              ></textarea>
              {errors.description && (
                <p className="mt-2 text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Difficulty */}
              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-lg font-medium mb-2 text-indigo-300"
                >
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700/80 border border-gray-600 focus:border-indigo-500 focus:outline-none"
                  {...register("difficulty", {
                    required: "Please select a difficulty level",
                  })}
                >
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <p className="mt-2 text-red-400">
                    {errors.difficulty.message}
                  </p>
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
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                          : "bg-gray-700/80 hover:bg-gray-600"
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
                <div
                  key={index}
                  className="mb-4 bg-gray-700/60 p-4 rounded-lg border border-gray-600"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-indigo-300">
                      Test Case {index + 1}
                    </span>
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
                      <label className="block text-sm mb-1 text-gray-400">
                        Input
                      </label>
                      <textarea
                        value={testCase.input}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            "input",
                            e.target.value,
                            "visible"
                          )
                        }
                        placeholder="Input values"
                        className="w-full px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none"
                        rows="2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-400">
                        Expected Output
                      </label>
                      <textarea
                        value={testCase.output}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            "output",
                            e.target.value,
                            "visible"
                          )
                        }
                        placeholder="Expected output"
                        className="w-full px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none"
                        rows="2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-400">
                        Explanation
                      </label>
                      <textarea
                        value={testCase.explanation}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            "explanation",
                            e.target.value,
                            "visible"
                          )
                        }
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
                <div
                  key={index}
                  className="mb-4 bg-gray-700/60 p-4 rounded-lg border border-gray-600"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-indigo-300">
                      Test Case {index + 1}
                    </span>
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
                      <label className="block text-sm mb-1 text-gray-400">
                        Input
                      </label>
                      <textarea
                        value={testCase.input}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            "input",
                            e.target.value,
                            "hidden"
                          )
                        }
                        placeholder="Input values"
                        className="w-full px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none"
                        rows="2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-400">
                        Expected Output
                      </label>
                      <textarea
                        value={testCase.output}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            "output",
                            e.target.value,
                            "hidden"
                          )
                        }
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
                  <div
                    key={langObj.language}
                    className="bg-gray-700/60 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          langObj.language === "cpp"
                            ? "bg-blue-500"
                            : langObj.language === "java"
                            ? "bg-red-500"
                            : langObj.language === "javascript"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <h3 className="font-medium">{langObj.language}</h3>
                    </div>
                    <textarea
                      value={langObj.initialCode}
                      onChange={(e) =>
                        handleStarterCodeChange(
                          langObj.language,
                          e.target.value
                        )
                      }
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
                  <div
                    key={langObj.language}
                    className="bg-gray-700/60 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          langObj.language === "cpp"
                            ? "bg-blue-500"
                            : langObj.language === "java"
                            ? "bg-red-500"
                            : langObj.language === "javascript"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <h3 className="font-medium">{langObj.language}</h3>
                    </div>
                    <textarea
                      value={langObj.completeCode}
                      onChange={(e) =>
                        handleSolutionCodeChange(
                          langObj.language,
                          e.target.value
                        )
                      }
                      className="w-full h-48 px-3 py-2 rounded bg-gray-600 border border-gray-500 focus:border-indigo-400 focus:outline-none font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors ${
                  isUpdating ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isUpdating ? "Updating..." : "Update Problem"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Problem Management View
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Problem Management
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg">
              <p className="text-green-300">{successMessage}</p>
            </div>
          )}

          {/* Filter Section */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Search by Title
                </label>
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Difficulty
                </label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  <option value="all">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition duration-200"
                  onClick={() => {
                    setSearchTerm("");
                    setDifficultyFilter("all");
                    setTagFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-lg font-semibold text-indigo-400">
                Total Problems
              </div>
              <div className="text-3xl font-bold mt-2">{problems.length}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-lg font-semibold text-green-400">
                Easy Problems
              </div>
              <div className="text-3xl font-bold mt-2">
                {problems.filter((p) => p.difficulty === "easy").length}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-lg font-semibold text-yellow-400">
                Unique Tags
              </div>
              <div className="text-3xl font-bold mt-2">{tags.length}</div>
            </div>
          </div>

          {/* Problems List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <div
                  key={problem._id}
                  className="bg-gray-800 rounded-lg p-4 shadow-lg hover:bg-gray-750 transition duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-indigo-300">
                      {problem.title}
                    </h3>
                    {renderDifficulty(problem.difficulty)}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 mb-4">
                    {problem.tags.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditClick(problem)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProblem(problem)}
                      disabled={deletingId === problem._id}
                      className={`bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-200 ${
                        deletingId === problem._id ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {deletingId === problem._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <div className="text-xl text-gray-400">
                  No problems found matching your filters
                </div>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mb-8">
              <button
                onClick={() => setPage(page + 1)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-200"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UpdateProblem;