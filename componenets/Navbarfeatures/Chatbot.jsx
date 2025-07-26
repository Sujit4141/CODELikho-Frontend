import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FiSend, FiTrash2, FiUser } from "react-icons/fi";
import { RiSwordLine } from "react-icons/ri";

const Chatbot = ({ description, title }) => {
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
          parts: `👋 Greetings, fellow coder! I'm Code Ninja, your DSA expert at Code Likho. I'm here to help you solve: "${title}".`,
        },
      ]);
    }
  }, [conversation.length, title]);

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
        parts:
          "Chat reset! 🥷 I'm Code Ninja, ready to help you with your DSA challenge.",
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

      const systemInstruction = `You are Code Ninja, an expert assistant for Data Structures and Algorithms at Code Likho.
        Your role is to help the user solve the DSA problem they are currently working on.
        Problem title: "${title}".
        Problem description: "${description}".

        Guidelines:
        1. Focus on DSA concepts, problem-solving, and algorithms only.
        2. If asked off-topic, reply: "I specialize only in DSA. Ask me about algorithms, data structures, or problem-solving!"
        3. Be concise but clear. Use examples when helpful.
        4. Use ninja-themed metaphors like "sneak up with two-pointer technique".
        5. Use markdown code blocks for code.
        6. Break down complex steps.
        7. Show multiple approaches with time/space analysis.
        8. Highlight optimal methods and tradeoffs.
        9. Encourage understanding over memorization.`;

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
          parts:
            "🥷 Sorry, something went wrong. Please ask a DSA-related question.",
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
    <div className="h-full flex flex-col bg-gradient-to-br from-[#D4AFB9] via-[#D1CFE2] to-[#52B2CF] rounded-2xl border-2 border-[#9CADCE] p-4 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center py-2 mb-3 border-b border-[#7EC4CF]">
        <div className="flex items-center space-x-2">
          <div className="bg-[#52B2CF] p-1 rounded-lg shadow-md">
            <RiSwordLine className="text-white text-lg" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Code Ninja</h2>
          <span className="text-xs bg-[#9CADCE] text-white px-1.5 py-0.5 rounded-full">
            Code Likho
          </span>
        </div>
        <button
          onClick={confirmReset}
          className="text-[#ea0844] hover:text-[#b25e73] text-sm flex items-center space-x-1"
        >
          <FiTrash2 className="text-base" />
          <span  >Clear</span>
        </button>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-xl border-2 border-[#D4AFB9] max-w-md">
            <h3 className="text-lg font-semibold text-[#D4AFB9] mb-4">
              Confirm Reset
            </h3>
            <p className="mb-5 text-gray-700">
              Are you sure you want to clear the chat? All messages will be
              lost.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelReset}
                className="px-4 py-2 bg-[#D1CFE2] hover:bg-[#c5c3d6] text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={executeReset}
                className="px-4 py-2 bg-[#D4AFB9] hover:bg-[#c99ea9] text-white rounded-lg"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 bg-white bg-opacity-90 rounded-xl p-3 mb-3 overflow-y-auto border border-[#9CADCE] custom-scrollbar">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-start max-w-[90%]">
              {msg.role === "model" && (
                <div className="mt-1 mr-2 bg-[#52B2CF] p-1.5 rounded-full shadow">
                  <RiSwordLine className="text-white text-base" />
                </div>
              )}
              <div
                className={`rounded-xl p-3 shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#7EC4CF] to-[#52B2CF] text-gray-800"
                    : "bg-[#D1CFE2] text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{msg.parts}</p>
              </div>
              {msg.role === "user" && (
                <div className="mt-1 ml-2 bg-[#D4AFB9] p-1.5 rounded-full shadow">
                  <FiUser className="text-white text-base" />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 flex rounded-xl overflow-hidden bg-white border-2 border-[#9CADCE]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            placeholder="Ask about this DSA problem..."
            className="flex-1 bg-transparent px-3 py-2 focus:outline-none text-gray-800 placeholder-[#9CADCE] resize-none h-12 text-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`flex items-center justify-center px-4 ${
              isLoading || !input.trim()
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-[#7EC4CF] to-[#52B2CF] hover:from-[#6db5c1] hover:to-[#469db8] text-white"
            } transition-all`}
          >
            <FiSend className="text-lg" />
          </button>
        </div>
        {isTyping && (
          <button
            onClick={handleStop}
            className="text-xs px-3 py-1 bg-[#D4AFB9] text-white rounded-lg hover:bg-[#c99ea9]"
          >
            Stop Generating
          </button>
        )}
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="text-xs text-center text-gray-600 mt-1 animate-pulse">
          Code Ninja is typing...
        </div>
      )}

      <p className="text-xs text-gray-700 mt-1 text-center font-medium">
        🥷 Specializes in DSA • Resets after 60 messages
      </p>

      <style >{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(210, 207, 226, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9cadce;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7ec4cf;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
