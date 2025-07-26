import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../utils/axiosClient";
import Navbar from "../../../componenets/Navbar";

function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    emailId: "",
    password: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);

  const [dark, setDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post("user/admin/register", formData);
      toast.success("Registration successful!");
      navigate(formData.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100 dark:from-[#18192f] dark:via-[#181830] dark:to-[#241e39] flex flex-col transition-colors duration-500">
        
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-[#1c1b2f]/80 border-b border-violet-200 dark:border-violet-800 shadow-sm">
          <Navbar />
        </div>

        {/* Theme Toggle */}
        <div className="fixed top-5 right-6 md:right-10 z-40">
          <button
            aria-label="Toggle Dark Mode"
            type="button"
            onClick={() => setDark((prev) => !prev)}
            className="rounded-full p-2 bg-gradient-to-r from-indigo-400 to-fuchsia-500 dark:from-purple-700 dark:to-blue-900 shadow-lg border border-violet-300 dark:border-violet-800 transition"
          >
            {dark ? (
              <svg width={22} height={22} fill="none" viewBox="0 0 24 24" className="text-yellow-300"><path d="M21 12.79A9 9 0 1111.21 3A7 7 0 0021 12.79z" stroke="currentColor" strokeWidth={2} /></svg>
            ) : (
              <svg width={22} height={22} fill="none" viewBox="0 0 24 24" className="text-violet-800"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={2} /><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.414-1.415M4.465 4.465L3.05 3.05m16.95 0l-1.415 1.415M4.465 19.535l-1.415 1.415" stroke="currentColor" strokeWidth={2} /></svg>
            )}
          </button>
        </div>

        {/* Hero + Form */}
        <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 flex-1">
          <div className="w-full max-w-4xl space-y-10">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-transparent bg-clip-text dark:from-fuchsia-400 dark:to-blue-300">
                Welcome to <span className="underline decoration-fuchsia-500">Admin Portal</span>
              </h1>
              <p className="mt-4 text-lg text-violet-900 dark:text-violet-200">
                Effortlessly manage your dashboard. Create your Admin account in seconds.
              </p>
            </div>

            {/* Form Section */}
            <div className="w-full max-w-md mx-auto">
              <div className="backdrop-blur-md bg-white/80 dark:bg-[#251d46]/80 border border-violet-200 dark:border-violet-700 rounded-2xl shadow-xl overflow-hidden">
                <form onSubmit={handleSubmit}>
                  <div className="p-8 space-y-6">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        placeholder="Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-violet-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        id="emailId"
                        name="emailId"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.emailId}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-violet-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-violet-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>

                    {/* Role Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Account Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["admin", "user"].map((roleOption) => (
                          <button
                            key={roleOption}
                            type="button"
                            onClick={() => setFormData({ ...formData, role: roleOption })}
                            className={`py-3 px-4 rounded-xl border transition-all focus:outline-none ${
                              formData.role === roleOption
                                ? "bg-gradient-to-r from-violet-100 to-fuchsia-200 dark:from-fuchsia-900 dark:to-violet-900 text-violet-800 dark:text-fuchsia-200 border-violet-500 shadow-sm"
                                : "border-gray-200 dark:border-violet-700 text-violet-700 dark:text-violet-200 hover:bg-violet-100 dark:hover:bg-violet-800"
                            }`}
                          >
                            <span className="capitalize font-medium">{roleOption}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-700 via-violet-600 to-fuchsia-600 dark:from-fuchsia-700 dark:via-violet-900 dark:to-blue-700
                      hover:from-indigo-800 hover:to-fuchsia-700 focus:ring-4 focus:ring-violet-300 dark:focus:ring-violet-900 transition-all shadow-md ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                  </div>

                  <div className="bg-violet-50 dark:bg-violet-900/60 px-8 py-4 text-center border-t border-violet-100 dark:border-violet-700">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="font-medium text-violet-700 dark:text-fuchsia-300 hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </form>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-violet-300">
                © 2025 Admin Portal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
