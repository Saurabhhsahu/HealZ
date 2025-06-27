import React, { useState } from 'react';
import { useUser } from '../../context/userContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  HeartPulse,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';

const HealthMonitoring = ({ darkMode = false }) => {
  const [selectedMetrics, setSelectedMetrics] = useState({
    heartRate: true,
    bloodPressure: true
  });

  const { profile } = useUser();

  const healthData = profile?.healthMonitorings || [];

  const calculateMetricStats = (key) => {
    const values = healthData.map(item => item[key]);
    return {
      current: values[values.length - 1],
      average: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
      trend: values[values.length - 1] - values[0]
    };
  };

  const heartRateStats = calculateMetricStats('heartRate');
  const bloodPressureStats = calculateMetricStats('bloodPressure');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 rounded-lg shadow-lg bg-white text-gray-800 border border-gray-100">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-sm flex items-center mt-1">
              {entry.dataKey === 'heartRate' ? 'Heart Rate' : 'Blood Pressure'}:
              <span className="font-semibold ml-2" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const MetricToggle = ({ metric, label, icon: Icon }) => (
    <button
      onClick={() => setSelectedMetrics(prev => ({
        ...prev,
        [metric]: !prev[metric]
      }))}
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium ${
        selectedMetrics[metric]
          ? 'bg-[#00bf60] text-white'
          : 'bg-[#e6f7ef] text-gray-700 hover:bg-[#d0f0e2]'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="overflow-hidden h-full rounded-lg bg-white shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Health Monitoring</h2>
            <p className="text-sm text-gray-500">Upcoming and past medical appointments</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <MetricToggle metric="heartRate" label="Heart Rate" icon={HeartPulse} />
            <MetricToggle metric="bloodPressure" label="Blood Pressure" icon={Activity} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        {[{
          label: 'Heart Rate',
          icon: HeartPulse,
          stats: heartRateStats,
          color: 'text-[#00bf60]',
          bgColor: 'bg-[#e6f7ef]'
        }, {
          label: 'Blood Pressure',
          icon: Activity,
          stats: bloodPressureStats,
          color: 'text-[#00bf60]',
          bgColor: 'bg-[#e6f7ef]'
        }].map(({ label, icon: Icon, stats, color, bgColor }, idx) => (
          <div key={idx} className={`p-4 rounded-lg ${bgColor} border border-gray-100`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color} bg-white`}>
                  <Icon size={18} />
                </div>
                <span className="font-medium text-gray-800">{label}</span>
              </div>
              <div className="flex items-center space-x-1">
                {stats.trend > 0 ? (
                  <TrendingUp size={16} className="text-[#00bf60]" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )}
                <span className="font-semibold text-gray-900">{stats.current}</span>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-gray-600">Avg: {stats.average}</p>
              <p className="text-sm text-gray-600 flex items-center">
                <span className={stats.trend > 0 ? "text-[#00bf60]" : "text-red-500"}>
                  {stats.trend > 0 ? "+" : ""}{stats.trend.toFixed(1)}%
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Health Metrics</h3>
            <div className="flex items-center text-xs text-gray-500">
              <BarChart3 size={14} className="mr-1" />
              <span>Last 6 months</span>
            </div>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                {selectedMetrics.heartRate && (
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#00bf60" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                )}
                {selectedMetrics.bloodPressure && (
                  <Line 
                    type="monotone" 
                    dataKey="bloodPressure" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitoring;