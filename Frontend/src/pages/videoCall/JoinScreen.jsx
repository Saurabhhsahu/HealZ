import React, { useState } from "react"

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    if (!meetingId.trim()) {
      alert("Please enter a valid meeting ID")
      return
    }
    setLoading(true)
    try {
      await getMeetingAndToken(meetingId.trim())
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMeeting = async () => {
    setLoading(true)
    try {
      await getMeetingAndToken(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Meeting</h2>
        <p className="text-gray-600">Enter meeting ID to join or create a new meeting</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="meetingId" className="block text-sm font-medium text-gray-700 mb-2">
            Meeting ID
          </label>
          <input
            id="meetingId"
            type="text"
            placeholder="Enter Meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleJoin}
            disabled={loading || !meetingId.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Joining..." : "Join Meeting"}
          </button>

          <div className="text-center text-gray-500 text-sm">or</div>

          <button
            onClick={handleCreateMeeting}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating..." : "Create New Meeting"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default JoinScreen