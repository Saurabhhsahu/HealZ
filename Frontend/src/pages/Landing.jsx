import React from 'react';
import Navbar from "../components/Landing/Navbar"
import Hero from "../components/Landing/Hero";
import Services from "../components/Landing/Services";
import Contact from '../components/Landing/Contact';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 relative overflow-hidden">
      {/* Decorative elements */}
{/*       
      <div className="absolute top-20 right-20">
        <StarDecoration />
      </div>
      <div className="absolute top-40 right-40">
        <DotDecoration />
      </div>
      <div className="absolute bottom-40 left-20">
        <CurveDecoration />
      </div> 
      */}
      <Navbar />
      <Hero />
      <Services />
      <Contact />
    </div>
  );
};

export default Landing;