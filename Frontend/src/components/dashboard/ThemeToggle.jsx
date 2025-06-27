import React from "react";

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  const handleToggle = () => {
    setDarkMode((prevMode) => !prevMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
      }`}
    >
      {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default ThemeToggle;
