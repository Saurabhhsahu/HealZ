"use client"

import React, { useState, useEffect } from "react"
import { useUser } from "@/context/userContext"
import { 
  Pill, 
  Calendar, 
  Clock, 
  Bell, 
  RefreshCw, 
  Plus, 
  FileText, 
  Settings,
  Star, 
  ChevronRight,
  ExternalLink,
  AlarmClock,
  AlertCircle
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

function MedicationPage({ darkMode }) {
  const [activeTab, setActiveTab] = useState("current")
  const { profile } = useUser()
  const [pageHeight, setPageHeight] = useState("100vh")

  // Measure available height
  useEffect(() => {
    // Update height on window resize
    const updateHeight = () => {
      // Remove 80px for potential header/footer
      setPageHeight(`${window.innerHeight - 80}px`)
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Sample medications data
  const medications = profile?.medications || [
    {
      id: 1,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily in the evening",
      startDate: "2025-01-15",
      refillDate: "2025-03-30",
      instructions: "Take with food",
      type: "Prescription",
      prescribedBy: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily in the morning",
      startDate: "2025-02-05",
      refillDate: "2025-03-18",
      instructions: "Take on empty stomach",
      type: "Prescription",
      prescribedBy: "Dr. Michael Chen"
    }
  ]

  const pastMedications = [
    {
      id: 3,
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      startDate: "2025-01-01",
      endDate: "2025-01-14",
      instructions: "Complete full course",
      type: "Prescription",
      prescribedBy: "Dr. Emily Rodriguez",
      status: "completed"
    }
  ]

  // Calculate days until refill
  const calculateDaysUntilRefill = (refillDate) => {
    const today = new Date()
    const refillDay = new Date(refillDate)
    return Math.ceil((refillDay - today) / (1000 * 60 * 60 * 24))
  }

  return (
    <div 
      className={`w-full ${darkMode ? "bg-gray-900" : "bg-[#e6f7ef]"} transition-colors`} 
      style={{ minHeight: pageHeight }}
    >
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Medications List */}
          <div className="w-full md:w-2/3">
            <Card className={`h-full overflow-hidden border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`}>
              <CardHeader className={`px-4 py-4 ${darkMode ? "border-gray-800" : "border-gray-100"} border-b`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <CardTitle className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      <span className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-[#00bf60]" /> 
                        Medications & Prescriptions
                      </span>
                    </CardTitle>
                    <CardDescription className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Manage your current and past medications
                    </CardDescription>
                  </div>
                  <Button className="bg-[#00bf60] hover:bg-[#00a050] text-white font-medium transition-colors border-0 h-10">
                    <Plus className="mr-2 h-4 w-4" /> Add Medication
                  </Button>
                </div>
              </CardHeader>

              <div className="px-4 pt-4">
                <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-2 bg-[#00bf60] p-1 rounded-lg">
                    <TabsTrigger
                      value="current"
                      className={`rounded-md ${activeTab === "current" ? "bg-white shadow-sm" : "text-white hover:bg-[#00a050]"}`}
                    >
                      <Pill className="mr-2 h-4 w-4" />
                      Current
                    </TabsTrigger>
                    <TabsTrigger 
                      value="past" 
                      className={`rounded-md ${activeTab === "past" ? "bg-white shadow-sm" : "text-white hover:bg-[#00a050]"}`}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Past Medications
                    </TabsTrigger>
                  </TabsList>

                  <CardContent className="px-0 py-4">
                    <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
                      <TabsContent value="current" className="m-0 space-y-4">
                        <div className="space-y-4">
                          {medications.length > 0 ? (
                            medications.map((medication) => (
                              <MedicationCard
                                key={medication.id}
                                medication={medication}
                                darkMode={darkMode}
                                isPast={false}
                              />
                            ))
                          ) : (
                            <EmptyState
                              icon={<Pill className={`h-14 w-14 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />}
                              message="No current medications"
                              darkMode={darkMode}
                            />
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="past" className="m-0 space-y-4">
                        <div className="space-y-4">
                          {pastMedications.length > 0 ? (
                            pastMedications.map((medication) => (
                              <MedicationCard
                                key={medication.id}
                                medication={medication}
                                darkMode={darkMode}
                                isPast={true}
                              />
                            ))
                          ) : (
                            <EmptyState
                              icon={<FileText className={`h-14 w-14 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />}
                              message="No past medications"
                              darkMode={darkMode}
                            />
                          )}
                        </div>
                      </TabsContent>
                    </div>
                  </CardContent>
                </Tabs>
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="w-full md:w-1/3 space-y-6">
            {/* Quick Actions Card */}
            <Card className={`border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  <span className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#00bf60]" /> 
                    Quick Actions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <RefreshCw className="mr-2 h-4 w-4" /> Request All Refills
                </Button>
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <Bell className="mr-2 h-4 w-4" /> Set Medication Reminders
                </Button>
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <FileText className="mr-2 h-4 w-4" /> View Prescription History
                </Button>
              </CardContent>
            </Card>

            {/* Medication Summary Card */}
            <Card className={`border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  <span className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-[#00bf60]" /> 
                    Medication Summary
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-800" : "bg-[#e6f7ef]"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Current Medications</span>
                    <Badge className="bg-[#e6f7ef] text-[#00bf60]">{medications.length || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Upcoming Refills (7 days)</span>
                    <Badge className="bg-[#e6f7ef] text-[#00bf60]">
                      {medications.filter(med => calculateDaysUntilRefill(med.refillDate) <= 7).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Past Medications</span>
                    <Badge className="bg-[#e6f7ef] text-[#00bf60]">{pastMedications.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className={`border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Medication Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg border ${darkMode ? "border-gray-700 bg-gray-800" : "border-[#e6f7ef] bg-[#e6f7ef]"}`}>
                  <div className="text-sm text-center">
                    <p className={`mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Taking medications at the same time each day helps maintain consistent levels in your system.
                    </p>
                    <Button variant="link" className="text-[#00bf60] p-0 h-auto">
                      Learn more about medication adherence
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const MedicationCard = ({ medication, darkMode, isPast }) => {
  // Calculate days until refill
  const calculateDaysUntilRefill = (refillDate) => {
    if (!refillDate) return null;
    const today = new Date()
    const refillDay = new Date(refillDate)
    return Math.ceil((refillDay - today) / (1000 * 60 * 60 * 24))
  }

  const daysUntilRefill = medication.refillDate ? calculateDaysUntilRefill(medication.refillDate) : null;
  const needsRefill = daysUntilRefill !== null && daysUntilRefill <= 7;

  return (
    <div
      className={`p-4 rounded-xl border ${
        darkMode
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-100 hover:border-gray-200"
        } transition-all shadow-sm hover:shadow`}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
        {/* Medication Details */}
        <div className="flex items-start gap-3">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isPast
                ? darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-50 text-gray-500"
                : darkMode
                  ? "bg-[#e6f7ef] bg-opacity-20 text-[#00bf60]"
                  : "bg-[#e6f7ef] text-[#00bf60]"
              }`}
          >
            <Pill size={20} />
          </div>
          <div>
            <h3 className={`font-medium text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
              {medication.name} {medication.dosage}
            </h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{medication.frequency}</p>
            <div className={`flex items-center mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <FileText className={`h-3.5 w-3.5 mr-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              {medication.type}
            </div>
          </div>
        </div>

        {/* Refill Time & Badge */}
        <div className="text-left sm:text-right ml-10 sm:ml-0 mt-1 sm:mt-0">
          {!isPast ? (
            <>
              <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                Started: {new Date(medication.startDate).toLocaleDateString()}
              </p>
              {daysUntilRefill !== null && (
                <Badge
                  className={`mt-1 font-normal ${
                    needsRefill
                      ? "bg-red-50 text-red-700 hover:bg-red-50"
                      : darkMode
                        ? "bg-[#e6f7ef] bg-opacity-20 text-[#00bf60]"
                        : "bg-[#e6f7ef] text-[#00bf60] hover:bg-[#e6f7ef]"
                    }`}
                >
                  {needsRefill ? `Refill in ${daysUntilRefill} days` : `Refill in ${daysUntilRefill} days`}
                </Badge>
              )}
            </>
          ) : (
            <>
              <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                {new Date(medication.startDate).toLocaleDateString()} - {new Date(medication.endDate).toLocaleDateString()}
              </p>
              <Badge
                className={`mt-1 font-normal ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                  }`}
              >
                Completed
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Instructions Section */}
      <div className="mt-4 ml-0 sm:ml-14">
        <div className={`pl-4 border-l ${darkMode ? "border-gray-700" : "border-[#e6f7ef]"}`}>
          <div className="flex items-center mb-1">
            <Clock className={`h-4 w-4 mr-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <h4 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Instructions:</h4>
          </div>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{medication.instructions}</p>

          <div className="flex items-center mt-2 mb-1">
            <Calendar className={`h-4 w-4 mr-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <h4 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Prescribed by:
            </h4>
          </div>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{medication.prescribedBy}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 ml-0 sm:ml-14 flex flex-wrap gap-2">
        {isPast ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className={`text-sm ${darkMode ? "border-gray-700 text-[#00bf60] hover:bg-gray-800 hover:text-[#00bf60]" : "border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef]"}`}
            >
              View Details
              <ExternalLink size={14} className="ml-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`text-sm ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              Download History
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className={`text-sm ${darkMode ? "border-[#00bf60] bg-opacity-10 text-[#00bf60] hover:bg-[#00bf60] hover:bg-opacity-20" : "border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef]"}`}
            >
              <RefreshCw size={14} className="mr-2" />
              Request Refill
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`text-sm ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              <Bell size={14} className="mr-2" />
              Set Reminder
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`text-sm ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              <AlertCircle size={14} className="mr-2" />
              Side Effects
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

const EmptyState = ({ icon, message, darkMode }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-64 text-center p-6 rounded-xl border border-dashed ${darkMode ? "border-gray-700 bg-gray-800 bg-opacity-50" : "border-[#e6f7ef] bg-[#e6f7ef] bg-opacity-50"}`}>
      <div className="mb-4">{icon}</div>
      <p className={`text-base ${darkMode ? "text-gray-300" : "text-gray-600"} font-medium`}>{message}</p>
      <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"} mt-2 max-w-md`}>
        Your medications will appear here once added. Click the "Add Medication" button to add a new medication.
      </p>
      <Button className="mt-4 bg-[#00bf60] hover:bg-[#00a050] text-white">
        <Plus className="mr-2 h-4 w-4" /> Add Medication
      </Button>
    </div>
  )
}

export default MedicationPage