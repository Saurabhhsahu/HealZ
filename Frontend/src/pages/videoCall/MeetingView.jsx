import React, { useState } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import Controls from "./Controls"
import ParticipantView from "./ParticipantView"
import { MEETING_STATES } from "../../utils/Constant.js"

function MeetingView({ meetingId, onMeetingLeave }) {
  const [joined, setJoined] = useState(MEETING_STATES.IDLE)

  const { join, participants, localParticipant } = useMeeting({
    onMeetingJoined: () => {
      console.log("Meeting joined successfully")
      setJoined(MEETING_STATES.JOINED)
    },
    onMeetingLeft: () => {
      console.log("Meeting left")
      setJoined(MEETING_STATES.LEFT)
      onMeetingLeave()
    },
    onError: (error) => {
      console.error("Meeting error:", error)
      alert("An error occurred in the meeting. Please try again.")
    }
  })

  const joinMeeting = () => {
    setJoined(MEETING_STATES.JOINING)
    join()
  }

  const participantIds = [...participants.keys()]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Meeting Room
        </h3>
        <div className="bg-gray-100 rounded-lg px-4 py-2 inline-block">
          <span className="text-sm text-gray-600">Meeting ID: </span>
          <span className="font-mono font-medium text-gray-800">{meetingId}</span>
          <button
            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => navigator.clipboard.writeText(meetingId)}
          >
            Copy
          </button>
        </div>
      </div>

      {joined === MEETING_STATES.JOINED ? (
        <div className="space-y-6">
          <Controls />
          
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Participants ({participantIds.length})
            </h4>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {participantIds.map((participantId) => (
                <ParticipantView
                  participantId={participantId}
                  key={participantId}
                />
              ))}
            </div>
          </div>
        </div>
      ) : joined === MEETING_STATES.JOINING ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Joining the meeting...</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">Ready to join the meeting?</p>
          <button
            onClick={joinMeeting}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Join Meeting
          </button>
        </div>
      )}
    </div>
  )
}

export default MeetingView