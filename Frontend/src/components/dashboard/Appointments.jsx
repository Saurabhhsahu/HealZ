import { useState } from "react"
import { useUser } from "../../context/userContext"
import { Calendar, MapPin, ExternalLink, FileText, Video, User, Phone, Clock, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const Appointments = ({ darkMode }) => {
  const { profile, appointments } = useUser()
  const navigate = useNavigate();

  const appointmentData = appointments ? appointments : [];
  console.log("Appointments data:", appointmentData);

  // Sort appointments to show video calls at the top
  const sortedAppointments = [...appointmentData].sort((a, b) => {
    const aIsVideoCall = checkIfVideoCallOngoing(a);
    const bIsVideoCall = checkIfVideoCallOngoing(b);
    
    // If one is video call and other isn't, video call comes first
    if (aIsVideoCall && !bIsVideoCall) return -1;
    if (!aIsVideoCall && bIsVideoCall) return 1;
    
    // If both are video calls or neither are, sort by date (most recent first)
    const aDate = parseAppointmentDate(a.slotDate, a.slotTime);
    const bDate = parseAppointmentDate(b.slotDate, b.slotTime);
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <Card className={`h-full overflow-hidden ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      <CardHeader className={` px-3 sm:px-4 ${darkMode ? "border-gray-800" : "border-gray-100"} border-b`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
          <div>
            <CardTitle className={`text-lg sm:text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Appointments
            </CardTitle>
            <CardDescription className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Your medical appointments and consultations
            </CardDescription>
          </div>
          <div
            onClick={() => navigate('/doctors')}
          >
            <Button className="bg-[#00bf60] cursor-pointer hover:bg-[#00a050] text-white font-medium transition-colors border-0 text-sm h-9 px-3 py-2 self-start sm:self-auto">
              Schedule Now
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-4">
        <div className="max-h-[600px] overflow-y-auto pr-1 p-4">
          <div className="space-y-2">
            {sortedAppointments.length > 0 ? (
              sortedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  darkMode={darkMode}
                />
              ))
            ) : (
              <EmptyState
                icon={
                  <Calendar
                    className={`h-10 w-10 sm:h-12 sm:w-12 ${darkMode ? "text-gray-700" : "text-gray-300"
                      }`}
                  />
                }
                message="No appointments found"
                darkMode={darkMode}
              />
            )}
          </div>
        </div>

      </CardContent>
    </Card>

  )
}

// Helper function to parse appointment date
const parseAppointmentDate = (slotDate, slotTime) => {
  const [day, month, year] = slotDate.split('_')
  const dateStr = `${month}/${day}/${year}`
  return new Date(dateStr)
}

// Helper function to check if video call is ongoing
const checkIfVideoCallOngoing = (appointment) => {
  const appointmentDate = parseAppointmentDate(appointment.slotDate, appointment.slotTime)
  const appointmentDateTime = new Date(appointmentDate.toDateString() + ' ' + appointment.slotTime)
  const currentTime = new Date()
  // const isCompleted = appointment.isCompleted
  const isCompleted = false
  const isCancelled = appointment.cancelled
  const isPaid = appointment.payment

  // Check if appointment is today and within call window (30 minutes before to 1 hour after)
  const isToday = appointmentDate.toDateString() === currentTime.toDateString()
  const timeDiff = appointmentDateTime.getTime() - currentTime.getTime()
  const isLive = isToday && Math.abs(timeDiff) <= 15 * 60 * 1000 // Within 15 minutes of appointment time
  
  // Check if video call is ongoing (you might want to add a specific field for this in your data)
  const isVideoCallOngoing = appointment.videoCallActive || (isLive && isPaid && !isCompleted && !isCancelled)
  
  return isVideoCallOngoing
}

const AppointmentCard = ({ appointment, darkMode }) => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [isJoiningCall, setIsJoiningCall] = useState(false);

  // Parse the date from the appointment data
  const appointmentDate = parseAppointmentDate(appointment.slotDate, appointment.slotTime)
  const appointmentDateTime = new Date(appointmentDate.toDateString() + ' ' + appointment.slotTime)
  const currentTime = new Date()
  const isCompleted = appointment.isCompleted
  const isCancelled = appointment.cancelled
  const isPaid = appointment.payment

  // Check if appointment is today and within call window (30 minutes before to 1 hour after)
  const isToday = appointmentDate.toDateString() === currentTime.toDateString()
  const timeDiff = appointmentDateTime.getTime() - currentTime.getTime()
  const isCallAvailable = isToday && timeDiff >= -60 * 60 * 1000 && timeDiff <= 30 * 60 * 1000 // 1 hour after to 30 min before
  const isLive = isToday && Math.abs(timeDiff) <= 15 * 60 * 1000 // Within 15 minutes of appointment time
  
  // Check if video call is ongoing
  const isVideoCallOngoing = appointment.videoCallActive || (isLive && isPaid && !isCompleted && !isCancelled)

  // Determine status
  const getStatus = () => {
    if (isCancelled) return { text: "Cancelled", color: "red" }
    if (isCompleted) return { text: "Completed", color: "green" }
    if (isVideoCallOngoing) return { text: "Video Call Active", color: "videoCall" }
    if (isLive && isPaid) return { text: "Live Now", color: "pulse" }
    if (appointmentDate < new Date() && !isCompleted) return { text: "Missed", color: "orange" }
    if (isToday) return { text: "Today", color: "blue" }
    return { text: "Upcoming", color: "blue" }
  }

  const status = getStatus()

  const handleVideoCall = () => {
    setIsJoiningCall(true);
    // Simulate joining call delay
    setTimeout(() => {
      setIsJoiningCall(false);
      // Navigate to video call page
      navigate(`/video-call/${appointment._id}`);
    }, 2000);
  }

  const handleJoinActiveCall = () => {
    // Directly navigate to active video call without delay
    navigate(`/video-call/${appointment._id}`);
  }

  const handlePhoneCall = () => {
    // Handle phone call functionality
    console.log("Starting phone call for appointment:", appointment._id);
    window.open(`tel:${appointment.docData.phone || '+1234567890'}`);
  }

  const handleEndVideoCall = () => {
    // Handle ending video call
    console.log("Ending video call for appointment:", appointment._id);
    // You would typically update the appointment status here
    // updateAppointment(appointment._id, { videoCallActive: false });
  }

  return (
    <div
      className={`p-2 rounded-xl border ${darkMode
        ? "bg-gray-800 border-gray-700 hover:border-gray-600"
        : "bg-white border-gray-100 hover:border-gray-200"
        } transition-all shadow-sm hover:shadow ${
          status.color === 'pulse' ? 'ring-2 ring-green-500 ring-opacity-50' : ''
        } ${
          status.color === 'videoCall' ? 'ring-2 ring-red-500 ring-opacity-75 shadow-lg' : ''
        }`}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-0">
        {/* Doctor Details */}
        <div className="flex items-start gap-3">
          <div
            className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
              ? darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-50 text-gray-500"
              : status.color === 'videoCall'
                ? "bg-red-500 text-white animate-pulse"
              : status.color === 'pulse'
                ? "bg-green-500 text-white animate-pulse"
                : darkMode
                  ? "bg-[#e6f7ef] bg-opacity-20 text-[#e6f7ef]"
                  : "bg-[#e6f7ef] text-[#00bf60]"
              }`}
          >
            {isCompleted ? <FileText size={18} /> : (status.color === 'pulse' || status.color === 'videoCall') ? <Video size={18} /> : <User size={18} />}
          </div>
          <div>
            <h3 className={`font-medium text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
              {appointment.docData.name}
            </h3>
            <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {appointment.docData.speciality}
            </p>
            <div className={`flex items-center mt-1 text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <MapPin className={`h-3 w-3 mr-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              {appointment.docData.address.line1}, {appointment.docData.address.line2}
            </div>
          </div>
        </div>

        {/* Appointment Time & Status */}
        <div className="text-left sm:text-right ml-10 sm:ml-0 mt-1 sm:mt-0">
          <p className={`text-xs sm:text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {appointmentDate.toLocaleDateString()} at {appointment.slotTime}
          </p>
          <div className="flex flex-col gap-1 mt-1">
            <Badge
              className={`font-normal text-xs ${status.color === 'green'
                ? darkMode
                  ? "bg-green-900 text-green-300"
                  : "bg-green-50 text-green-700 hover:bg-green-50"
                : status.color === 'red'
                  ? darkMode
                    ? "bg-red-900 text-red-300"
                    : "bg-red-50 text-red-700 hover:bg-red-50"
                  : status.color === 'orange'
                    ? darkMode
                      ? "bg-orange-900 text-orange-300"
                      : "bg-orange-50 text-orange-700 hover:bg-orange-50"
                    : status.color === 'videoCall'
                      ? "bg-red-500 text-white animate-pulse"
                    : status.color === 'pulse'
                      ? "bg-green-500 text-white animate-pulse"
                      : darkMode
                        ? "bg-blue-900 text-blue-300"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-50"
                }`}
            >
              {status.text}
            </Badge>
            {isPaid && (
              <Badge
                className={`font-normal text-xs ${darkMode
                  ? "bg-[#e6f7ef] bg-opacity-20 text-[#e6f7ef]"
                  : "bg-[#e6f7ef] text-[#00bf60] hover:bg-[#e6f7ef]"
                  }`}
              >
                <CheckCircle size={10} className="mr-1" />
                Paid
              </Badge>
            )}
            {isCallAvailable && isPaid && !isVideoCallOngoing && (
              <Badge
                className={`font-normal text-xs ${darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-50 text-blue-700"
                  }`}
              >
                <Clock size={10} className="mr-1" />
                Call Available
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Fee */}
      <div className="mt-2 ml-10 sm:ml-12">
        <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Fee: ${appointment.amount}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 sm:mt-4 ml-10 sm:ml-16">
        {isCompleted ? (
          <Button
            variant="outline"
            size="sm"
            className={`text-xs h-8 px-2 py-1 ${darkMode
              ? "border-gray-700 text-gray-300 hover:bg-gray-800"
              : "bg-[#00bf60] text-white hover:bg-[#00a050]"
              }`}
          >
            View Summary
            <ExternalLink size={12} className="ml-1 sm:ml-2" />
          </Button>
        ) : isVideoCallOngoing ? (
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleJoinActiveCall}
              size="sm"
              className="text-xs h-8 px-2 py-1 bg-red-500 hover:bg-red-600 text-white animate-pulse flex items-center gap-1"
            >
              <Video size={12} />
              Join Active Call
            </Button>
            <Button
              onClick={handleEndVideoCall}
              variant="outline"
              size="sm"
              className={`text-xs h-8 px-2 py-1 ${darkMode
                ? "border-red-700 text-red-400 hover:bg-red-900"
                : "border-red-200 text-red-600 hover:bg-red-50"
                } flex items-center gap-1`}
            >
              End Call
            </Button>
          </div>
        ) : isPaid && isCallAvailable && !isCancelled ? (
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleVideoCall}
              disabled={isJoiningCall}
              size="sm"
              className={`text-xs h-8 px-2 py-1 ${status.color === 'pulse'
                ? "bg-green-500 hover:bg-green-600 text-white animate-pulse"
                : "bg-[#00bf60] hover:bg-[#00a050] text-white"
                } flex items-center gap-1`}
            >
              {isJoiningCall ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Joining...
                </>
              ) : (
                <>
                  <Video size={12} />
                  {status.color === 'pulse' ? 'Join Now' : 'Start Video Call'}
                </>
              )}
            </Button>
            <Button
              onClick={handlePhoneCall}
              variant="outline"
              size="sm"
              className={`text-xs h-8 px-2 py-1 ${darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef]"
                } flex items-center gap-1`}
            >
              <Phone size={12} />
              Call
            </Button>
            {!isLive && !isVideoCallOngoing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 px-2 py-1 border-[#e6f7ef] hover:border-[#00bf60] hover:bg-[#e6f7ef] text-[#00bf60]"
                >
                  Reschedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`text-xs h-8 px-2 py-1 ${darkMode
                    ? "border-red-700 text-red-400 hover:bg-red-900"
                    : "border-red-200 text-red-600 hover:bg-red-50"
                    }`}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        ) : !isCancelled && appointmentDate > new Date() && !isPaid ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="text-xs h-8 px-2 py-1 bg-[#00bf60] hover:bg-[#00a050] text-white"
            >
              Pay Now (${appointment.amount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 px-2 py-1 border-[#e6f7ef] hover:border-[#00bf60] hover:bg-[#e6f7ef] text-[#00bf60]"
            >
              Reschedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-8 px-2 py-1 ${darkMode
                ? "border-red-700 text-red-400 hover:bg-red-900"
                : "border-red-200 text-red-600 hover:bg-red-50"
                }`}
            >
              Cancel
            </Button>
          </div>
        ) : !isCancelled && appointmentDate > new Date() ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 px-2 py-1 border-[#e6f7ef] hover:border-[#00bf60] hover:bg-[#e6f7ef] text-[#00bf60]"
            >
              Reschedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-8 px-2 py-1 ${darkMode
                ? "border-red-700 text-red-400 hover:bg-red-900"
                : "border-red-200 text-red-600 hover:bg-red-50"
                }`}
            >
              Cancel
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// export default AppointmentCard;

const EmptyState = ({ icon, message, darkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-center p-4 sm:p-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 bg-opacity-50">
      <div className="mb-2 sm:mb-3">{icon}</div>
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>{message}</p>
      <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-500" : "text-gray-400"} mt-1`}>
        Your appointments will appear here
      </p>
    </div>
  )
}

export default Appointments