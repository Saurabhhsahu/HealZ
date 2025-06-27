import { useState, useEffect } from 'react';
import logo from "../../assets/logo.png";
import DarkModeToggle from './ui/DarkModeToggle';
import { HeartIcon } from './Decorations';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg my-4 mx-6 rounded-2xl border border-[#FFB6C1]/20'
        : 'bg-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="text-2xl font-bold flex items-center">
              <img src={logo} alt="logo" className="h-10" />
              <span className="ml-2 text-[#FF8DA1] dark:text-[#FFB6C1] font-medium hidden sm:inline">HealthTracker</span>
            </a>
            
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                className={`
                  transition-colors duration-300 relative group
                  ${isScrolled
                    ? 'text-gray-600 hover:text-[#FF8DA1] dark:text-gray-400 dark:hover:text-[#FFB6C1]'
                    : 'text-gray-800 hover:text-[#FF8DA1] dark:text-gray-200 dark:hover:text-[#FFB6C1]'
                  }
                `}
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFB6C1] transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              <a
                href="#features"
                className={`
                  transition-colors duration-300 relative group
                  ${isScrolled
                    ? 'text-gray-600 hover:text-[#FF8DA1] dark:text-gray-400 dark:hover:text-[#FFB6C1]'
                    : 'text-gray-800 hover:text-[#FF8DA1] dark:text-gray-200 dark:hover:text-[#FFB6C1]'
                  }
                `}
              >
                Health Tracking
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFB6C1] transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              <a
                href="#appointments"
                className={`
                  transition-colors duration-300 relative group
                  ${isScrolled
                    ? 'text-gray-600 hover:text-[#FF8DA1] dark:text-gray-400 dark:hover:text-[#FFB6C1]'
                    : 'text-gray-800 hover:text-[#FF8DA1] dark:text-gray-200 dark:hover:text-[#FFB6C1]'
                  }
                `}
              >
                Appointments
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFB6C1] transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              <a
                href="#contact"
                className={`
                  transition-colors duration-300 relative group
                  ${isScrolled
                    ? 'text-gray-600 hover:text-[#FF8DA1] dark:text-gray-400 dark:hover:text-[#FFB6C1]'
                    : 'text-gray-800 hover:text-[#FF8DA1] dark:text-gray-200 dark:hover:text-[#FFB6C1]'
                  }
                `}
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFB6C1] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            
            <button className="bg-[#FFB6C1] hover:bg-[#FF8DA1] text-black px-6 py-2 rounded-xl transition-colors duration-300 flex items-center gap-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Login</span>
            </button>
            
            <button className="group relative p-2 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              
              {/* Mobile menu dropdown would go here */}
              <div className="absolute top-full right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-[#FFB6C1]/20 opacity-0 invisible group-focus:opacity-100 group-focus:visible transition-all duration-300">
                <div className="py-2 px-4">
                  <a href="#home" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-[#FF8DA1] dark:hover:text-[#FFB6C1]">
                    Home
                  </a>
                  <a href="#features" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-[#FF8DA1] dark:hover:text-[#FFB6C1]">
                    Health Tracking
                  </a>
                  <a href="#appointments" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-[#FF8DA1] dark:hover:text-[#FFB6C1]">
                    Appointments
                  </a>
                  <a href="#contact" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-[#FF8DA1] dark:hover:text-[#FFB6C1]">
                    Contact
                  </a>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}