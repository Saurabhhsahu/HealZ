import React, { useState } from "react";

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!meetingId.trim()) {
      alert("Please enter a valid meeting ID.");
      return;
    }
    setIsJoining(true);
    await getMeetingAndToken(meetingId.trim());
    setIsJoining(false);
  };

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    await getMeetingAndToken(null);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Video Conference</h1>
          <p className="text-gray-600 text-lg">Connect with your team instantly.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="meetingId" className="sr-only">
              Meeting ID
            </label>
            <input
              id="meetingId"
              type="text"
              placeholder="Enter Meeting ID to Join"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-300"
              disabled={isCreating || isJoining}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleJoin}
              disabled={isCreating || isJoining || !meetingId.trim()}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-wait transition-all duration-300 transform hover:scale-105"
            >
              {isJoining ? "Joining..." : "Join Meeting"}
            </button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              onClick={handleCreateMeeting}
              disabled={isCreating || isJoining}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-wait transition-all duration-300 transform hover:scale-105"
            >
              {isCreating ? "Creating..." : "Create New Meeting"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinScreen;