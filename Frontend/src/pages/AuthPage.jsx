import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../context/userContext";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    contact: "",
    email: "",
    password: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
  });

  const { signin,signup } = useUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isSignUp ? signup(formData) : signin(formData);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 text-black">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 border border-gray-100">
        {/* Logo or Icon at top */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-[#e6f7ef] flex items-center justify-center text-[#00bf60]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personal Information</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Full Name" 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf60] focus:border-transparent" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number" 
                    name="age" 
                    placeholder="Age" 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf60] focus:border-transparent" 
                    required 
                  />
                  <input 
                    type="text" 
                    name="gender" 
                    placeholder="Gender" 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf60] focus:border-transparent" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="bloodGroup" 
                    placeholder="Blood Group" 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf60] focus:border-transparent" 
                    required 
                  />
                  <input 
                    type="text" 
                    name="contact" 
                    placeholder="Contact Number" 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf60] focus:border-transparent" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Emergency Contact</label>
                  <input 
                    type="text" 
                    name="emergencyName" 
                    placeholder="Emergency Contact Name" 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf60] focus:border-transparent" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="emergencyRelation" 
                    placeholder="Relation" 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf60] focus:border-transparent" 
                  />
                  <input 
                    type="text" 
                    name="emergencyPhone" 
                    placeholder="Emergency Phone" 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf60] focus:border-transparent" 
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 my-4 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Information</label>
              </div>
            </>
          )}
          
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf60] focus:border-transparent" 
            required 
          />
          
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf60] focus:border-transparent" 
            required 
          />
          
          <button 
            type="submit" 
            className="w-full bg-[#00bf60] hover:bg-[#00a050] text-white p-2 rounded-lg font-medium transition-colors mt-4"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600 text-sm">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-[#00bf60] cursor-pointer font-medium hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;