import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import Navbar from "../../componenets/Navbar";
import Editor from "@monaco-editor/react";
import {
  FiLock,
  FiCode,
  FiList,
  FiMessageSquare,
  FiPlay,
  FiSend,
  FiRefreshCw,
  FiClock,
  FiCpu,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiMinus,
  FiMaximize2,
  FiChevronUp,
  FiChevronDown,
  FiYoutube,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Submissiontab from "./Admincontroller/Submissiontab";
import { useSelector } from "react-redux";
import Chatbot from "../../componenets/Navbarfeatures/Chatbot";
import ReactMarkdown from "react-markdown";
import { useMediaQuery } from "react-responsive";

function ProblemContent() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("//");
  const [result, setResult] = useState([]);
  const [status, setStatus] = useState("");
  const editorRef = useRef(null);
  const [submitStatus, setSubmitStatus] = useState("");
  const [submitResult, setSubmitResult] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usersubmisiion, setUsersubmission] = useState([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [solutions, setSolutions] = useState({});
  const [videos, setVideos] = useState({});
  const [selectedSolutionLang, setSelectedSolutionLang] = useState("c++");
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  
  const viterazorpaykeyid = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  // Responsive breakpoints
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(`problem/problemById/${id}`);
        setProblem(data);

        const initialCode =
          data.startCode.find(
            (sc) => sc.language.toLowerCase() === "javascript"
          )?.initialCode || "//";
        setCode(initialCode);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
  }, [id]);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) return;

      try {
        const response = await axiosClient.post("/premium/premiumdetails", {
          userid: user._id,
        });
        setIsPremiumUser(response.data.isPremium);
      } catch (err) {
        console.error("Error checking premium status:", err);
      }
    };

    checkPremiumStatus();
  }, [user]);

  const loadSolutions = () => {
    if (!problem || !problem.referenceSolution) return;

    try {
      const refSolutions = {};
      const refVideos = {};

      problem.referenceSolution.forEach((solObj) => {
        const lang = solObj.language;
        refSolutions[lang] = solObj.completeCode;

        if (solObj.video) {
          refVideos[lang] = solObj.video;
        }
      });

      setSolutions(refSolutions);
      setVideos(refVideos);
    } catch (err) {
      console.error("Error loading solutions:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "solutions" && isPremiumUser && problem) {
      loadSolutions();
    }
  }, [activeTab, isPremiumUser, problem]);

  const submittedProblem = async () => {
    try {
      const response = await axiosClient.get(`/problem/submittedProblem/${id}`);
      setUsersubmission(response.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const handleSubmit = async () => {
    if (!editorRef.current) return;

    setIsRunning(true);
    const currentCode = editorRef.current.getValue();
    const languageId = language;
    const reply = {
      code: currentCode,
      language: languageId,
    };

    try {
      const response = await axiosClient.post(`submission/run/${id}`, reply);
      setResult(response.data.results);
      setStatus(response.data.overallStatus);
      setActiveTab("testcases");
      setIsConsoleOpen(true);
    } catch (error) {
      console.error("Error running code:", error);
      setStatus("Error");
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    loadRazorpayScript();
  }, [id]);

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

  const handlepremium = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Check premium status again before proceeding
      const statusResponse = await axiosClient.post("/premium/premiumdetails", {
        userid: user._id,
      });

      const premiumId = statusResponse.data.id;
      if (statusResponse.data.isPremium) {
        setIsPremiumUser(true);
        setActiveTab("solutions");
        setIsProcessingPayment(false);
        return;
      }

      const verifyPayment = async (razorpayResponse) => {
        try {
          const response = await axiosClient.post("/goodies/paymentverify", {
            productId: user._id,
            order_id: razorpayResponse.razorpay_order_id,
            payment_id: razorpayResponse.razorpay_payment_id,
            signature: razorpayResponse.razorpay_signature,
          });

          if (response.data.success) {
            setIsPremiumUser(true);
            await axiosClient.get(`/premium/activatepremium/${premiumId}`);

            // Fetch solutions and videos after activation
            setActiveTab("solutions");
          } else {
            setPaymentError("Payment verification failed");
          }
        } catch (err) {
          console.error("Error verifying payment:", err);
          setPaymentError("Error verifying payment");
        } finally {
          setIsProcessingPayment(false);
        }
      };

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // Create order - now with 2000 INR (200000 paise)
      const orderResponse = await axiosClient.get(
        `/premium/subscription/${statusResponse.data.id}`
      );
      const orderData = orderResponse.data;

      const options = {
        key: viterazorpaykeyid,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: "CodingSeekho Premium",
        description: "Unlock premium content and solutions",
        image: "/logo.png",
        handler: async (razorpayResponse) => {
          await verifyPayment(razorpayResponse);
        },
        prefill: {
          name: user?.firstName
            ? `${user.firstName} ${user.lastName}`
            : "Customer",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed:", err);
      setPaymentError("Failed to initialize payment");
      setIsProcessingPayment(false);
    }
  };

  const submitCode = async () => {
    if (!editorRef.current) return;

    setIsSubmitting(true);
    const currentCode = editorRef.current.getValue();
    const languageId = language;
    const reply = {
      code: currentCode,
      language: languageId,
    };

    try {
      const response = await axiosClient.post(`submission/submit/${id}`, reply);

      setSubmitResult(response.data.results);
      setSubmitStatus(response.data.overallStatus);
      setActiveTab("submission");
      setIsConsoleOpen(true);
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitStatus("Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);

    if (!problem) return;

    const langCode =
      problem.startCode.find(
        (sc) => sc.language.toLowerCase() === selectedLanguage.toLowerCase()
      )?.initialCode || "";

    setCode(langCode);
  };

  const handleReset = () => {
    if (!problem) return;

    const reset = problem.startCode.find(
      (item) => item.language.toLowerCase() === language.toLowerCase()
    );

    if (reset && editorRef.current) {
      const response = window.confirm(
        "Are you sure you want to reset your code? All changes will be lost."
      );
      if (response) {
        editorRef.current.setValue(reset.initialCode);
      }
    }
    setSubmitStatus("");
    setStatus("");
    setResult([]);
    setSubmitResult([]);
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const getMaxMetrics = () => {
    if (!submitResult || submitResult.length === 0) return null;

    const maxTime = Math.max(
      ...submitResult.map((item) => parseFloat(item.time))
    );
    const maxMemory = Math.max(
      ...submitResult.map((item) => parseFloat(item.memory))
    );

    return {
      time: maxTime.toFixed(3),
      memory: maxMemory.toFixed(1),
    };
  };

  const maxMetrics = getMaxMetrics();

  // Get solution for currently selected language
  const getSolutionCode = () => {
    if (!solutions || !selectedSolutionLang) return "// Loading solution...";
    return (
      solutions[selectedSolutionLang] ||
      "// Solution not available for this language"
    );
  };

  // Get video for currently selected language
  const getLanguageVideo = () => {
    return videos[selectedSolutionLang] || null;
  };

  // Toggle mobile panel
  const toggleMobilePanel = () => {
    setIsMobilePanelOpen(!isMobilePanelOpen);
  };

  // Close mobile panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMobilePanelOpen && 
        !e.target.closest(".mobile-panel") &&
        !e.target.closest("#mobile-panel-toggle")
      ) {
        setIsMobilePanelOpen(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobilePanelOpen]);

  return (
    <>
      <div className="flex flex-col h-screen bg-[#1e3c47] text-[#f0e6d8]">
        <Navbar />

        {/* Mobile Panel Toggle Button */}
        {isMobile && (
          <div className="fixed top-16 right-4 z-50">
            <button
              id="mobile-panel-toggle"
              onClick={toggleMobilePanel}
              className="bg-[#2a5d6e] p-2 rounded-lg shadow-lg z-40"
            >
              {isMobilePanelOpen ? (
                <FiX className="text-xl text-white" />
              ) : (
                <FiMenu className="text-xl text-white" />
              )}
            </button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Problem Content */}
          <div
            className={`mobile-panel ${
              isEditorMaximized ? "hidden" : 
              isMobile ? (isMobilePanelOpen ? "fixed inset-0 z-40 bg-[#1e3c47] overflow-y-auto" : "hidden") : 
              "w-full md:w-[60%]"
            } flex flex-col border-r border-[#6a3a30] overflow-hidden transition-all duration-300`}
          >
            {/* Mobile Panel Header */}
            {isMobile && isMobilePanelOpen && (
              <div className="p-4 bg-[#1a3641] border-b border-[#6a3a30] flex justify-between items-center">
                <h2 className="text-xl font-bold">Problem Panel</h2>
                <button 
                  onClick={toggleMobilePanel}
                  className="p-1 rounded-full hover:bg-[#2a5d6e]"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            )}
            
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-[#6a3a30] bg-[#1a3641]">
              <button
                className={`px-3 py-2 text-sm md:text-base md:px-4 md:py-3 font-medium flex items-center transition-all ${
                  activeTab === "description"
                    ? "text-[#a0c4e0] border-b-2 border-[#a0c4e0] bg-[#244855]"
                    : "text-[#f0e6d8]/70 hover:text-[#f0e6d8] hover:bg-[#244855]/50"
                }`}
                onClick={() => {
                  setActiveTab("description");
                  if (isMobile) setIsMobilePanelOpen(false);
                }}
              >
                <FiCode className="mr-1 md:mr-2" /> 
                <span className="hidden sm:inline">Description</span>
              </button>
              
              <button
                className={`px-3 py-2 text-sm md:text-base md:px-4 md:py-3 font-medium flex items-center transition-all ${
                  activeTab === "solutions"
                    ? "text-[#ff7d6b] border-b-2 border-[#ff7d6b] bg-[#244855]"
                    : "text-[#f0e6d8]/70 hover:text-[#f0e6d8] hover:bg-[#244855]/50"
                }`}
                onClick={() => {
                  setActiveTab("solutions");
                  if (isMobile) setIsMobilePanelOpen(false);
                }}
              >
                <FiLock className="mr-1 md:mr-2" /> 
                <span className="hidden sm:inline">Solutions</span>
              </button>
              
              <button
                className={`px-3 py-2 text-sm md:text-base md:px-4 md:py-3 font-medium flex items-center transition-all ${
                  activeTab === "submissions"
                    ? "text-[#a0c4e0] border-b-2 border-[#a0c4e0] bg-[#244855]"
                    : "text-[#f0e6d8]/70 hover:text-[#f0e6d8] hover:bg-[#244855]/50"
                }`}
                onClick={() => {
                  setActiveTab("submissions");
                  submittedProblem();
                  if (isMobile) setIsMobilePanelOpen(false);
                }}
              >
                <FiList className="mr-1 md:mr-2" /> 
                <span className="hidden sm:inline">Submissions</span>
              </button>
              
              <button
                className={`px-3 py-2 text-sm md:text-base md:px-4 md:py-3 font-medium flex items-center transition-all ${
                  activeTab === "chatbot"
                    ? "text-[#a0c4e0] border-b-2 border-[#a0c4e0] bg-[#244855]"
                    : "text-[#f0e6d8]/70 hover:text-[#f0e6d8] hover:bg-[#244855]/50"
                }`}
                onClick={() => {
                  setActiveTab("chatbot");
                  if (isMobile) setIsMobilePanelOpen(false);
                }}
              >
                <FiMessageSquare className="mr-1 md:mr-2" /> 
                <span className="hidden sm:inline">Chatbot</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-2 md:p-4 bg-[#1a3641]">
              {activeTab === "description" && problem && (
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 p-3 md:p-4 bg-[#244855] rounded-xl border border-[#6a3a30]">
                    <h1 className="text-xl md:text-2xl font-bold text-[#f0e6d8] mb-2 md:mb-0">
                      {problem.title}
                    </h1>
                    <span
                      className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium self-start md:self-auto ${
                        problem.difficulty === "Easy"
                          ? "bg-[#2a5d6e] text-[#a0c4e0]"
                          : problem.difficulty === "Medium"
                          ? "bg-[#6a3a30] text-[#f0e6d8]"
                          : "bg-[#ff7d6b]/30 text-[#f0e6d8]"
                      } border border-[#6a3a30]`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="max-w-none bg-[#244855] p-3 md:p-4 rounded-xl border border-[#6a3a30] text-[#f0e6d8]">
                    <div className="space-y-3 md:space-y-5">
                      <ReactMarkdown
                        components={{
                          code: ({ node, ...props }) => (
                            <code
                              className="bg-[#1a3c46] px-2 py-1 rounded font-mono text-xs md:text-sm"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="mb-3 md:mb-4 leading-relaxed" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-lg md:text-xl font-bold mt-6 md:mt-8 mb-2 md:mb-3 border-b pb-2"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {problem.description || ""}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "solutions" && !isPremiumUser && (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-[#244855] p-6 md:p-8 rounded-2xl text-center max-w-md border border-[#6a3a30]">
                    <div className="inline-flex items-center justify-center p-3 bg-[#6a3a30] rounded-full mb-4 border border-[#6a3a30]">
                      <FiLock className="text-2xl md:text-3xl text-[#f0e6d8]" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#f0e6d8]">
                      Premium Feature
                    </h2>
                    <p className="text-[#f0e6d8] mb-2">
                      Unlock all solutions and premium content with CodingSeekho
                      Premium
                    </p>
                    <p className="text-[#f0e6d8] mb-4">
                      <span className="text-lg md:text-xl font-bold">₹2000</span> for 1
                      year
                    </p>
                    <button
                      onClick={handlepremium}
                      disabled={isProcessingPayment}
                      className={`bg-[#ff7d6b] text-[#1e1e1e] px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all ${
                        isProcessingPayment
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:opacity-90"
                      }`}
                    >
                      {isProcessingPayment
                        ? "Processing..."
                        : "Upgrade to Premium"}
                    </button>
                    {paymentError && (
                      <p className="text-[#ff7d6b] mt-3 md:mt-4">{paymentError}</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "solutions" && isPremiumUser && (
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 p-3 md:p-4 bg-[#244855] rounded-xl border border-[#6a3a30]">
                    <h1 className="text-xl md:text-2xl font-bold text-[#a0c4e0] mb-2 md:mb-0">
                      {problem?.title} Solutions
                    </h1>
                    <div className="flex items-center bg-[#2a5d6e] px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm self-start md:self-auto border border-[#6a3a30]">
                      <span className="text-[#a0c4e0]">Premium</span>
                      <span className="ml-1 md:ml-2 bg-[#a0c4e0] text-[#1a3641] px-1.5 py-0.5 rounded-full text-2xs md:text-xs">
                        1 year left
                      </span>
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="bg-[#1a3641] p-3 md:p-4 rounded-xl border border-[#6a3a30]">
                    <label className="text-[#f0e6d8] mr-2 md:mr-3">
                      Solution Language:
                    </label>
                    <select
                      value={selectedSolutionLang}
                      onChange={(e) => setSelectedSolutionLang(e.target.value)}
                      className="bg-[#244855] text-[#f0e6d8] rounded-lg px-2 py-1 md:px-3 md:py-2 focus:outline-none border border-[#6a3a30] text-sm md:text-base"
                    >
                      {Object.keys(solutions).map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Video Solution */}
                  <div className="bg-[#1a3641] p-3 md:p-4 rounded-xl border border-[#6a3a30]">
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3 text-[#a0c4e0] flex items-center">
                      <FiYoutube className="mr-2 text-red-500" /> Video Solution
                    </h3>
                    {getLanguageVideo() ? (
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          src={getLanguageVideo()}
                          title="Video solution"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-48 md:h-80 rounded-lg"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-40 md:h-64 text-[#f0e6d8] bg-[#244855] rounded-lg border border-[#6a3a30]">
                        Video solution not available for {selectedSolutionLang}
                      </div>
                    )}
                  </div>

                  {/* Solution Code */}
                  <div className="bg-[#1a3641] p-3 md:p-4 rounded-xl border border-[#6a3a30]">
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3 text-[#a0c4e0]">
                      Reference Solution
                    </h3>
                    <div className="h-64 md:h-96">
                      <Editor
                        height="100%"
                        theme="vs-dark"
                        language={
                          selectedSolutionLang === "cpp"
                            ? "cpp"
                            : selectedSolutionLang
                        }
                        value={getSolutionCode()}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 13,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          lineNumbersMinChars: 3,
                          padding: { top: 15, bottom: 15 },
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "submissions" && (
                <div className="bg-[#244855] rounded-xl border border-[#6a3a30]">
                  <Submissiontab usersubmisiion={usersubmisiion} />
                </div>
              )}

              {activeTab === "chatbot" && problem && (
                <Chatbot
                  title={problem.title}
                  description={problem.description}
                />
              )}

              {activeTab === "testcases" && (
                <div className="bg-[#244855] rounded-xl p-3 md:p-4 border border-[#6a3a30]">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-[#a0c4e0]">
                    Test Results
                  </h2>

                  <div
                    className={`flex items-center mb-3 md:mb-4 p-3 md:p-4 rounded-xl ${
                      status === "Accepted"
                        ? "bg-[#244855] border border-[#a0c4e0]"
                        : "bg-[#ff7d6b]/30 border border-[#ff7d6b]"
                    }`}
                  >
                    {status === "Accepted" ? (
                      <FiCheckCircle className="text-[#a0c4e0] text-lg md:text-xl mr-2 md:mr-3" />
                    ) : (
                      <FiXCircle className="text-[#ff7d6b] text-lg md:text-xl mr-2 md:mr-3" />
                    )}
                    <span
                      className={`font-medium text-base md:text-lg ${
                        status === "Accepted"
                          ? "text-[#a0c4e0]"
                          : "text-[#ff7d6b]"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    {result.map((item, index) => (
                      <div
                        key={index}
                        className={`p-3 md:p-4 rounded-xl ${
                          item.status === "Accepted"
                            ? "bg-[#244855] border border-[#a0c4e0]/30"
                            : "bg-[#ff7d6b]/20 border border-[#ff7d6b]/30"
                        }`}
                      >
                        <div className="flex items-center mb-2 md:mb-3">
                          <span
                            className={`font-medium ${
                              item.status === "Accepted"
                                ? "text-[#a0c4e0]"
                                : "text-[#ff7d6b]"
                            }`}
                          >
                            Test Case {index + 1}
                          </span>
                          <span className="ml-2 text-2xs md:text-xs bg-[#1a3641] px-2 py-0.5 md:px-2.5 md:py-1 rounded-full border border-[#6a3a30] text-[#f0e6d8]">
                            {item.time} s
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
                          <div>
                            <div className="text-[#f0e6d8]/70 text-2xs md:text-xs mb-1">
                              Input
                            </div>
                            <div className="bg-[#1a3641] p-2 md:p-3 rounded-lg font-mono break-all border border-[#6a3a30] text-[#f0e6d8]">
                              {item.stdin || "None"}
                            </div>
                          </div>

                          <div>
                            <div className="text-[#f0e6d8]/70 text-2xs md:text-xs mb-1">
                              Output
                            </div>
                            <div className="bg-[#1a3641] p-2 md:p-3 rounded-lg font-mono break-all border border-[#6a3a30] text-[#f0e6d8]">
                              {item.stdout || "None"}
                            </div>
                          </div>

                          <div>
                            <div className="text-[#f0e6d8]/70 text-2xs md:text-xs mb-1">
                              Expected
                            </div>
                            <div className="bg-[#1a3641] p-2 md:p-3 rounded-lg font-mono break-all border border-[#6a3a30] text-[#f0e6d8]">
                              {item.expected_output || "None"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "submission" && (
                <div className="bg-[#244855] rounded-xl p-3 md:p-4 border border-[#6a3a30]">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-[#a0c4e0]">
                    Submission Result
                  </h2>

                  <div
                    className={`flex items-center mb-3 md:mb-4 p-3 md:p-4 rounded-xl ${
                      submitStatus === "Accepted"
                        ? "bg-[#244855] border border-[#a0c4e0]"
                        : "bg-[#ff7d6b]/30 border border-[#ff7d6b]"
                    }`}
                  >
                    {submitStatus === "Accepted" ? (
                      <FiCheckCircle className="text-[#a0c4e0] text-lg md:text-xl mr-2 md:mr-3" />
                    ) : (
                      <FiXCircle className="text-[#ff7d6b] text-lg md:text-xl mr-2 md:mr-3" />
                    )}
                    <span
                      className={`font-medium text-base md:text-lg ${
                        submitStatus === "Accepted"
                          ? "text-[#a0c4e0]"
                          : "text-[#ff7d6b]"
                      }`}
                    >
                      {submitStatus}
                    </span>
                  </div>

                  {submitStatus && (
                    <div className="bg-[#1a3641] rounded-xl p-3 md:p-4 mb-4 md:mb-6 border border-[#6a3a30]">
                      <div className="flex space-x-4 md:space-x-6">
                        <div className="flex items-center">
                          <FiClock className="text-[#a0c4e0] mr-2 md:mr-3 text-base md:text-xl" />
                          <div>
                            <div className="text-2xs md:text-xs text-[#f0e6d8]/70">
                              Runtime
                            </div>
                            <div className="font-medium text-sm md:text-base text-[#f0e6d8]">
                              {maxMetrics?.time || "0.000"} s
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <FiCpu className="text-[#a0c4e0] mr-2 md:mr-3 text-base md:text-xl" />
                          <div>
                            <div className="text-2xs md:text-xs text-[#f0e6d8]/70">
                              Memory
                            </div>
                            <div className="font-medium text-sm md:text-base text-[#f0e6d8]">
                              {maxMetrics?.memory || "0.0"} MB
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 md:space-y-4">
                    {submitResult &&
                      submitResult.map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 md:p-4 rounded-xl ${
                            item.status === "Accepted"
                              ? "bg-[#244855] border border-[#a0c4e0]/30"
                              : "bg-[#ff7d6b]/20 border border-[#ff7d6b]/30"
                          }`}
                        >
                          <div className="flex items-center">
                            <span
                              className={`font-medium ${
                                item.status === "Accepted"
                                  ? "text-[#a0c4e0]"
                                  : "text-[#ff7d6b]"
                              }`}
                            >
                              Test Case {index + 1}
                            </span>
                            <span className="ml-2 text-2xs md:text-xs bg-[#1a3641] px-2 py-0.5 md:px-2.5 md:py-1 rounded-full border border-[#6a3a30] text-[#f0e6d8]">
                              {item.time} s
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Editor */}
          <div
            className={`${
              isEditorMaximized ? "w-full" : 
              isMobile ? (isMobilePanelOpen ? "hidden" : "w-full") : 
              "w-full md:w-[40%]"
            } flex flex-col bg-[#152a33] transition-all duration-300 relative`}
          >
            {/* Editor Header */}
            <div className="flex flex-wrap items-center justify-between px-2 py-1 md:px-4 md:py-3 bg-[#1a3641] border-b border-[#6a3a30]">
              <div className="flex items-center mb-1 md:mb-0">
                <span className="text-xs md:text-sm mr-1 md:mr-2 text-[#f0e6d8]/80">
                  Language:
                </span>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-[#244855] text-[#f0e6d8] rounded-lg px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm focus:outline-none border border-[#6a3a30]"
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 md:space-x-2">
                <button
                  onClick={() => setIsEditorMaximized(!isEditorMaximized)}
                  className="flex items-center text-sm text-[#f0e6d8] hover:text-[#a0c4e0] p-1 rounded-lg transition-colors"
                  title={
                    isEditorMaximized ? "Minimize Editor" : "Maximize Editor"
                  }
                >
                  {isEditorMaximized ? (
                    <FiMinus size={14} />
                  ) : (
                    <FiMaximize2 size={14} />
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center text-sm text-[#f0e6d8] hover:text-[#a0c4e0] p-1 rounded-lg transition-colors"
                >
                  <FiRefreshCw size={12} />
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="99%"
                theme="vs-dark"
                language={language === "c++" ? "cpp" : language}
                value={code}
                onMount={handleEditorMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  renderLineHighlight: "all",
                  lineNumbersMinChars: 3,
                  padding: { top: 15, bottom: 15 },
                }}
              />
            </div>

            {/* Console Header */}
            <div className="flex flex-wrap justify-between items-center px-2 py-1 md:px-4 md:py-2 bg-[#1a3641] border-t border-[#6a3a30]">
              <div className="flex items-center">
                <h3 className="font-medium text-xs md:text-sm text-[#f0e6d8] flex items-center">
                  Console
                  <button
                    onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                    className="ml-1 p-1 rounded text-[#f0e6d8] hover:text-[#a0c4e0]"
                  >
                    {isConsoleOpen ? (
                      <FiChevronDown size={12} />
                    ) : (
                      <FiChevronUp size={12} />
                    )}
                  </button>
                </h3>
              </div>
              <div className="flex space-x-1 md:space-x-2">
                <button
                  onClick={handleSubmit}
                  disabled={isRunning}
                  className={`flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-medium ${
                    isRunning
                      ? "bg-[#ff7d6b]/60 text-[#f0e6d8]/60 cursor-not-allowed"
                      : "bg-[#ff7d6b] text-[#1e1e1e] hover:bg-[#ff7d6b]/90"
                  }`}
                >
                  <FiPlay className="mr-0.5" size={10} /> Run
                </button>

                <button
                  onClick={submitCode}
                  disabled={isSubmitting}
                  className={`flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-medium ${
                    isSubmitting
                      ? "bg-[#a0c4e0]/60 text-[#1e1e1e] cursor-not-allowed"
                      : "bg-[#a0c4e0] text-[#1e1e1e] hover:bg-[#a0c4e0]/90"
                  }`}
                >
                  <FiSend className="mr-0.5" size={10} /> Submit
                </button>
              </div>
            </div>

            {/* Console Content */}
            {isConsoleOpen && (
              <div className="bg-[#1a3641] border-t border-[#6a3a30] p-2 md:p-4 max-h-32 md:max-h-64 overflow-y-auto">
                {status && result.length > 0 ? (
                  <div className="space-y-2 md:space-y-3">
                    <div
                      className={`flex items-center p-2 md:p-3 rounded-xl ${
                        status === "Accepted"
                          ? "bg-[#244855] text-[#a0c4e0] border border-[#a0c4e0]"
                          : "bg-[#ff7d6b]/20 text-[#ff7d6b] border border-[#ff7d6b]"
                      }`}
                    >
                      {status === "Accepted" ? (
                        <FiCheckCircle className="mr-1 md:mr-2 text-[#a0c4e0] text-sm md:text-base" />
                      ) : (
                        <FiAlertTriangle className="mr-1 md:mr-2 text-[#ff7d6b] text-sm md:text-base" />
                      )}
                      <span className="font-medium text-sm md:text-base">{status}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs md:text-sm">
                      <div className="text-center bg-[#1a3641] p-2 rounded-xl border border-[#6a3a30] text-[#f0e6d8]">
                        <div className="text-[#f0e6d8]/70">Test Cases</div>
                        <div>
                          {result.length} / {result.length}
                        </div>
                      </div>

                      <div className="text-center bg-[#1a3641] p-2 rounded-xl border border-[#6a3a30] text-[#f0e6d8]">
                        <div className="text-[#f0e6d8]/70">Runtime</div>
                        <div>
                          {Math.max(
                            ...result.map((item) => parseFloat(item.time))
                          ).toFixed(3)}{" "}
                          s
                        </div>
                      </div>

                      <div className="text-center bg-[#1a3641] p-2 rounded-xl border border-[#6a3a30] text-[#f0e6d8]">
                        <div className="text-[#f0e6d8]/70">Memory</div>
                        <div>
                          {Math.max(
                            ...result.map((item) => parseFloat(item.memory))
                          )}
                          KB
                        </div>
                      </div>
                    </div>
                  </div>
                ) : submitStatus ? (
                  <div className="space-y-2 md:space-y-3">
                    <div
                      className={`flex items-center p-2 md:p-3 rounded-xl ${
                        submitStatus === "Accepted"
                          ? "bg-[#244855] text-[#a0c4e0] border border-[#a0c4e0]"
                          : "bg-[#ff7d6b]/20 text-[#ff7d6b] border border-[#ff7d6b]"
                      }`}
                    >
                      {submitStatus === "Accepted" ? (
                        <FiCheckCircle className="mr-1 md:mr-2 text-[#a0c4e0] text-sm md:text-base" />
                      ) : (
                        <FiAlertTriangle className="mr-1 md:mr-2 text-[#ff7d6b] text-sm md:text-base" />
                      )}
                      <span className="font-medium text-sm md:text-base">{submitStatus}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                      <div className="text-center bg-[#1a3641] p-2 rounded-xl border border-[#6a3a30] text-[#f0e6d8]">
                        <div className="text-[#f0e6d8]/70">Runtime</div>
                        <div>{maxMetrics?.time || "0.000"} s</div>
                      </div>

                      <div className="text-center bg-[#1a3641] p-2 rounded-xl border border-[#6a3a30] text-[#f0e6d8]">
                        <div className="text-[#f0e6d8]/70">Memory</div>
                        <div>{maxMetrics?.memory || "0.0"} MB</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4 text-[#f0e6d8]/70 text-xs md:text-sm">
                    <div className="text-center px-3 py-2 bg-[#244855] rounded-xl border border-[#6a3a30] max-w-md">
                      Click{" "}
                      <span className="text-[#ff7d6b] font-medium">Run</span> to
                      execute your code or{" "}
                      <span className="text-[#a0c4e0] font-medium">Submit</span>{" "}
                      to evaluate your solution.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    
    </>
  );
}

export default ProblemContent;