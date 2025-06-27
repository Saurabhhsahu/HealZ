import React, { useState } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"

function Controls() {
  const { leave, toggleMic, toggleWebcam, startRecording, stopRecording } = useMeeting()
  const [isRecording, setIsRecording] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [webcamOn, setWebcamOn] = useState(true)

  const handleLeave = () => {
    if (window.confirm("Are you sure you want to leave the meeting?")) {
      leave()
    }
  }

  const handleToggleMic = () => {
    toggleMic()
    setMicOn(!micOn)
  }

  const handleToggleWebcam = () => {
    toggleWebcam()
    setWebcamOn(!webcamOn)
  }

  const handleRecording = () => {
    if (isRecording) {
      stopRecording()
      setIsRecording(false)
    } else {
      startRecording()
      setIsRecording(true)
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleToggleMic}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            micOn
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
          <span>{micOn ? "Mute" : "Unmute"}</span>
        </button>

        <button
          onClick={handleToggleWebcam}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            webcamOn
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <span>{webcamOn ? "Stop Video" : "Start Video"}</span>
        </button>

        <button
          onClick={handleRecording}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isRecording
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-white animate-pulse" : "bg-red-500"}`} />
          <span>{isRecording ? "Stop Recording" : "Start Recording"}</span>
        </button>

        <button
          onClick={handleLeave}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span>Leave</span>
        </button>
      </div>
    </div>
  )
}

export default Controls