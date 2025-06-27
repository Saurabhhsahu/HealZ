import React, { useState } from "react"
import { MeetingProvider } from "@videosdk.live/react-sdk"
import JoinScreen from "./JoinScreen"
import MeetingView from "./MeetingView"
import { authToken,createMeeting } from "@/Api"
import { useParams } from "react-router-dom"
import { useUser } from "@/context/userContext"

function VideoCall() {
  const {appointments } = useUser()

  const appointment = appointments.find((appointment) => appointment._id === useParams('appointmentId').appointmentId)

  const [meetingId, setMeetingId] = useState(appointment?.meetingId || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  console.log("appointment", appointment);

  const getMeetingAndToken = async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      const meetingId = id == null ? await createMeeting({ token: authToken }) : id
      setMeetingId(meetingId)
    } catch (err) {
      console.error("Error getting meeting:", err)
      setError("Failed to create/join meeting. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const onMeetingLeave = () => {
    setMeetingId(null)
    setError(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up meeting...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
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
  ) : 
  (
    <div>
      Yours meeting is ended , thank you for using HealZ
    </div>
  )
}

export default VideoCall