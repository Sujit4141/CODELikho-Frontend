import { useState, useRef, useEffect } from "react";
import Navbar from "../../componenets/Navbar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FiSend, FiTrash2, FiUser } from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";


// Sahayak Chatbot Component
const SahayakChatbot = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [conversation, setConversation] = useState([]);
  const chatEndRef = useRef(null);
  const controllerRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  useEffect(() => {
    if (conversation.length === 0) {
      setConversation([
        {
          role: "model",
          parts: "👋 Hello! I'm Sahayak, your support assistant at Code Likho. How can I help you today?",
        },
      ]);
    }
  }, [conversation.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    if (conversation.length > 60) resetChat();
  }, [conversation.length]);

  const resetChat = () => {
    setConversation([
      {
        role: "model",
        parts: "Chat reset! 🧑‍💻 I'm Sahayak, ready to assist you with your inquiries.",
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setIsTyping(true);
      controllerRef.current = new AbortController();

      const userMessage = { role: "user", parts: input };
      const newConversation = [...conversation, userMessage];
      const placeholderIndex = newConversation.length;
      newConversation.push({ role: "model", parts: "..." });
      setConversation(newConversation);
      setInput("");

      const validHistory = newConversation.filter(
        (msg, idx) =>
          !(idx === 0 && msg.role === "model") && idx !== placeholderIndex
      );

      const systemInstruction = `You are Sahayak, the support assistant for Code Likho.
Your role is to help users with their inquiries about our services, contact information, and general support.
Guidelines:
1. Answer questions about our courses, contact methods, and website features.
2. If asked about topics outside of our services, politely decline.
3. Be concise but clear. Use examples when helpful.
4. Use markdown for formatting when necessary.
5. Our contact details:
   - Email: sujitku641@gmail.com
   - Phone: +91 6201060499
   - Location: Dhanbad, Jharkhand
6. When asked about contact information, provide these details.`;

      const chat = model.startChat({
        history: validHistory.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.parts }],
        })),
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
      });

      const result = await chat.sendMessageStream(input);
      let responseText = "";
      let displayedText = "";

      for await (const chunk of result.stream) {
        if (controllerRef.current.signal.aborted) break;
        responseText += chunk.text();
      }

      for (let i = 0; i < responseText.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 15));
        if (controllerRef.current.signal.aborted) break;

        displayedText += responseText[i];
        setConversation((prev) => {
          const updated = [...prev];
          updated[placeholderIndex] = {
            role: "model",
            parts: displayedText,
          };
          return updated;
        });
      }
    } catch (err) {
      console.error("AI Error:", err);
      setConversation((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "model",
          parts: "⚠️ Sorry, something went wrong. Please try asking again.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleStop = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const confirmReset = () => setShowConfirm(true);
  const cancelReset = () => setShowConfirm(false);
  const executeReset = () => {
    resetChat();
    setShowConfirm(false);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-amber-100 via-blue-100 to-cyan-100 rounded-2xl border-2 border-amber-300 p-4 shadow-xl max-h-[550px]">
      {/* Header */}
      <div className="flex justify-between items-center py-2 mb-3 border-b border-amber-300">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500 p-2 rounded-lg shadow-md">
            <RiCustomerService2Line className="text-white text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Sahayak</h2>
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            Support Assistant
          </span>
        </div>
        <button
          onClick={confirmReset}
          className="text-red-500 hover:text-red-700 text-sm flex items-center space-x-1"
        >
          <FiTrash2 className="text-base" />
          <span>Clear</span>
        </button>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-xl border-2 border-amber-300 max-w-md">
            <h3 className="text-lg font-semibold text-amber-500 mb-4">
              Confirm Reset
            </h3>
            <p className="mb-5 text-gray-700">
              Are you sure you want to clear the chat? All messages will be
              lost.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelReset}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={executeReset}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      <div className="flex-1 bg-white bg-opacity-90 rounded-xl p-3 mb-3 overflow-y-auto border border-amber-300 custom-scrollbar">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-start max-w-[90%]">
              {msg.role === "model" && (
                <div className="mt-1 mr-2 bg-amber-500 p-2 rounded-full shadow">
                  <RiCustomerService2Line className="text-white text-lg" />
                </div>
              )}
              <div
                className={`rounded-xl p-3 shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-200 to-cyan-200 text-gray-800"
                    : "bg-amber-100 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{msg.parts}</p>
              </div>
              {msg.role === "user" && (
                <div className="mt-1 ml-2 bg-blue-500 p-2 rounded-full shadow">
                  <FiUser className="text-white text-lg" />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 flex rounded-xl overflow-hidden bg-white border-2 border-amber-300">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            placeholder="Ask about our services or contact info..."
            className="flex-1 bg-transparent px-3 py-2 focus:outline-none text-gray-800 placeholder-gray-400 resize-none h-12 text-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`flex items-center justify-center px-4 ${
              isLoading || !input.trim()
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            } transition-all`}
          >
            <FiSend className="text-lg" />
          </button>
        </div>
        {isTyping && (
          <button
            onClick={handleStop}
            className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Stop
          </button>
        )}
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="text-xs text-center text-gray-600 mt-1 animate-pulse">
          Sahayak is typing...
        </div>
      )}

      <p className="text-xs text-gray-600 mt-2 text-center">
        🧑‍💻 Contact support specialist • Resets after 60 messages
      </p>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(253, 230, 138, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f59e0b;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d97706;
        }
      `}</style>
    </div>
  );
};

// Export full Contact page layout separately
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Message submitted successfully!");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a192f] to-[#172a45]">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-200 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Have questions or feedback? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-full">
            <SahayakChatbot />
          </div>

          <div className="flex flex-col gap-8">
            {/* Contact Form Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl">
              <h2 className="text-2xl font-bold text-amber-200 mb-6">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {["name", "email", "subject"].map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-gray-300 mb-2">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/80 rounded-xl border border-gray-600 text-white"
                      placeholder={`Enter your ${field}`}
                      required
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-700/80 rounded-xl border border-gray-600 text-white"
                    placeholder="Your message here..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


