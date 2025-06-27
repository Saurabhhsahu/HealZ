import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../Context/DoctorContext.jsx';
import { 
  User, 
  Video, 
  Phone, 
  Clock, 
  MapPin, 
  CheckCircle, 
  FileText, 
  ExternalLink,
  Calendar,
  X
} from 'lucide-react';

// Badge component (you might need to import this from your UI library)
const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

// Button component (you might need to import this from your UI library)
const Button = ({ children, onClick, disabled, size, variant, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${
      size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 py-2 text-sm'
    } ${
      variant === 'outline' 
        ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' 
        : 'bg-primary text-primary-foreground hover:bg-primary/90'
    } ${className}`}
  >
    {children}
  </button>
);

const parseAppointmentDate = (slotDate, slotTime) => {
  const [day, month, year] = slotDate.split('_');
  return new Date(year, month - 1, day);
};

const AppointmentCard = ({ appointment, darkMode }) => {
  const navigate = useNavigate();
  const { cancelAppointment, completeAppointment, getAppointments } = useContext(DoctorContext);
  const [isJoiningCall, setIsJoiningCall] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse the date from the appointment data
  const appointmentDate = parseAppointmentDate(appointment.slotDate, appointment.slotTime);
  const appointmentDateTime = new Date(appointmentDate.toDateString() + ' ' + appointment.slotTime);
  const currentTime = new Date();
  const isCompleted = appointment.isCompleted;
  const isCancelled = appointment.cancelled;
  const isPaid = appointment.payment;

  // Check if appointment is today and within call window (30 minutes before to 1 hour after)
  const isToday = appointmentDate.toDateString() === currentTime.toDateString();
  const timeDiff = appointmentDateTime.getTime() - currentTime.getTime();
  const isCallAvailable = isToday && timeDiff >= -60 * 60 * 1000 && timeDiff <= 30 * 60 * 1000; // 1 hour after to 30 min before
  const isLive = isToday && Math.abs(timeDiff) <= 15 * 60 * 1000; // Within 15 minutes of appointment time
  
  // Check if video call is ongoing
  const isVideoCallOngoing = appointment.videoCallActive || (isLive && isPaid && !isCompleted && !isCancelled);

  // Calculate patient age
  const getPatientAge = (userData) => {
    if (userData.age) {
      return userData.age;
    }
    return 'N/A';
  };

  // Determine status
  const getStatus = () => {
    if (isCancelled) return { text: "Cancelled", color: "red" };
    if (isCompleted) return { text: "Completed", color: "green" };
    if (isVideoCallOngoing) return { text: "Video Call Active", color: "videoCall" };
    if (isLive && isPaid) return { text: "Live Now", color: "pulse" };
    if (appointmentDate < new Date() && !isCompleted) return { text: "Missed", color: "orange" };
    if (isToday) return { text: "Today", color: "blue" };
    return { text: "Upcoming", color: "blue" };
  };

  const status = getStatus();

  const handleVideoCall = () => {
    setIsJoiningCall(true);
    // Simulate joining call delay
    setTimeout(() => {
      setIsJoiningCall(false);
      // Navigate to video call page
      navigate(`/doctor/video-call/${appointment._id}`);
    }, 2000);
  };

  const handleJoinActiveCall = () => {
    // Directly navigate to active video call without delay
    navigate(`/doctor/video-call/${appointment._id}`);
  };

  const handlePhoneCall = () => {
    // Handle phone call functionality
    console.log("Starting phone call for appointment:", appointment._id);
    window.open(`tel:${appointment.userData.contact || '+1234567890'}`);
  };

  const handleEndVideoCall = () => {
    // Handle ending video call
    console.log("Ending video call for appointment:", appointment._id);
    // You would typically update the appointment status here
    // updateAppointment(appointment._id, { videoCallActive: false });
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await cancelAppointment(appointment._id);
      getAppointments(); // Refresh appointments
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      await completeAppointment(appointment._id);
      getAppointments(); // Refresh appointments
    } catch (error) {
      console.error('Error completing appointment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReschedule = () => {
    // Navigate to reschedule page or open modal
    console.log("Rescheduling appointment:", appointment._id);
    // navigate(`/doctor/reschedule/${appointment._id}`);
  };

  return (
    <div
      className={`p-4 rounded-xl border ${
        darkMode
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-100 hover:border-gray-200"
      } transition-all shadow-sm hover:shadow ${
        status.color === 'pulse' ? 'ring-2 ring-green-500 ring-opacity-50' : ''
      } ${
        status.color === 'videoCall' ? 'ring-2 ring-red-500 ring-opacity-75 shadow-lg' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 sm:gap-0">
        {/* Patient Details */}
        <div className="flex items-start gap-3">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
              isCompleted
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
            {appointment.userData?.profileImage || appointment.userData?.image ? (
              <img
                src={appointment.userData.profileImage || appointment.userData.image}
                alt="Patient"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`${appointment.userData?.profileImage || appointment.userData?.image ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
              {isCompleted ? <FileText size={18} /> : (status.color === 'pulse' || status.color === 'videoCall') ? <Video size={18} /> : <User size={18} />}
            </div>
          </div>
          <div>
            <h3 className={`font-medium text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
              {appointment.userData?.name || 'Unknown Patient'}
            </h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Age: {getPatientAge(appointment.userData)} • {appointment.userData?.gender || 'N/A'}
            </p>
            <div className={`flex items-center mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <Phone className={`h-3 w-3 mr-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              {appointment.userData?.contact || 'No contact'}
            </div>
            <div className={`flex items-center mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <Calendar className={`h-3 w-3 mr-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              Patient ID: {appointment.userId?.slice(-8) || 'N/A'}
            </div>
          </div>
        </div>

        {/* Appointment Time & Status */}
        <div className="text-left sm:text-right">
          <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {appointmentDate.toLocaleDateString()} at {appointment.slotTime}
          </p>
          <div className="flex flex-col gap-1 mt-2">
            <Badge
              className={`font-normal text-xs ${
                status.color === 'green'
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
                className={`font-normal text-xs ${
                  darkMode
                    ? "bg-[#e6f7ef] bg-opacity-20 text-[#e6f7ef]"
                    : "bg-[#e6f7ef] text-[#00bf60] hover:bg-[#e6f7ef]"
                }`}
              >
                <CheckCircle size={10} className="mr-1" />
                Paid
              </Badge>
            )}
            {!isPaid && !isCancelled && !isCompleted && (
              <Badge
                className={`font-normal text-xs ${
                  darkMode
                    ? "bg-orange-900 text-orange-300"
                    : "bg-orange-50 text-orange-700"
                }`}
              >
                Payment Pending
              </Badge>
            )}
            {isCallAvailable && isPaid && !isVideoCallOngoing && (
              <Badge
                className={`font-normal text-xs ${
                  darkMode
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
      <div className="mt-3">
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Consultation Fee: ${appointment.docData?.fees || appointment.amount}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4">
        {isCompleted ? (
          <Button
            variant="outline"
            size="sm"
            className={`text-xs h-8 px-3 ${
              darkMode
                ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                : "bg-[#00bf60] text-white hover:bg-[#00a050]"
            }`}
          >
            View Medical Records
            <ExternalLink size={12} className="ml-2" />
          </Button>
        ) : isVideoCallOngoing ? (
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleJoinActiveCall}
              size="sm"
              className="text-xs h-8 px-3 bg-red-500 hover:bg-red-600 text-white animate-pulse flex items-center gap-1"
            >
              <Video size={12} />
              Join Active Call
            </Button>
            <Button
              onClick={handleEndVideoCall}
              variant="outline"
              size="sm"
              className={`text-xs h-8 px-3 ${
                darkMode
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
              className={`text-xs h-8 px-3 ${
                status.color === 'pulse'
                  ? "bg-green-500 hover:bg-green-600 text-white animate-pulse"
                  : "bg-[#00bf60] hover:bg-[#00a050] text-white"
              } flex items-center gap-1`}
            >
              {isJoiningCall ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Starting...
                </>
              ) : (
                <>
                  <Video size={12} />
                  {status.color === 'pulse' ? 'Start Consultation' : 'Start Video Call'}
                </>
              )}
            </Button>
            <Button
              onClick={handlePhoneCall}
              variant="outline"
              size="sm"
              className={`text-xs h-8 px-3 ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef]"
              } flex items-center gap-1`}
            >
              <Phone size={12} />
              Call Patient
            </Button>
            {!isLive && !isVideoCallOngoing && (
              <>
                <Button
                  onClick={handleReschedule}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 px-3 border-[#e6f7ef] hover:border-[#00bf60] hover:bg-[#e6f7ef] text-[#00bf60]"
                >
                  Reschedule
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  variant="outline"
                  size="sm"
                  className={`text-xs h-8 px-3 ${
                    darkMode
                      ? "border-red-700 text-red-400 hover:bg-red-900"
                      : "border-red-200 text-red-600 hover:bg-red-50"
                  }`}
                >
                  {isProcessing ? 'Cancelling...' : 'Cancel'}
                </Button>
              </>
            )}
          </div>
        ) : !isCancelled && !isCompleted ? (
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleComplete}
              disabled={isProcessing}
              size="sm"
              className="text-xs h-8 px-3 bg-green-500 hover:bg-green-600 text-white"
            >
              {isProcessing ? 'Completing...' : 'Mark Complete'}
            </Button>
            <Button
              onClick={handleReschedule}
              variant="outline"
              size="sm"
              className="text-xs h-8 px-3 border-[#e6f7ef] hover:border-[#00bf60] hover:bg-[#e6f7ef] text-[#00bf60]"
            >
              Reschedule
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isProcessing}
              variant="outline"
              size="sm"
              className={`text-xs h-8 px-3 ${
                darkMode
                  ? "border-red-700 text-red-400 hover:bg-red-900"
                  : "border-red-200 text-red-600 hover:bg-red-50"
              }`}
            >
              {isProcessing ? 'Cancelling...' : 'Cancel'}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AppointmentCard;