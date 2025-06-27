export default function Services() {
  const services = [
    {
      icon: "📊",
      title: "Health Analytics",
      description: "AI-powered insights from your health data, identifying patterns and suggesting personalized improvements.",
      highlight: true
    },
    {
      icon: "📱",
      title: "Activity Tracking",
      description: "Monitor daily activities, exercise, sleep patterns, and vitals with seamless device integration.",
    },
    {
      icon: "🔐",
      title: "Secure Data Sharing",
      description: "Share medical records with healthcare providers using end-to-end encryption and permission controls.",
    },
    {
      icon: "📋",
      title: "Medical History",
      description: "Comprehensive timeline of your health journey, including medications, procedures, and appointments.",
      highlight: true
    },
    {
      icon: "📈",
      title: "Personalized Reports",
      description: "Generate detailed health reports with AI-driven recommendations based on your unique profile.",
    },
    {
      icon: "⏰",
      title: "Medication Reminders",
      description: "Never miss a dose with smart reminders that adjust to your schedule and medication requirements.",
    },
    {
      icon: "👨‍⚕️",
      title: "Provider Integration",
      description: "Connect directly with healthcare professionals for virtual consultations and report sharing.",
      highlight: true
    },
    {
      icon: "🥗",
      title: "Nutrition Planning",
      description: "Dietary recommendations and meal planning based on your health metrics and wellness goals.",
    }
  ]

  return (
    <div id="features" className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold mb-16 dark:text-white">
        Our <span className="bg-[#00bf60] dark:bg-[#00bf60] text-white px-2 font-['Dancing_Script']">Health</span> Features
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className={`
              p-6 rounded-lg h-[280px] flex flex-col
              transform transition-all duration-300
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              hover:scale-105 hover:bg-[#00bf60] dark:hover:bg-[#00bf60] hover:border-transparent hover:text-white
              group cursor-pointer
              ${service.highlight 
                ? "hover:shadow-[0_0_20px_rgba(0,191,96,0.3)]" 
                : "hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]"
              }
            `}
          >
            <div className="text-3xl mb-4 transform transition-all duration-300 group-hover:scale-110">{service.icon}</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white group-hover:text-white">{service.title}</h3>
            <p className="flex-grow text-gray-600 dark:text-gray-300 group-hover:text-white">
              {service.description}
            </p>
            {service.highlight && (
              <button 
                className="
                  mt-4 font-medium 
                  transform transition-all duration-300
                  hover:translate-x-2 hover:underline
                  flex items-center gap-2
                  text-[#00bf60] group-hover:text-white
                "
              >
                Learn More 
                <span className="text-xl">→</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}