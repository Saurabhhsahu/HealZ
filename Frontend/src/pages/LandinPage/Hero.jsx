import React from 'react';
import oldManImage from '../../pages/LandinPage/oldman.png'; // Ensure this path is correct

const SunnysideHero = () => {
  return (
    <div className="relative min-h-screen bg-yellow-50 flex flex-col">
      {/* Navigation */}
      <nav className="absolute top-6 left-0 right-0 px-8 lg:px-16 flex justify-between items-center mx-auto">
        <div className="text-3xl font-bold text-green-900">JIVA | जीवा</div>
        <div className="flex items-center space-x-6 lg:space-x-10">
          {['About', 'Blog', 'Reviews', 'Log In'].map((item, index) => (
            <a key={index} href="#" className="text-green-800 hover:text-green-700 transition duration-300">
              {item}
            </a>
          ))}
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between flex-grow w-full px-8 lg:px-16 mx-auto pt-24 lg:pt-32">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-green-900 leading-tight">
            Only Health Care Platform You Need
          </h1>
          <p className="text-lg text-green-800">
          Jiva instantly connects patients with doctors, providing real-time medical information for faster, life-saving decisions—with zero delay—while maintaining the privacy and integrity of patient data, all on one seamless platform
          </p>
          <div className="space-y-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300">
              Get Started
            </button>
            <p className="text-sm text-gray-600">Start for free, cancel anytime</p>
          </div>
        </div>

        {/* Right Side - Image & Background */}
        <div className="w-full lg:w-1/2 flex justify-center relative">
          {/* Decorative Background Shape */}
          <div className="absolute bottom-0 w-64 lg:w-xl h-[100%] bg-yellow-300 rounded-t-[50%] shadow-lg"></div>

          {/* Image */}
          <img 
            src={oldManImage} 
            alt="Person smiling while looking at phone" 
            className="relative z-10 h-[100%] object-contain drop-shadow-lg"
          />

          {/* Chat Dialogs - Positioned further left */}
          <div className="absolute top-10 left-[-30px] bg-white p-3 rounded-lg shadow-md text-sm text-gray-800">
            "Did u Try Jiva? It's amazing!"
          </div>
          <div className="absolute top-32 left-[-30px] bg-blue-500 text-white p-3 rounded-lg shadow-md text-sm">
            "The support here is amazing."
          </div>
          <div className="absolute bottom-10 left-[-30px] bg-white p-3 rounded-lg shadow-md text-sm text-gray-800">
            "I can't believe it's free!"
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunnysideHero;
