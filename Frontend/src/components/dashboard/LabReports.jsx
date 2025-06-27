import React, { useState } from "react";
import { useUser } from "../../context/userContext.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, Download, BarChart2, Info } from "lucide-react";

const LabReports = ({ darkMode }) => {
  const { profile } = useUser();
  const labReports = profile?.labReports || [];
  const glucoseData = profile?.glucoseTrends || [];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="h-full rounded-lg shadow-sm overflow-hidden bg-white border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Lab Reports & Test Results</h2>
            <p className="text-sm text-gray-500">Recent laboratory test results</p>
          </div>
        </div>
      </div>

      <div className="p-4 h-90 overflow-y-scroll">
        <div className="bg-[#e6f7ef] rounded-lg border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <BarChart2 size={16} className="mr-2 text-[#00bf60]" />
              Blood Glucose Trend
            </h3>
            <div className="flex items-center text-xs text-gray-500">
              <Info size={14} className="mr-1" />
              <span>Last 6 months</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={glucoseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderColor: "#eee", borderRadius: "6px" }}
                />
                <Bar
                  dataKey="value"
                  fill={hoveredIndex !== null ? "#00a050" : "#00bf60"}
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                  onMouseOver={(data, index) => setHoveredIndex(index)}
                  onMouseOut={() => setHoveredIndex(null)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center mb-4">
            <FileText size={16} className="mr-2 text-[#00bf60]" />
            Recent Lab Reports
          </h3>
          <div className="h-64 overflow-y-auto pr-1 space-y-2">
            {labReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-lg border border-gray-100 bg-white hover:border-gray-200 transition-colors flex justify-between items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#e6f7ef] flex items-center justify-center text-[#00bf60]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{report.test}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full mr-3 ${
                      report.status === "Normal"
                        ? "bg-[#e6f7ef] text-[#00bf60]"
                        : report.status === "Elevated"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {report.status}
                  </span>
                  <button
                    className="p-2 rounded-full text-gray-400 hover:text-[#00bf60] hover:bg-[#e6f7ef] transition-colors"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {labReports.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <FileText className="h-10 w-10 text-[#c0e8d5] mb-2" />
            <p className="text-gray-500">No lab reports available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabReports;