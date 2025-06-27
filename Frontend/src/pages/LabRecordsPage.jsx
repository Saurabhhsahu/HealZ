import React, { useState, useEffect } from "react";
import { useUser } from "@/context/userContext.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { 
  FileText, 
  Download, 
  BarChart2, 
  Info, 
  Heart, 
  Filter, 
  Plus, 
  Clock, 
  Calendar,
  Search,
  ChevronDown,
  TrendingUp,
  ArrowUpDown,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const LabRecordsPage = ({ darkMode }) => {
  const { profile } = useUser();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("reports");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months");
  const [pageHeight, setPageHeight] = useState("100vh");

  // Calculate viewport height
  useEffect(() => {
    const updateHeight = () => {
      setPageHeight(`${window.innerHeight - 80}px`);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Sample data if none is available
  const labReports = profile?.labReports || [
    { id: 1, test: "Complete Blood Count (CBC)", date: "2025-02-15", status: "Normal", doctor: "Dr. Sarah Johnson", lab: "City Medical Labs" },
    { id: 2, test: "Lipid Panel", date: "2025-02-15", status: "Elevated", doctor: "Dr. Sarah Johnson", lab: "City Medical Labs" },
    { id: 3, test: "Liver Function Test", date: "2025-01-20", status: "Normal", doctor: "Dr. Michael Chen", lab: "University Hospital" },
    { id: 4, test: "Hemoglobin A1C", date: "2025-01-20", status: "Abnormal", doctor: "Dr. Michael Chen", lab: "University Hospital" },
    { id: 5, test: "Thyroid Function Panel", date: "2024-12-05", status: "Normal", doctor: "Dr. Emily Rodriguez", lab: "Healthcare Partners" }
  ];

  const glucoseData = profile?.glucoseTrends || [
    { month: "Oct", value: 98, normal: 100 },
    { month: "Nov", value: 103, normal: 100 },
    { month: "Dec", value: 110, normal: 100 },
    { month: "Jan", value: 105, normal: 100 },
    { month: "Feb", value: 99, normal: 100 },
    { month: "Mar", value: 95, normal: 100 }
  ];

  const cholesterolData = [
    { month: "Oct", ldl: 110, hdl: 60, triglycerides: 150 },
    { month: "Nov", ldl: 115, hdl: 55, triglycerides: 160 },
    { month: "Dec", ldl: 125, hdl: 50, triglycerides: 180 },
    { month: "Jan", ldl: 120, hdl: 52, triglycerides: 170 },
    { month: "Feb", ldl: 115, hdl: 55, triglycerides: 155 },
    { month: "Mar", ldl: 100, hdl: 58, triglycerides: 140 }
  ];

  // Filter lab reports based on search term
  const filteredReports = labReports.filter(report => 
    report.test.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.lab?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Time period options for charts
  const timeframeOptions = {
    "3months": "3 Months",
    "6months": "6 Months",
    "1year": "1 Year",
    "all": "All Time"
  };

  // Status Badge Styling
  const getStatusStyle = (status) => {
    if (darkMode) {
      return status === "Normal" 
        ? "bg-green-900 bg-opacity-50 text-green-300" 
        : status === "Elevated" 
          ? "bg-red-900 bg-opacity-50 text-red-300"
          : "bg-yellow-900 bg-opacity-50 text-yellow-300";
    } else {
      return status === "Normal" 
        ? "bg-[#e6f7ef] text-[#00bf60]" 
        : status === "Elevated" 
          ? "bg-red-50 text-red-700" 
          : "bg-yellow-50 text-yellow-700";
    }
  };

  // Theme colors
  const bgColor = darkMode ? "bg-gray-900" : "bg-[#e6f7ef]";
  const cardBgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const secondaryTextColor = darkMode ? "text-gray-400" : "text-gray-500";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-100";
  const itemBgColor = darkMode ? "bg-gray-800" : "bg-white";
  const chartBgColor = darkMode ? "bg-gray-700" : "bg-gray-50";

  return (
    <div 
      className={`w-full ${bgColor} transition-colors`} 
      style={{ minHeight: pageHeight }}
    >
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <Card className={`h-full shadow-sm border ${borderColor} ${cardBgColor}`}>
              <CardHeader className={`border-b ${borderColor}`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                  <div>
                    <CardTitle className={`text-xl font-semibold ${textColor} flex items-center gap-2`}>
                      <Heart className="h-5 w-5 text-[#00bf60]" />
                      Lab Reports & Test Results
                    </CardTitle>
                    <CardDescription className={`${secondaryTextColor}`}>
                      View and analyze your laboratory test results
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className={`text-xs sm:text-sm ${darkMode ? "border-gray-700 text-gray-300" : "border-gray-200"}`}>
                      <Calendar className="h-4 w-4 mr-1" /> By Date
                    </Button>
                    <Button className="bg-[#00bf60] hover:bg-[#00a050] text-white text-xs sm:text-sm">
                      <Download className="h-4 w-4 mr-1" /> Export Results
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <div className="p-4">
                <Tabs defaultValue="reports" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex flex-col sm:flex-row items-start gap-3 mb-4 justify-between">
                    <TabsList className="bg-[#00bf60] p-1 rounded-lg">
                      <TabsTrigger
                        value="reports"
                        className={`rounded-md text-sm ${activeTab === "reports" ? "bg-white shadow-sm" : "text-white hover:bg-[#00a050]"}`}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Reports
                      </TabsTrigger>
                      <TabsTrigger
                        value="trends"
                        className={`rounded-md text-sm ${activeTab === "trends" ? "bg-white shadow-sm" : "text-white hover:bg-[#00a050]"}`}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Health Trends
                      </TabsTrigger>
                    </TabsList>
                    
                    {activeTab === "reports" && (
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          type="text" 
                          placeholder="Search reports..." 
                          className={`pl-9 w-full ${darkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-100"}`}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    )}
                    
                    {activeTab === "trends" && (
                      <div className="flex items-center">
                        <span className={`text-sm mr-2 ${secondaryTextColor}`}>Timeframe:</span>
                        <select 
                          value={selectedTimeframe}
                          onChange={(e) => setSelectedTimeframe(e.target.value)}
                          className={`p-2 text-sm rounded-md border ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600 text-gray-300" 
                              : "bg-white border-gray-200 text-gray-700"
                          }`}
                        >
                          {Object.entries(timeframeOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 350px)" }}>
                    <TabsContent value="reports" className="mt-0 space-y-2">
                      {/* Records Count */}
                      <div className="flex justify-between items-center mb-3">
                        <p className={`text-sm ${secondaryTextColor}`}>
                          Showing {filteredReports.length} reports
                        </p>
                        <Button variant="link" size="sm" className="text-[#00bf60] p-1 h-auto">
                          <Plus className="h-4 w-4 mr-1" /> Request New Test
                        </Button>
                      </div>

                      {filteredReports.length > 0 ? (
                        <div className="space-y-3">
                          {filteredReports.map((report) => (
                            <div
                              key={report.id}
                              className={`p-4 rounded-lg border ${borderColor} ${itemBgColor} hover:shadow-sm transition-all`}
                            >
                              <div className="flex flex-col sm:flex-row justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div className={`h-10 w-10 rounded-full ${darkMode ? "bg-gray-700" : "bg-[#e6f7ef]"} flex items-center justify-center ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"}`}>
                                    <FileText size={18} />
                                  </div>
                                  <div>
                                    <h4 className={`font-medium ${textColor}`}>{report.test}</h4>
                                    <div className="flex flex-wrap items-center mt-1 gap-x-3 gap-y-1">
                                      <p className={`text-sm ${secondaryTextColor} flex items-center`}>
                                        <Calendar className="h-3.5 w-3.5 mr-1" />
                                        {new Date(report.date).toLocaleDateString()}
                                      </p>
                                      <p className={`text-sm ${secondaryTextColor} flex items-center`}>
                                        <Info className="h-3.5 w-3.5 mr-1" />
                                        {report.lab}
                                      </p>
                                    </div>
                                    <p className={`text-xs ${secondaryTextColor} mt-1`}>
                                      Ordered by: {report.doctor}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                                  <Badge
                                    className={`${getStatusStyle(report.status)}`}
                                  >
                                    {report.status}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`p-2 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                  >
                                    <Download size={16} className="text-[#00bf60]" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`p-8 text-center rounded-lg border ${borderColor} ${itemBgColor}`}>
                          <div className="flex flex-col items-center justify-center">
                            <FileText className={`h-12 w-12 ${darkMode ? "text-gray-600" : "text-gray-300"} mb-3`} />
                            <p className={`${secondaryTextColor} mb-2`}>No lab reports matching your search.</p>
                            <p className={`text-sm ${secondaryTextColor}`}>Try adjusting your search terms or filters.</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="trends" className="mt-0 space-y-6">
                      {/* Glucose Trends */}
                      <Card className={`border ${borderColor} ${cardBgColor}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`h-8 w-8 rounded-full ${darkMode ? "bg-gray-700" : "bg-[#e6f7ef]"} flex items-center justify-center ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"}`}>
                                <TrendingUp size={16} />
                              </div>
                              <CardTitle className={`text-base font-medium ${textColor}`}>
                                Blood Glucose Trend
                              </CardTitle>
                            </div>
                            <Badge className={`${darkMode ? "bg-gray-700" : "bg-[#e6f7ef]"} ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"}`}>
                              {selectedTimeframe === "3months" ? "Last 3 months" : 
                               selectedTimeframe === "6months" ? "Last 6 months" :
                               selectedTimeframe === "1year" ? "Last 12 months" : "All time"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className={`p-4 rounded-lg ${chartBgColor}`}>
                            <div className="h-60 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={glucoseData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#eee"} />
                                  <XAxis dataKey="month" stroke={darkMode ? "#aaa" : "#888"} fontSize={12} />
                                  <YAxis stroke={darkMode ? "#aaa" : "#888"} fontSize={12} />
                                  <Tooltip
                                    contentStyle={{ 
                                      backgroundColor: darkMode ? "#1f2937" : "#fff", 
                                      borderColor: darkMode ? "#374151" : "#eee", 
                                      borderRadius: "6px",
                                      color: darkMode ? "#fff" : "#333"
                                    }}
                                  />
                                  <Bar
                                    name="Blood Glucose (mg/dL)"
                                    dataKey="value"
                                    fill={hoveredIndex !== null ? "#00a050" : "#00bf60"}
                                    barSize={30}
                                    radius={[4, 4, 0, 0]}
                                    onMouseOver={(data, index) => setHoveredIndex(index)}
                                    onMouseOut={() => setHoveredIndex(null)}
                                  />
                                  <Line
                                    name="Normal Range"
                                    type="monotone"
                                    dataKey="normal"
                                    stroke="#888"
                                    strokeDasharray="5 5"
                                    dot={false}
                                  />
                                  <Legend />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <div className={`text-sm ${secondaryTextColor}`}>
                              Latest reading: <span className={`font-medium ${textColor}`}>95 mg/dL</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full bg-[#00bf60]`}></div>
                              <span className={`text-xs ${secondaryTextColor}`}>Within normal range</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Cholesterol Trends */}
                      <Card className={`border ${borderColor} ${cardBgColor}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`h-8 w-8 rounded-full ${darkMode ? "bg-gray-700" : "bg-[#e6f7ef]"} flex items-center justify-center ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"}`}>
                                <Heart size={16} />
                              </div>
                              <CardTitle className={`text-base font-medium ${textColor}`}>
                                Cholesterol Profile
                              </CardTitle>
                            </div>
                            <Badge className={`${darkMode ? "bg-gray-700" : "bg-[#e6f7ef]"} ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"}`}>
                              {selectedTimeframe === "3months" ? "Last 3 months" : 
                               selectedTimeframe === "6months" ? "Last 6 months" :
                               selectedTimeframe === "1year" ? "Last 12 months" : "All time"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className={`p-4 rounded-lg ${chartBgColor}`}>
                            <div className="h-60 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={cholesterolData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#eee"} />
                                  <XAxis dataKey="month" stroke={darkMode ? "#aaa" : "#888"} fontSize={12} />
                                  <YAxis stroke={darkMode ? "#aaa" : "#888"} fontSize={12} />
                                  <Tooltip
                                    contentStyle={{ 
                                      backgroundColor: darkMode ? "#1f2937" : "#fff", 
                                      borderColor: darkMode ? "#374151" : "#eee", 
                                      borderRadius: "6px",
                                      color: darkMode ? "#fff" : "#333" 
                                    }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="ldl" 
                                    name="LDL (mg/dL)" 
                                    stroke="#00bf60" 
                                    strokeWidth={2}
                                    dot={{ fill: "#00bf60", r: 4 }}
                                    activeDot={{ r: 6, fill: "#00a050" }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="hdl" 
                                    name="HDL (mg/dL)" 
                                    stroke="#90cdf4" 
                                    strokeWidth={2}
                                    dot={{ fill: "#90cdf4", r: 4 }}
                                    activeDot={{ r: 6 }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="triglycerides" 
                                    name="Triglycerides (mg/dL)" 
                                    stroke="#d6bcfa" 
                                    strokeWidth={2}
                                    dot={{ fill: "#d6bcfa", r: 4 }}
                                    activeDot={{ r: 6 }}
                                  />
                                  <Legend />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-4 justify-between">
                              <div className="flex flex-col">
                                <span className={`text-xs ${secondaryTextColor}`}>LDL (Bad) Cholesterol</span>
                                <span className={`text-sm font-medium ${textColor}`}>100 mg/dL</span>
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-xs ${secondaryTextColor}`}>HDL (Good) Cholesterol</span>
                                <span className={`text-sm font-medium ${textColor}`}>58 mg/dL</span>
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-xs ${secondaryTextColor}`}>Triglycerides</span>
                                <span className={`text-sm font-medium ${textColor}`}>140 mg/dL</span>
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-xs ${secondaryTextColor}`}>Total Cholesterol</span>
                                <span className={`text-sm font-medium ${textColor}`}>186 mg/dL</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </Card>
          </div>

          {/* Right Side Panel */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Recent Tests Summary */}
            <Card className={`shadow-sm border ${borderColor} ${cardBgColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg font-medium ${textColor}`}>
                  <span className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-[#00bf60]" /> 
                    Test Summary
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-[#e6f7ef]"}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Total Tests</span>
                      <Badge className="bg-[#e6f7ef] text-[#00bf60]">{labReports.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Normal Results</span>
                      <Badge className="bg-[#e6f7ef] text-[#00bf60]">
                        {labReports.filter(report => report.status === "Normal").length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Abnormal Results</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {labReports.filter(report => report.status === "Abnormal").length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Elevated Results</span>
                      <Badge className="bg-red-100 text-red-800">
                        {labReports.filter(report => report.status === "Elevated").length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Latest Test</span>
                      <span className={`text-sm ${secondaryTextColor}`}>
                        {labReports.length > 0 
                          ? new Date(
                              Math.max(...labReports.map(r => new Date(r.date).getTime()))
                            ).toLocaleDateString() 
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className={`shadow-sm border ${borderColor} ${cardBgColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg font-medium ${textColor}`}>
                  <span className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-[#00bf60]" /> 
                    Test Actions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <Plus className="mr-2 h-4 w-4" /> Request New Lab Test
                </Button>
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <Download className="mr-2 h-4 w-4" /> Download All Results
                </Button>
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <Calendar className="mr-2 h-4 w-4" /> Schedule Follow-Up
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Tests */}
            <Card className={`shadow-sm border ${borderColor} ${cardBgColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg font-medium ${textColor}`}>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#00bf60]" /> 
                    Upcoming Tests
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg border ${darkMode ? "border-gray-700 bg-gray-700" : "border-[#e6f7ef] bg-[#e6f7ef]"}`}>
                  <div className="flex items-center mb-3 gap-3">
                    <div className={`h-10 w-10 rounded-full ${darkMode ? "bg-gray-600" : "bg-white"} flex items-center justify-center ${darkMode ? "text-[#00bf60]" : "text-[#00bf60]"}`}>
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${textColor}`}>Annual Physical Exam</h3>
                      <p className={`text-sm ${secondaryTextColor}`}>March 25, 2025 at 10:00 AM</p>
                    </div>
                  </div>
                  <div className={`text-sm ${secondaryTextColor} mb-2`}>
                    <p>Includes: CBC, Lipid Panel, Metabolic Panel, Urinalysis</p>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="link" className="text-[#00bf60] p-0 h-auto text-xs">
                      View details
                    </Button>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className={secondaryTextColor} />
                      <span className="text-xs">17 days away</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabRecordsPage;