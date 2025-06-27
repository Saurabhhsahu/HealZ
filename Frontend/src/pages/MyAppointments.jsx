"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/userContext"
import { Calendar, MapPin, ExternalLink, FileText, Video, User, Plus, Clock, Star, HeartPulse } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import Appointments from "@/components/dashboard/Appointments"

const MyAppointments = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState("upcoming")
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

  const appointments = profile?.appointments || [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      department: "Cardiology",
      location: "Main Hospital, Floor 3",
      date: "2025-03-15",
      time: "10:30 AM",
      isOnline: false,
      status: "confirmed"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      department: "Telemedicine",
      location: "Virtual Consultation",
      date: "2025-03-20",
      time: "2:15 PM",
      isOnline: true,
      status: "scheduled"
    }
  ]
  
  const pastAppointmentSample = [
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      department: "General Medicine",
      location: "Downtown Clinic",
      date: "2025-02-10",
      time: "9:00 AM",
      isOnline: false,
      diagnosis: "Seasonal allergies with mild respiratory symptoms",
      prescription: "Cetirizine 10mg once daily for 14 days, saline nasal spray as needed",
      status: "completed"
    }
  ]

  // Separate upcoming and past appointments dynamically
  const upcomingAppointments = appointments.filter((appointment) => !appointment.prescription)
  const pastAppointments = appointments.filter((appointment) => appointment.prescription) || pastAppointmentSample

  return (
    <div 
      className={`w-full ${darkMode ? "bg-gray-900" : "bg-[#e6f7ef]"} transition-colors`} 
      style={{ minHeight: pageHeight }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Column - Appointments List */}
          <div className="w-full md:w-2/3 h-screen overflow-y-auto p-3">
            <Appointments />
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
                  <Calendar className="mr-2 h-4 w-4" /> Book New Appointment
                </Button>
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <Video className="mr-2 h-4 w-4" /> Start Virtual Consultation
                </Button>
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <FileText className="mr-2 h-4 w-4" /> View Medical Records
                </Button>
              </CardContent>
            </Card>

            {/* Health Summary Card */}
            <Card className={`border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  <span className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-[#00bf60]" /> 
                    Health Summary
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-800" : "bg-[#e6f7ef]"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Recent Consultations</span>
                    <Badge className="bg-[#e6f7ef] text-[#00bf60]">{pastAppointments.length || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Upcoming Appointments</span>
                    <Badge className="bg-[#e6f7ef] text-[#00bf60]">{upcomingAppointments.length || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Prescription Renewals</span>
                    <Badge className="bg-[#e6f7ef] text-[#00bf60]">0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className={`border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Healthcare Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg border ${darkMode ? "border-gray-700 bg-gray-800" : "border-[#e6f7ef] bg-[#e6f7ef]"}`}>
                  <div className="text-sm text-center">
                    <p className={`mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Regular check-ups help prevent health issues. Schedule your annual physical exam today.
                    </p>
                    <Button variant="link" className="text-[#00bf60] p-0 h-auto">
                      Learn more
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

const AppointmentCard = ({ appointment, darkMode, isPast }) => {
  return (
    <div
      className={`p-4 rounded-xl border ${
        darkMode
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-100 hover:border-gray-200"
        } transition-all shadow-sm hover:shadow`}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
        {/* Doctor Details */}
        <div className="flex items-start gap-3">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isPast
                ? darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-50 text-gray-500"
                : appointment.isOnline
                  ? darkMode
                    ? "bg-[#e6f7ef] bg-opacity-20 text-[#00bf60]"
                    : "bg-[#e6f7ef] text-[#00bf60]"
                  : darkMode
                    ? "bg-[#e6f7ef] bg-opacity-20 text-[#00bf60]"
                    : "bg-[#e6f7ef] text-[#00bf60]"
              }`}
          >
            {isPast ? <FileText size={20} /> : appointment.isOnline ? <Video size={20} /> : <User size={20} />}
          </div>
          <div>
            <h3 className={`font-medium text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
              {appointment.doctor}
            </h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{appointment.department}</p>
            <div className={`flex items-center mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <MapPin className={`h-3.5 w-3.5 mr-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              {appointment.location}
            </div>
          </div>
        </div>

        {/* Appointment Time & Badge */}
        <div className="text-left sm:text-right ml-10 sm:ml-0 mt-1 sm:mt-0">
          <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
          </p>
          {!isPast && (
            <Badge
              className={`mt-1 font-normal ${
                appointment.isOnline
                  ? darkMode
                    ? "bg-[#e6f7ef] bg-opacity-20 text-[#00bf60]"
                    : "bg-[#e6f7ef] text-[#00bf60] hover:bg-[#e6f7ef]"
                  : darkMode
                    ? "bg-[#e6f7ef] bg-opacity-20 text-[#00bf60]"
                    : "bg-[#e6f7ef] text-[#00bf60] hover:bg-[#e6f7ef]"
                }`}
            >
              {appointment.isOnline ? "Online" : "In-person"}
            </Badge>
          )}
        </div>
      </div>

      {/* Diagnosis & Prescription Section for Past Appointments */}
      {isPast && appointment.diagnosis && (
        <div className="mt-4 ml-0 sm:ml-14">
          <div className={`pl-4 border-l ${darkMode ? "border-gray-700" : "border-[#e6f7ef]"}`}>
            <h4 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Diagnosis:</h4>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{appointment.diagnosis}</p>

            <h4 className={`text-sm font-medium mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Prescription:
            </h4>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{appointment.prescription}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 ml-0 sm:ml-14 flex flex-wrap gap-2">
        {isPast ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className={`text-sm ${darkMode ? "border-gray-700 text-[#00bf60] hover:bg-gray-800 hover:text-[#00bf60]" : "border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef]"}`}
            >
              View Summary
              <ExternalLink size={14} className="ml-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`text-sm ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              Download Records
            </Button>
          </>
        ) : (
          <>
            {appointment.isOnline && (
              <Button
                variant="outline"
                size="sm"
                className={`text-sm ${darkMode ? "border-[#00bf60] bg-opacity-10 text-[#00bf60] hover:bg-[#00bf60] hover:bg-opacity-20" : "border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef]"}`}
              >
                Join Meeting
                <ExternalLink size={14} className="ml-2" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className={`text-sm ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              Reschedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`text-sm ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              Cancel
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
        Your appointments will appear here once scheduled. Click the "Schedule Now" button to book a new appointment.
      </p>
      <Button className="mt-4 bg-[#00bf60] hover:bg-[#00a050] text-white">
        <Plus className="mr-2 h-4 w-4" /> Schedule Appointment
      </Button>
    </div>
  )
}

export default MyAppointments