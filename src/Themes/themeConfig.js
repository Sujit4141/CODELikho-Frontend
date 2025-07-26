// src/style/themeConfig.js
//thee colors to use 
export const themeColors = {
  'leet-blue': '#2d8cf0',
  'leet-orange': '#ffa116',
  'leet-green': '#3fcb7e',
  'leet-dark': '#1a1a1a',
};

export const themes = {
 hacker: {
    bg: "bg-leet-dark",
    card: "bg-[#2d2d2d] border-gray-700",
    header: "bg-leet-dark border-b border-gray-700",
    text: "text-gray-200",
    accent: "text-leet-orange",
    button: "bg-leet-orange hover:bg-amber-600 border-none",
    success: "text-leet-green",
    danger: "text-red-400",
    tabActive: "border-b-2 border-leet-orange text-leet-orange",
    tag: "bg-gray-700 text-gray-300"
  },
  midnight: {
    bg: "bg-gray-900",
    card: "bg-gray-800 border-green-500",
    header: "bg-gray-900 border-b border-green-500",
    text: "text-green-100",
    accent: "text-green-400",
    button: "bg-green-600 hover:bg-green-700 border-none",
    success: "text-green-400",
    danger: "text-red-400",
    tabActive: "border-b-2 border-green-400 text-green-400",
    tag: "bg-green-900 text-green-300"
  },
  leet: {
    bg: "bg-[#0d1226]",
    card: "bg-[#1a223f] border-indigo-600",
    header: "bg-[#0d1226] border-b border-indigo-600",
    text: "text-indigo-100",
    accent: "text-indigo-300",
    button: "bg-indigo-600 hover:bg-indigo-700 border-none",
    success: "text-emerald-300",
    danger: "text-red-300",
    tabActive: "border-b-2 border-indigo-300 text-indigo-300",
    tag: "bg-indigo-900 text-indigo-200"
  }
};