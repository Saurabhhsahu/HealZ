import React from "react";
import { useUser } from "../../context/userContext";
import { Calendar, Shield, AlertCircle } from "lucide-react";

const Insurance = ({ darkMode }) => {
  const { profile } = useUser();
  const insuranceData = profile?.insurance?.[0] || [];

  const today = new Date();
  const expiry = new Date(insuranceData.expiryDate);
  const isExpired = today > expiry;

  return (
    <div className="h-full rounded-lg shadow-sm overflow-hidden bg-white border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Insurance</h2>
            <p className="text-sm text-gray-500">Get lifetime insurance with us</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="p-5 space-y-3 rounded-lg bg-[#e6f7ef] border border-gray-100">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-white text-[#00bf60] flex items-center justify-center mr-3">
              <Shield size={20} />
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium text-gray-900">{insuranceData.provider}</p>
              <div className="flex items-center mt-1">
                <p className="text-sm text-gray-600">Policy No: {insuranceData.policyNumber}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center mt-1">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <p className={`text-sm font-medium ${isExpired ? "text-red-600" : "text-[#00bf60]"}`}>
              Expiry: {expiry.toDateString()} 
              {isExpired && (
                <span className="flex items-center ml-2 text-red-600">
                  <AlertCircle size={14} className="mr-1" />
                  Expired
                </span>
              )}
            </p>
          </div>

          {isExpired && (
            <div className="pt-2">
              <button className="w-full px-4 py-2.5 bg-[#00bf60] hover:bg-[#00a050] text-white rounded-lg text-sm font-medium transition-colors">
                Renew Insurance
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-center p-4 rounded-lg border border-gray-100 bg-[#e6f7ef]">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 mb-1">Need assistance with your insurance?</p>
            <p className="text-xs text-gray-500 mb-3">Our specialists are available 24/7</p>
            <button className="px-4 py-2 bg-[#00bf60] hover:bg-[#00a050] text-white rounded-lg text-sm font-medium transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;