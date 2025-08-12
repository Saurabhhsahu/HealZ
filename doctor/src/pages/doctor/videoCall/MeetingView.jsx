import React, { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import Controls from "./Controls";
import ParticipantView from "./ParticipantView";
import { MEETING_STATES } from "../../utils/Constant.js";

function MeetingView({ meetingId, onMeetingLeave }) {
  const [joined, setJoined] = useState(MEETING_STATES.IDLE);

  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined(MEETING_STATES.JOINED),
    onMeetingLeft: () => onMeetingLeave(),
    onError: (error) => alert(error.message),
  });

  const joinMeeting = () => {
    setJoined(MEETING_STATES.JOINING);
    join();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <h2 className="text-2xl font-bold">Video Meeting</h2>
        <div className="text-sm">
          <span className="font-semibold">Meeting ID:</span>
          <span className="ml-2 font-mono bg-gray-700 px-2 py-1 rounded">{meetingId}</span>
          <button
            onClick={() => navigator.clipboard.writeText(meetingId)}
            className="ml-4 text-blue-400 hover:text-blue-300 transition"
          >
            Copy
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
        {joined === MEETING_STATES.JOINED ? (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...participants.keys()].map((participantId) => (
              <ParticipantView key={participantId} participantId={participantId} />
            ))}
          </div>
        ) : joined === MEETING_STATES.JOINING ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p className="text-xl">Joining the meeting...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6">You're ready to join</h3>
              <button
                onClick={joinMeeting}
                className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                Join Now
              </button>
            </div>
          </div>
        )}
      </main>

      {joined === MEETING_STATES.JOINED && (
        <footer className="bg-gray-800 p-4">
          <Controls />
        </footer>
      )}
    </div>
  );
}

export default MeetingView;