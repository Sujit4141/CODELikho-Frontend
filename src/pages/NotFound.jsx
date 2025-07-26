// src/pages/NotFound.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? "/" : "/login");
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600">
        Redirecting to {isAuthenticated ? "homepage" : "login"} in 3 seconds...
      </p>
    </div>
  );
}