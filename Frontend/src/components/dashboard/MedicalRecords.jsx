import React, { useState } from 'react';
import { Activity, AlertCircle, Scissors, FileText, Calendar, Clock } from 'lucide-react';

const MedicalRecords = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('conditions');

  const medicalData = {
    conditions: [
      { name: "Type 2 Diabetes", since: "2018", severity: "Moderate", notes: "Well controlled with medication" },
      { name: "Hypertension", since: "2020", severity: "Mild", notes: "Monitoring regularly" },
      { name: "Hypertension", since: "2020", severity: "Mild", notes: "Monitoring regularly" },
      { name: "Hypertension", since: "2020", severity: "Mild", notes: "Monitoring regularly" }
    ],
    allergies: [
      { name: "Penicillin", severity: "Severe", reaction: "Anaphylaxis" },
      { name: "Peanuts", severity: "Moderate", reaction: "Skin rash, breathing difficulties" }
    ],
    surgeries: [
      { procedure: "Appendectomy", date: "2015-03-15", hospital: "Metro General Hospital" },
      { procedure: "Knee Arthroscopy", date: "2019-11-22", hospital: "Orthopedic Specialty Center" }
    ]
  };

  const tabConfig = {
    conditions: {
      icon: <Activity size={16} className="mr-2" />,
      label: "Conditions",
      color: "text-[#00bf60]",
      bgColor: "bg-[#e6f7ef]"
    },
    allergies: {
      icon: <AlertCircle size={16} className="mr-2" />,
      label: "Allergies",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    surgeries: {
      icon: <Scissors size={16} className="mr-2" />,
      label: "Surgeries",
      color: "text-[#00bf60]",
      bgColor: "bg-[#e6f7ef]"
    }
  };

  return (
    <div className="h-full rounded-lg shadow-sm overflow-hidden bg-white border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Medical Records & History</h2>
            <p className="text-sm text-gray-500">Conditions, allergies, and surgeries</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4">
        <div className="bg-[#00bf60] text-white inline-flex p-1 rounded-lg">
          {Object.keys(tabConfig).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-white hover:text-gray-100'
              }`}
            >
              {tabConfig[tab].icon}
              {tabConfig[tab].label}
            </button>
          ))}
        </div>
      </div>

      {/* Data List with Scrollbar */}
      <div className="px-6 py-4 max-h-64 overflow-y-auto">
        {activeTab === 'conditions' && (
          <div className="space-y-3">
            {medicalData.conditions.map((condition, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full ${tabConfig.conditions.bgColor} flex items-center justify-center ${tabConfig.conditions.color}`}>
                      <Activity size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{condition.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        Since: {condition.since}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{condition.notes}</p>
                    </div>
                  </div>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    condition.severity === 'Severe' ? 'bg-red-50 text-red-700' :
                    condition.severity === 'Moderate' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-[#e6f7ef] text-[#00bf60]'
                  }`}>
                    {condition.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'allergies' && (
          <div className="space-y-3">
            {medicalData.allergies.map((allergy, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full ${tabConfig.allergies.bgColor} flex items-center justify-center ${tabConfig.allergies.color}`}>
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{allergy.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Reaction: {allergy.reaction}</p>
                    </div>
                  </div>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    allergy.severity === 'Severe' ? 'bg-red-50 text-red-700' :
                    allergy.severity === 'Moderate' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-[#e6f7ef] text-[#00bf60]'
                  }`}>
                    {allergy.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'surgeries' && (
          <div className="space-y-3">
            {medicalData.surgeries.map((surgery, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-full ${tabConfig.surgeries.bgColor} flex items-center justify-center ${tabConfig.surgeries.color}`}>
                    <Scissors size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{surgery.procedure}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {new Date(surgery.date).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Hospital: {surgery.hospital}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;