import React from 'react';
import { useUser } from '../../context/userContext.jsx';
import { Pill, Calendar, Clock, Bell, RefreshCw } from 'lucide-react';

const Medications = ({ darkMode }) => {
  const { profile } = useUser();
  // Sample medications data
  const medications = profile?.medications || [];

  return (
    <div className="h-full rounded-lg shadow-sm overflow-hidden bg-white border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Medications & Prescriptions</h2>
            <p className="text-sm text-gray-500">Current medications and refill status</p>
          </div>
          <button className="bg-[#00bf60] hover:bg-[#00a050] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Request All
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-3 h-80 overflow-y-scroll">
          {medications.map((medication) => {
            // Calculate days until refill
            const today = new Date();
            const refillDate = new Date(medication.refillDate);
            const daysUntilRefill = Math.ceil((refillDate - today) / (1000 * 60 * 60 * 24));
            
            return (
              <div 
                key={medication.id} 
                className="p-4 rounded-lg border border-gray-100 bg-white hover:border-gray-200 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#e6f7ef] flex items-center justify-center text-[#00bf60]">
                      <Pill size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{medication.name} {medication.dosage}</h3>
                      <p className="text-sm text-gray-500">
                        {medication.frequency}
                      </p>
                    </div>
                  </div>
                  <div>
                    {daysUntilRefill <= 7 ? (
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700">
                        Refill in {daysUntilRefill} days
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#e6f7ef] text-[#00bf60]">
                        Refill in {daysUntilRefill} days
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="ml-13 pl-13 mt-2">
                  <div className="flex flex-col space-y-1 ml-13 pl-4 border-l border-gray-100">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Started:</span> {new Date(medication.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-400 mr-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Instructions:</span> {medication.instructions}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full mt-4 flex space-x-2">
                  <button className="w-1/2 px-3 py-2 text-sm font-medium rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors flex items-center justify-center">
                    <Bell size={16} className="mr-2" />
                    Set Reminder
                  </button>
                  <button className="w-1/2 px-3 py-2 text-sm font-medium rounded-md bg-[#e6f7ef] text-[#00bf60] hover:bg-[#d0f0e2] transition-colors flex items-center justify-center">
                    <RefreshCw size={16} className="mr-2" />
                    Request Refill
                  </button>
                </div>
              </div>
            );
          })}
          
          {medications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Pill className="h-10 w-10 text-[#c0e8d5] mb-2" />
              <p className="text-gray-500">No medications available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medications;