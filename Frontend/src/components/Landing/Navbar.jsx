import { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import DarkModeToggle from '../ui/DarkModeToggle';

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
        ? 'bg-transparent dark:bg-gray-900/80 backdrop-blur-md shadow-lg my-4 mx-6 rounded-2xl border border-[#FFB6C1]/20'
        : 'bg-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="text-2xl font-bold">
              <img src={logo} alt="logo" className="h-30" />
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                className={`
                  transition-colors duration-300
                  ${isScrolled
                    ? 'text-gray-600 hover:text-[#FF8DA1] dark:text-gray-400 dark:hover:text-[#FFB6C1]'
                    : 'text-gray-800 hover:text-[#FF8DA1] dark:text-gray-200 dark:hover:text-[#FFB6C1]'
                  }
                `}
              >
                Home
              </a>
              <a
                href="#features"
                className={`
                  transition-colors duration-300
                  ${isScrolled
                    ? 'text-gray-600 hover:text-[#FF8DA1] dark:text-gray-400 dark:hover:text-[#FFB6C1]'
                    : 'text-gray-800 hover:text-[#FF8DA1] dark:text-gray-200 dark:hover:text-[#FFB6C1]'
                  }
                `}
              >
                Features
              </a>
              <a
                href="#contact"
                className={`
                  transition-colors duration-300
                  ${isScrolled
                    ? 'text-gray-600 hover:text-[#FF8DA1] dark:text-gray-400 dark:hover:text-[#FFB6C1]'
                    : 'text-gray-800 hover:text-[#FF8DA1] dark:text-gray-200 dark:hover:text-[#FFB6C1]'
                  }
                `}
              >
                Contact
              </a>
            </div>
          </div>
          {/* <div className="flex items-center gap-4">
            <DarkModeToggle />
            <button className="bg-[#FFB6C1] hover:bg-[#FF8DA1] text-black px-6 py-2 rounded-2xl transition-colors duration-300 font-medium">
              Free Trial
            </button>
          </div> */}
        </div>
      </div>
    </nav>
  );
}