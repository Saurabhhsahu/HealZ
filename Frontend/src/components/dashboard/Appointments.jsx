import React, { useState } from "react";
import { useUser } from "../../context/userContext";
import { Calendar, MapPin, Video, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Payment from "./Payment"; // Assuming Payment component exists

const Appointments = ({ darkMode }) => {
  const { appointments } = useUser();
  const navigate = useNavigate();

  // Use an empty array as a fallback if appointments are not yet loaded
  const appointmentData = appointments || [];

  // Sort appointments to show active video calls first, then by date
  const sortedAppointments = [...appointmentData].sort((a, b) => {
    const aIsVideoCall = checkIfVideoCallOngoing(a);
    const bIsVideoCall = checkIfVideoCallOngoing(b);
    if (aIsVideoCall && !bIsVideoCall) return -1;
    if (!aIsVideoCall && bIsVideoCall) return 1;
    const aDate = parseAppointmentDateTime(a.slotDate, a.slotTime);
    const bDate = parseAppointmentDateTime(b.slotDate, b.slotTime);
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <Card className={`h-full flex flex-col overflow-hidden ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      <CardHeader className={`px-3 sm:px-4 ${darkMode ? "border-gray-800" : "border-gray-100"} border-b`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
          <div>
            <CardTitle className={`text-lg sm:text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Appointments
            </CardTitle>
            <CardDescription className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Your medical appointments and consultations
            </CardDescription>
          </div>
          <Button onClick={() => navigate('/doctors')} className="bg-[#00bf60] cursor-pointer hover:bg-[#00a050] text-white font-medium transition-colors border-0 text-sm h-9 px-3 py-2 self-start sm:self-auto">
            Schedule Now
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
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
              icon={<Calendar className={`h-10 w-10 sm:h-12 sm:w-12 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />}
              message="No appointments found"
              darkMode={darkMode}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to parse date and time
const parseAppointmentDateTime = (slotDate, slotTime) => {
  const [day, month, year] = slotDate.split('_');
  const dateStr = `${month}/${day}/${year} ${slotTime}`;
  return new Date(dateStr);
};

// Helper function to check if a call is ongoing
const checkIfVideoCallOngoing = (appointment) => {
  const appointmentDateTime = parseAppointmentDateTime(appointment.slotDate, appointment.slotTime);
  const currentTime = new Date();
  const isCompleted = appointment.isCompleted;
  const isCancelled = appointment.cancelled;
  const isPaid = appointment.payment;
  const isToday = appointmentDateTime.toDateString() === currentTime.toDateString();
  const timeDiff = appointmentDateTime.getTime() - currentTime.getTime();
  const isLive = isToday && Math.abs(timeDiff) <= 15 * 60 * 1000;
  return appointment.videoCallActive || (isLive && isPaid && !isCompleted && !isCancelled);
};


const AppointmentCard = ({ appointment, darkMode }) => {
  const navigate = useNavigate();
  const [isJoiningCall, setIsJoiningCall] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const currentTime = new Date();
  const appointmentDateTime = parseAppointmentDateTime(appointment.slotDate, appointment.slotTime);
  const isCompleted = appointment.isCompleted;
  const isCancelled = appointment.cancelled;
  const isPaid = appointment.payment;
  const isToday = appointmentDateTime.toDateString() === currentTime.toDateString();
  const timeDiff = appointmentDateTime.getTime() - currentTime.getTime();
  
  // A call is available 30 mins before and up to 1 hour after the scheduled time
  const isCallAvailable = isToday && timeDiff <= 30 * 60 * 1000 && timeDiff >= -60 * 60 * 1000;
  const isLive = isToday && Math.abs(timeDiff) <= 15 * 60 * 1000;
  const isFuture = appointmentDateTime > currentTime;
  const isVideoCallOngoing = checkIfVideoCallOngoing(appointment);

  const getStatus = () => {
    if (isCancelled) return { text: "Cancelled", color: "red" };
    if (isCompleted) return { text: "Completed", color: "green" };
    if (isVideoCallOngoing) return { text: "Video Call Active", color: "videoCall" };
    if (isLive && isPaid) return { text: "Live Now", color: "pulse" };
    if (!isFuture && !isCompleted) return { text: "Missed", color: "orange" };
    if (isToday) return { text: "Today", color: "blue" };
    return { text: "Upcoming", color: "blue" };
  };

  const status = getStatus();

  const handleJoinCall = () => {
    setIsJoiningCall(true);
    navigate(`/video-call/${appointment._id}`);
  };

  const handlePaymentSuccess = (details) => {
    console.log("Payment Successful:", details);
    alert(`Payment successful! Transaction ID: ${details.id}`);
    // Here you would typically update the appointment status in your backend
    // and refresh the user's appointment data.
    setShowPayment(false);
    // For demonstration, we can force a reload to show the new state.
    window.location.reload(); 
  };

  const handlePaymentError = (error) => {
    console.error("Payment Error:", error);
    alert("An error occurred during payment. Please try again.");
    setShowPayment(false);
  };

  const handlePaymentCancel = (data) => {
    console.log("Payment Cancelled:", data);
    setShowPayment(false);
  };

  return (
    <>
      {showPayment && (
        <Payment
          amount={appointment.amount}
          appointmentId={appointment._id}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={handlePaymentCancel}
        />
      )}
      <div className={`p-3 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} transition-all shadow-sm`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
          <div className="flex items-start gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-gray-100 text-gray-500" : "bg-[#e6f7ef] text-[#00bf60]"}`}>
              {isCompleted ? <FileText size={22} /> : <User size={22} />}
            </div>
            <div>
              <h3 className={`font-semibold text-base ${darkMode ? "text-white" : "text-gray-900"}`}>{appointment.docData.name}</h3>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{appointment.docData.speciality}</p>
              <div className={`flex items-center mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <MapPin className="h-4 w-4 mr-1.5" /> {appointment.docData.address.line1}, {appointment.docData.address.line2}
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right ml-16 sm:ml-0 mt-2 sm:mt-0">
            <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{appointmentDateTime.toLocaleDateString()} at {appointment.slotTime}</p>
            <div className="flex flex-col items-start sm:items-end gap-1 mt-2">
              <Badge className={`font-medium text-xs ${status.color === 'green' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>{status.text}</Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-4 ml-0 sm:ml-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Fee: <span className="text-green-600">${appointment.amount}</span>
                {isPaid && <Badge variant="outline" className="ml-2 border-green-300 bg-green-50 text-green-700">Paid</Badge>}
            </p>
            <div className="flex gap-2 flex-wrap">
                {(() => {
                    // Case 1: Paid and within the call window
                    if (isPaid && !isCompleted && !isCancelled && isCallAvailable) {
                        return (
                            <Button
                                onClick={handleJoinCall}
                                disabled={isJoiningCall}
                                size="sm"
                                className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-all"
                            >
                                {isJoiningCall ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Joining...</span>
                                    </>
                                ) : (
                                    <>
                                        <Video size={16} />
                                        <span>Join Video Call</span>
                                    </>
                                )}
                            </Button>
                        );
                    }
                    // Case 2: Upcoming but not paid
                    if (isFuture && !isPaid && !isCancelled) {
                        return (
                            <>
                                <Button onClick={() => setShowPayment(true)} size="sm" className="h-9 px-4 bg-[#00bf60] hover:bg-[#00a050] text-white">
                                    Pay Now
                                </Button>
                                <Button variant="outline" size="sm" className="h-9 px-4">Reschedule</Button>
                                <Button variant="destructive" size="sm" className="h-9 px-4">Cancel</Button>
                            </>
                        );
                    }
                    // Case 3: Completed
                    if (isCompleted) {
                        return <Button variant="outline" size="sm" className="h-9 px-4">View Prescription</Button>
                    }
                    // Default: No actions available (e.g., missed, cancelled)
                    return null;
                })()}
            </div>
        </div>
      </div>
    </>
  );
};

const EmptyState = ({ icon, message, darkMode }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
    <div className="mb-3">{icon}</div>
    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{message}</p>
    <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Your scheduled appointments will appear here.</p>
  </div>
);

export default Appointments;
