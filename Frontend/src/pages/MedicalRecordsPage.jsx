import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, Scissors, FileText, Calendar, Clock, Heart, Plus, Download, Printer, Filter, Search, ArrowUpDown, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MedicalRecords = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('conditions');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageHeight, setPageHeight] = useState("100vh");

  // Measure available height
  useEffect(() => {
    // Update height on window resize
    const updateHeight = () => {
      // Remove 80px for potential header/footer
      setPageHeight(`${window.innerHeight - 80}px`);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const medicalData = {
    conditions: [
      { name: "Type 2 Diabetes", since: "2018", severity: "Moderate", notes: "Well controlled with medication", doctor: "Dr. Sarah Johnson" },
      { name: "Hypertension", since: "2020", severity: "Mild", notes: "Monitoring regularly", doctor: "Dr. Michael Chen" },
      { name: "Asthma", since: "2015", severity: "Moderate", notes: "Seasonal exacerbations, maintenance inhaler", doctor: "Dr. Emily Rodriguez" },
      { name: "Hypothyroidism", since: "2019", severity: "Mild", notes: "Stable on levothyroxine", doctor: "Dr. James Wilson" }
    ],
    allergies: [
      { name: "Penicillin", severity: "Severe", reaction: "Anaphylaxis", noted: "2010", doctor: "Dr. Lisa Thompson" },
      { name: "Peanuts", severity: "Moderate", reaction: "Skin rash, breathing difficulties", noted: "2005", doctor: "Dr. Robert Davis" },
      { name: "Shellfish", severity: "Severe", reaction: "Hives, throat swelling", noted: "2018", doctor: "Dr. Sarah Johnson" },
      { name: "Latex", severity: "Mild", reaction: "Contact dermatitis", noted: "2021", doctor: "Dr. James Wilson" }
    ],
    surgeries: [
      { procedure: "Appendectomy", date: "2015-03-15", hospital: "Metro General Hospital", surgeon: "Dr. Thomas Reynolds", notes: "Uncomplicated recovery" },
      { procedure: "Knee Arthroscopy", date: "2019-11-22", hospital: "Orthopedic Specialty Center", surgeon: "Dr. Amanda Foster", notes: "Physical therapy for 8 weeks post-op" },
      { procedure: "Tonsillectomy", date: "2008-07-10", hospital: "Children's Medical Center", surgeon: "Dr. Kevin Park", notes: "Childhood procedure" },
      { procedure: "Wisdom Teeth Extraction", date: "2016-05-03", hospital: "Dental Surgery Center", surgeon: "Dr. Maria Gonzalez", notes: "All four removed under general anesthesia" }
    ]
  };

  const filteredData = {
    conditions: medicalData.conditions.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    allergies: medicalData.allergies.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.reaction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    surgeries: medicalData.surgeries.filter(item => 
      item.procedure.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.surgeon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const tabConfig = {
    conditions: {
      icon: <Activity size={16} className="mr-2" />,
      label: "Conditions",
      color: darkMode ? "text-[#00bf60]" : "text-[#00bf60]",
      bgColor: darkMode ? "bg-gray-700" : "bg-[#e6f7ef]"
    },
    allergies: {
      icon: <AlertCircle size={16} className="mr-2" />,
      label: "Allergies",
      color: darkMode ? "text-[#00bf60]" : "text-[#00bf60]",
      bgColor: darkMode ? "bg-gray-700" : "bg-[#e6f7ef]"
    },
    surgeries: {
      icon: <Scissors size={16} className="mr-2" />,
      label: "Surgeries",
      color: darkMode ? "text-[#00bf60]" : "text-[#00bf60]",
      bgColor: darkMode ? "bg-gray-700" : "bg-[#e6f7ef]"
    }
  };

  const getSeverityStyles = (severity, isDarkMode) => {
    if (isDarkMode) {
      return severity === 'Severe' 
        ? 'bg-red-900 bg-opacity-50 text-red-300' 
        : severity === 'Moderate' 
          ? 'bg-yellow-900 bg-opacity-50 text-yellow-300' 
          : 'bg-green-900 bg-opacity-50 text-green-300';
    } else {
      return severity === 'Severe' 
        ? 'bg-red-50 text-red-700' 
        : severity === 'Moderate' 
          ? 'bg-yellow-50 text-yellow-700' 
          : 'bg-[#e6f7ef] text-[#00bf60]';
    }
  };

  // Set colors based on dark mode
  const bgColor = darkMode ? "bg-gray-900" : "bg-[#e6f7ef]";
  const cardBgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const secondaryTextColor = darkMode ? "text-gray-400" : "text-gray-500";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-100";
  const itemBgColor = darkMode ? "bg-gray-800" : "bg-white";
  const itemHoverBorder = darkMode ? "hover:border-gray-600" : "hover:border-gray-200";

  return (
    <div 
      className={`w-full ${bgColor} transition-colors`} 
      style={{ minHeight: pageHeight }}
    >
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Panel */}
          <div className="w-full lg:w-2/3">
            <Card className={`h-full shadow-sm border ${borderColor} ${cardBgColor}`}>
              <CardHeader className={`border-b ${borderColor}`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                  <div>
                    <CardTitle className={`text-xl font-semibold ${textColor} flex items-center gap-2`}>
                      <Heart className="h-5 w-5 text-[#00bf60]" />
                      Medical Records & History
                    </CardTitle>
                    <CardDescription className={`${secondaryTextColor}`}>
                      Your comprehensive health record including conditions, allergies, and surgeries
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className={`text-xs sm:text-sm ${darkMode ? "border-gray-700 text-gray-300" : "border-gray-200"}`}>
                      <Printer className="h-4 w-4 mr-1" /> Print
                    </Button>
                    <Button className="bg-[#00bf60] hover:bg-[#00a050] text-white text-xs sm:text-sm">
                      <Download className="h-4 w-4 mr-1" /> Export Records
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <div className="p-4">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="text" 
                      placeholder="Search records..." 
                      className={`pl-9 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-100"}`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className={`px-3 ${darkMode ? "border-gray-700 text-gray-300" : "border-gray-200"}`}>
                    <Filter className="h-4 w-4 mr-2" /> Filters
                  </Button>
                  <Button variant="outline" size="sm" className={`px-3 ${darkMode ? "border-gray-700 text-gray-300" : "border-gray-200"}`}>
                    <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
                  </Button>
                </div>

                {/* Tabs */}
                <div className="bg-[#00bf60] text-white inline-flex p-1 rounded-lg mb-4 overflow-x-auto whitespace-nowrap">
                  {Object.keys(tabConfig).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition ${
                        activeTab === tab
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-white hover:bg-[#00a050]'
                      }`}
                    >
                      {tabConfig[tab].icon}
                      {tabConfig[tab].label}
                    </button>
                  ))}
                </div>

                {/* Data Display */}
                <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 350px)" }}>
                  {/* Records Count */}
                  <div className="flex justify-between items-center mb-3">
                    <p className={`text-sm ${secondaryTextColor}`}>
                      Showing {filteredData[activeTab].length} {activeTab}
                    </p>
                    <Button variant="link" size="sm" className="text-[#00bf60] p-1 h-auto">
                      <Plus className="h-4 w-4 mr-1" /> Add New
                    </Button>
                  </div>

                  {activeTab === 'conditions' && (
                    <div className="space-y-3">
                      {filteredData.conditions.length > 0 ? filteredData.conditions.map((condition, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${borderColor} ${itemBgColor} ${itemHoverBorder} transition-colors`}>
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                            <div className="flex items-start gap-3">
                              <div className={`h-10 w-10 rounded-full ${tabConfig.conditions.bgColor} flex items-center justify-center ${tabConfig.conditions.color}`}>
                                <Activity size={18} />
                              </div>
                              <div>
                                <h3 className={`font-medium ${textColor}`}>{condition.name}</h3>
                                <div className={`flex items-center mt-1 text-sm ${secondaryTextColor}`}>
                                  <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                  Since: {condition.since}
                                </div>
                                <p className={`text-sm ${secondaryTextColor} mt-1`}>{condition.notes}</p>
                                <p className={`text-xs ${secondaryTextColor} mt-2`}>Diagnosed by: {condition.doctor}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getSeverityStyles(condition.severity, darkMode)}`}>
                                {condition.severity}
                              </span>
                              <Button variant="ghost" size="sm" className="p-1 h-6">
                                <FileText className="h-4 w-4 text-[#00bf60]" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className={`p-8 text-center rounded-lg border ${borderColor} ${itemBgColor}`}>
                          <p className={secondaryTextColor}>No conditions found matching your search.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'allergies' && (
                    <div className="space-y-3">
                      {filteredData.allergies.length > 0 ? filteredData.allergies.map((allergy, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${borderColor} ${itemBgColor} ${itemHoverBorder} transition-colors`}>
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                            <div className="flex items-start gap-3">
                              <div className={`h-10 w-10 rounded-full ${tabConfig.allergies.bgColor} flex items-center justify-center ${tabConfig.allergies.color}`}>
                                <AlertCircle size={18} />
                              </div>
                              <div>
                                <h3 className={`font-medium ${textColor}`}>{allergy.name}</h3>
                                <p className={`text-sm ${secondaryTextColor} mt-1`}>Reaction: {allergy.reaction}</p>
                                <div className={`flex items-center mt-1 text-sm ${secondaryTextColor}`}>
                                  <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                  Noted: {allergy.noted}
                                </div>
                                <p className={`text-xs ${secondaryTextColor} mt-2`}>Recorded by: {allergy.doctor}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getSeverityStyles(allergy.severity, darkMode)}`}>
                                {allergy.severity}
                              </span>
                              <Button variant="ghost" size="sm" className="p-1 h-6">
                                <FileText className="h-4 w-4 text-[#00bf60]" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className={`p-8 text-center rounded-lg border ${borderColor} ${itemBgColor}`}>
                          <p className={secondaryTextColor}>No allergies found matching your search.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'surgeries' && (
                    <div className="space-y-3">
                      {filteredData.surgeries.length > 0 ? filteredData.surgeries.map((surgery, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${borderColor} ${itemBgColor} ${itemHoverBorder} transition-colors`}>
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                            <div className="flex items-start gap-3">
                              <div className={`h-10 w-10 rounded-full ${tabConfig.surgeries.bgColor} flex items-center justify-center ${tabConfig.surgeries.color}`}>
                                <Scissors size={18} />
                              </div>
                              <div>
                                <h3 className={`font-medium ${textColor}`}>{surgery.procedure}</h3>
                                <div className={`flex items-center mt-1 text-sm ${secondaryTextColor}`}>
                                  <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                  {new Date(surgery.date).toLocaleDateString()}
                                </div>
                                <p className={`text-sm ${secondaryTextColor} mt-1`}>
                                  Hospital: {surgery.hospital}
                                </p>
                                <p className={`text-sm ${secondaryTextColor} mt-1`}>
                                  {surgery.notes}
                                </p>
                                <p className={`text-xs ${secondaryTextColor} mt-2`}>Surgeon: {surgery.surgeon}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="p-1 h-6 self-start">
                              <FileText className="h-4 w-4 text-[#00bf60]" />
                            </Button>
                          </div>
                        </div>
                      )) : (
                        <div className={`p-8 text-center rounded-lg border ${borderColor} ${itemBgColor}`}>
                          <p className={secondaryTextColor}>No surgeries found matching your search.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side Panel */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Health Summary Card */}
            <Card className={`shadow-sm border ${borderColor} ${cardBgColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg font-medium ${textColor}`}>
                  <span className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-[#00bf60]" /> 
                    Health Summary
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-[#e6f7ef]"}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Conditions</span>
                      <Badge className="bg-[#e6f7ef] text-[#00bf60]">{medicalData.conditions.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Allergies</span>
                      <Badge className="bg-[#e6f7ef] text-[#00bf60]">{medicalData.allergies.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Surgeries</span>
                      <Badge className="bg-[#e6f7ef] text-[#00bf60]">{medicalData.surgeries.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Last Updated</span>
                      <span className={`text-sm ${secondaryTextColor}`}>March 5, 2025</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card className={`shadow-sm border ${borderColor} ${cardBgColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg font-medium ${textColor}`}>
                  <span className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-[#00bf60]" /> 
                    Health Actions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <Plus className="mr-2 h-4 w-4" /> Add New Medical Record
                </Button>
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <Download className="mr-2 h-4 w-4" /> Download Complete History
                </Button>
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <Calendar className="mr-2 h-4 w-4" /> Schedule Follow-Up
                </Button>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className={`shadow-sm border ${borderColor} ${cardBgColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg font-medium ${textColor}`}>
                  Medical Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg border ${darkMode ? "border-gray-700 bg-gray-700" : "border-[#e6f7ef] bg-[#e6f7ef]"}`}>
                  <div className="text-sm">
                    <p className={`mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Remember to bring your updated medication list to your next appointment with Dr. Johnson on March 15.
                    </p>
                    <Button variant="link" className="text-[#00bf60] p-0 h-auto">
                      Set reminder
                    </Button>
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

export default MedicalRecords;