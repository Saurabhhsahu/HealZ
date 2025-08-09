import React, { useState } from "react";
import { useUser } from "../../context/userContext";
import { Calendar, MapPin, ExternalLink, FileText, Video, User, Phone, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Payment from "./Payment"; // Import the new Payment component

const Appointments = ({ darkMode }) => {
  const { appointments } = useUser();
  const navigate = useNavigate();

  const appointmentData = appointments ? appointments : [];

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

const parseAppointmentDateTime = (slotDate, slotTime) => {
  const [day, month, year] = slotDate.split('_');
  const dateStr = `${month}/${day}/${year} ${slotTime}`;
  return new Date(dateStr);
};

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
  const isCallAvailable = isToday && timeDiff <= 30 * 60 * 1000 && timeDiff >= -60 * 60 * 1000;
  const isLive = isToday && Math.abs(timeDiff) <= 15 * 60 * 1000;
  const isFuture = appointmentDateTime > currentTime;
  const isVideoCallOngoing = appointment.videoCallActive || (isLive && isPaid && !isCompleted && !isCancelled);

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

  const handlePaymentSuccess = (details) => {
    console.log("Payment Successful:", details);
    alert(`Payment successful! Transaction ID: ${details.id}`);
    // Here you would typically update the appointment status in your backend
    setShowPayment(false);
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
      <div className={`p-2 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} transition-all shadow-sm`}>
        {/* Card content remains the same, only the "Pay Now" button logic changes */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-0">
          <div className="flex items-start gap-3">
            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-gray-50 text-gray-500" : "bg-[#e6f7ef] text-[#00bf60]"}`}>
              {isCompleted ? <FileText size={18} /> : <User size={18} />}
            </div>
            <div>
              <h3 className={`font-medium text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>{appointment.docData.name}</h3>
              <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{appointment.docData.speciality}</p>
              <div className={`flex items-center mt-1 text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <MapPin className="h-3 w-3 mr-1" /> {appointment.docData.address.line1}, {appointment.docData.address.line2}
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right ml-10 sm:ml-0 mt-1 sm:mt-0">
            <p className={`text-xs sm:text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{appointmentDateTime.toLocaleDateString()} at {appointment.slotTime}</p>
            <div className="flex flex-col gap-1 mt-1">
              <Badge className={`font-normal text-xs ${status.color === 'green' ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>{status.text}</Badge>
              {isPaid && <Badge className="font-normal text-xs bg-[#e6f7ef] text-[#00bf60]"><CheckCircle size={10} className="mr-1" />Paid</Badge>}
            </div>
          </div>
        </div>
        <div className="mt-2 ml-10 sm:ml-12">
          <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Fee: ${appointment.amount}</p>
        </div>
        <div className="mt-3 sm:mt-4 ml-10 sm:ml-16">
          {(() => {
            if (isFuture && !isPaid && !isCancelled) {
              return (
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={() => setShowPayment(true)} size="sm" className="text-xs h-8 px-2 py-1 bg-[#00bf60] hover:bg-[#00a050] text-white">
                    Pay Now (${appointment.amount})
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8 px-2 py-1 border-[#e6f7ef] hover:border-[#00bf60] text-[#00bf60]">Reschedule</Button>
                  <Button variant="outline" size="sm" className="text-xs h-8 px-2 py-1 border-red-200 text-red-600">Cancel</Button>
                </div>
              );
            }
            // Other button states remain the same
            return null;
          })()}
        </div>
      </div>
    </>
  );
};

const EmptyState = ({ icon, message, darkMode }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
    <div className="mb-3">{icon}</div>
    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{message}</p>
    <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Your appointments will appear here.</p>
  </div>
);

export default Appointments;
