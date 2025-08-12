import React, { useState, useEffect } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import JoinScreen from "./JoinScreen";
import MeetingView from "./MeetingView";
import { authToken, createMeeting } from "@/Api";
import { useParams } from "react-router-dom";
import { DoctorContext } from '../../../Context/DoctorContext.jsx';

function VideoCall() {
  const { appointments } = useContext(DoctorContext);
  const { appointmentId } = useParams();

  const [meetingId, setMeetingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const foundAppointment = appointments.find(
      (appointment) => appointment._id === appointmentId
    );
    if (foundAppointment?.meetingId) {
      setMeetingId(foundAppointment.meetingId);
    }
    setLoading(false);
  }, [appointments, appointmentId]);

  const getMeetingAndToken = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const newMeetingId = id == null ? await createMeeting({ token: authToken }) : id;
      setMeetingId(newMeetingId);
    } catch (err) {
      console.error("Error getting meeting:", err);
      setError("Failed to create or join the meeting. Please check the Meeting ID or your connection.");
    } finally {
      setLoading(false);
    }
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
        <p className="text-gray-700 text-lg font-medium">Preparing your meeting...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 p-4">
        <div className="bg-white border-2 border-red-200 rounded-xl p-8 max-w-lg mx-auto text-center shadow-lg">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Connection Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "C.V. Raman",
      }}
      token={authToken}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default VideoCall;