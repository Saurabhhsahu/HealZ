import React from 'react';
import { useUser } from '../../context/userContext';
import { User, Mail, Phone, Calendar, Droplet, Heart, Users } from 'lucide-react';

const PatientProfile = ({ darkMode }) => {
  const { profile } = useUser();

  // if(profile){
    console.log("profile : ", profile);
  // }

  const patient = profile?.user?.[0] || {
    "name": "",
    "age": null,
    "gender": "",
    "bloodGroup": "",
    "contact": "",
    "email": "",
    "password": "",
    "emergencyContact": {
        "name": "",
        "relation": "",
        "phone": ""
    },
    "profileImage": ""
  }

  // Apply dark mode styles if enabled
  const bgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const secondaryTextColor = darkMode ? "text-gray-300" : "text-gray-500";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-100";
  const headerBgColor = darkMode ? "bg-gray-700" : "bg-[#e6f7ef]";
  const cardBgColor = darkMode ? "bg-gray-700" : "bg-white";

  return (
    <div className={`h-full rounded-lg shadow-sm overflow-hidden ${bgColor} border ${borderColor}`}>
      <div className="px-4 py-2">
        {/* Profile header with responsive adjustments */}
        <div className={`flex flex-col sm:flex-row items-center p-2 ${headerBgColor} rounded-lg border ${borderColor} mb-2`}>
          <div className="relative mb-2 sm:mb-0 sm:mr-6 flex-shrink-0">
            {patient.profileImage ? (
              <img
                src={patient.profileImage}
                alt={patient.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-sm flex items-center justify-center bg-gray-200">
                <User size={32} className="text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#00bf60] rounded-full border-2 border-white"></div>
          </div>
          <div className="text-center sm:text-left w-full">
            <h3 className={`text-lg font-medium ${textColor}`}>{patient.name}</h3>
          </div>
        </div>

        {/* Patient Info Cards - keeping original padding/margin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Age */}
          <div className={`p-2 rounded-lg border ${borderColor} ${cardBgColor}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-600" : "bg-[#e6f7ef]"} flex items-center justify-center ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"} mr-3`}>
                <Calendar size={16} />
              </div>
              <p className={`text-sm font-medium ${secondaryTextColor}`}>Age</p>
            </div>
            <p className={`text-base font-medium ${textColor} ml-11`}>{patient.age} years</p>
          </div>
          
          {/* Gender */}
          <div className={`p-2 rounded-lg border ${borderColor} ${cardBgColor}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-600" : "bg-[#e6f7ef]"} flex items-center justify-center ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"} mr-3`}>
                <User size={16} />
              </div>
              <p className={`text-sm font-medium ${secondaryTextColor}`}>Gender</p>
            </div>
            <p className={`text-base font-medium ${textColor} ml-11`}>{patient.gender}</p>
          </div>
          
          {/* Blood Group */}
          <div className={`p-2 rounded-lg border ${borderColor} ${cardBgColor}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-600" : "bg-[#e6f7ef]"} flex items-center justify-center ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"} mr-3`}>
                <Droplet size={16} />
              </div>
              <p className={`text-sm font-medium ${secondaryTextColor}`}>Blood Group</p>
            </div>
            <p className={`text-base font-medium ${textColor} ml-11`}>{patient.bloodGroup}</p>
          </div>
          
          {/* Contact */}
          <div className={`p-2 rounded-lg border ${borderColor} ${cardBgColor}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-600" : "bg-[#e6f7ef]"} flex items-center justify-center ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"} mr-3`}>
                <Phone size={16} />
              </div>
              <p className={`text-sm font-medium ${secondaryTextColor}`}>Contact</p>
            </div>
            <p className={`text-base font-medium ${textColor} ml-11 break-words`}>{patient.contact}</p>
          </div>
          
          {/* Email - Maintained span-2 for larger screens */}
          <div className={`p-2 rounded-lg border ${borderColor} ${cardBgColor} col-span-1 sm:col-span-2`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-600" : "bg-[#e6f7ef]"} flex items-center justify-center ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"} mr-3`}>
                <Mail size={16} />
              </div>
              <p className={`text-sm font-medium ${secondaryTextColor}`}>Email</p>
            </div>
            <p className={`text-base font-medium ${textColor} ml-11 break-words`}>{patient.email}</p>
          </div>
          
          {/* Emergency Contact - Maintained span-2 for larger screens */}
          <div className={`p-2 rounded-lg border ${borderColor} ${cardBgColor} col-span-1 sm:col-span-2`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-600" : "bg-[#e6f7ef]"} flex items-center justify-center ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"} mr-3`}>
                <Users size={16} />
              </div>
              <p className={`text-sm font-medium ${secondaryTextColor}`}>Emergency Contact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;