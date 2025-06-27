import React from 'react';

// Shared animation styling
export function HealthcareAnimations() {
  return (
    <style jsx global>{`
      @keyframes dash {
        to {
          stroke-dashoffset: 0;
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 0.5;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.1);
        }
      }
      
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
    `}</style>
  );
}

// Common UI elements
export const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
    <path d="M16 12L10 15.464V8.536L16 12Z" fill="currentColor" />
  </svg>
);

// Healthcare decorative elements
export function HeartBeats() {
  return (
    <div className="absolute animate-[pulse_4s_ease-in-out_infinite]">
      <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M0 30H20L25 20L30 40L35 10L40 30L45 25L50 30L60 5L70 55L80 30L90 40L100 20L110 30H120" 
          stroke="#FFB6C1" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-[dash_20s_linear_infinite]"
          strokeDasharray="240"
          strokeDashoffset="240"
        />
      </svg>
    </div>
  );
}

export function HealthWaves() {
  return (
    <div className="absolute">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M10 20C15.5 10 25.5 10 30 20C34.5 30 44.5 30 50 20C55.5 10 65.5 10 70 20C74.5 30 84.5 30 90 20" 
          stroke="#FFB6C1" 
          strokeWidth="2" 
          strokeLinecap="round"
          className="animate-[dash_15s_linear_infinite]"
          strokeDasharray="4 4"
        />
        <path 
          d="M10 50C15.5 40 25.5 40 30 50C34.5 60 44.5 60 50 50C55.5 40 65.5 40 70 50C74.5 60 84.5 60 90 50" 
          stroke="#FFB6C1" 
          strokeWidth="2" 
          strokeLinecap="round"
          className="animate-[dash_20s_linear_infinite]"
          strokeDasharray="4 4"
          style={{ animationDelay: "0.5s" }}
        />
        <path 
          d="M10 80C15.5 70 25.5 70 30 80C34.5 90 44.5 90 50 80C55.5 70 65.5 70 70 80C74.5 90 84.5 90 90 80" 
          stroke="#FFB6C1" 
          strokeWidth="2" 
          strokeLinecap="round"
          className="animate-[dash_25s_linear_infinite]"
          strokeDasharray="4 4"
          style={{ animationDelay: "1s" }}
        />
      </svg>
    </div>
  );
}

export function HeartIcon() {
  return (
    <div className="absolute animate-[float_4s_ease-in-out_infinite]">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="#FFB6C1" opacity="0.5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
  );
}

export function PulseDots() {
  return (
    <div className="absolute animate-[float_4s_ease-in-out_infinite]">
      <div className="grid grid-cols-5 gap-2">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="w-2 h-2 bg-[#FFB6C1] rounded-full animate-[pulse_2s_ease-in-out_infinite]" 
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function MedicalCross() {
  return (
    <div className="absolute animate-[float_5s_ease-in-out_infinite]">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M8 2C8 1.44772 8.44772 1 9 1H15C15.5523 1 16 1.44772 16 2V8H22C22.5523 8 23 8.44772 23 9V15C23 15.5523 22.5523 16 22 16H16V22C16 22.5523 15.5523 23 15 23H9C8.44772 23 8 22.5523 8 22V16H2C1.44772 16 1 15.5523 1 15V9C1 8.44772 1.44772 8 2 8H8V2Z" 
          fill="#FFB6C1" 
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

// Adapted decorations with healthcare theme
export function HealthStar() {
  return (
    <div className="absolute animate-[spin_10s_linear_infinite]">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M20 0L23.5 16.5L40 20L23.5 23.5L20 40L16.5 23.5L0 20L16.5 16.5L20 0Z" 
          fill="#FFB6C1" 
          fillOpacity="0.5"
        />
      </svg>
    </div>
  );
}

export function HealthCurves() {
  return (
    <div className="absolute">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M10 50C10 25 25 10 50 10C75 10 90 25 90 50C90 75 75 90 50 90" 
          stroke="#FFB6C1" 
          strokeWidth="2" 
          strokeDasharray="4 4" 
          className="animate-[dash_20s_linear_infinite]"
        />
      </svg>
    </div>
  );
}

export function HealthDots() {
  return (
    <div className="absolute animate-[float_4s_ease-in-out_infinite]">
      <div className="grid grid-cols-3 gap-2">
        {[...Array(9)].map((_, i) => (
          <div 
            key={i} 
            className="w-2 h-2 bg-[#FFB6C1] rounded-full animate-[pulse_2s_ease-in-out_infinite]" 
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export const HealthStarDecoration = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z"
      stroke="#FFB6C1"
      strokeWidth="2"
    />
  </svg>
);

export const HealthCurveDecoration = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 35C5 35 15 35 20 20C25 5 35 5 35 5" stroke="#FFB6C1" strokeWidth="2" />
  </svg>
);

export const HealthDotDecoration = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" fill="#FFB6C1" />
  </svg>
);
export function HeroIcons() {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full">
      {/* Brain Icon */}
      <div className="absolute top-10 right-20 animate-float" style={{ animationDelay: '0.5s' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#ADFF00" opacity="0.5">
          <path d="M12 2a9 9 0 0 1 9 9c0 3.03-1.53 5.82-4 7.47V22h-2v-3h-6v3H7v-3.54c-2.47-1.65-4-4.46-4-7.46a9 9 0 0 1 9-9zm-4 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-4 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        </svg>
      </div>

      {/* Globe Icon */}
      <div className="absolute top-40 right-10 animate-float" style={{ animationDelay: '0.8s' }}>
        <svg width="35" height="35" viewBox="0 0 24 24" fill="#ADFF00" opacity="0.5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>

      {/* Code Icon */}
      <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '1.2s' }}>
        <svg width="35" height="35" viewBox="0 0 24 24" fill="#ADFF00" opacity="0.5">
          <path d="M8 3a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H3v2h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2v-2H8v-5a2 2 0 0 0-2-2 2 2 0 0 0 2-2V5h2V3H8zm8 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3h2z"/>
        </svg>
      </div>

      {/* Chat/Community Icon */}
      <div className="absolute bottom-40 right-10 animate-float" style={{ animationDelay: '1.5s' }}>
        <svg width="35" height="35" viewBox="0 0 24 24" fill="#ADFF00" opacity="0.5">
          <path d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8z"/>
        </svg>
      </div>
    </div>
  );
}

