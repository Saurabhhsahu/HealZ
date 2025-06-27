import React, { useEffect, useMemo, useRef } from "react"
import { useParticipant } from "@videosdk.live/react-sdk"
import ReactPlayer from "react-player"

function ParticipantView({ participantId }) {
  const micRef = useRef(null)
  const { 
    webcamStream, 
    micStream, 
    webcamOn, 
    micOn, 
    isLocal, 
    displayName 
  } = useParticipant(participantId)

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream()
      mediaStream.addTrack(webcamStream.track)
      return mediaStream
    }
    return null
  }, [webcamStream, webcamOn])

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream()
        mediaStream.addTrack(micStream.track)
        micRef.current.srcObject = mediaStream
        micRef.current
          .play()
          .catch((error) =>
            console.error("Audio play failed:", error)
          )
      } else {
        micRef.current.srcObject = null
      }
    }
  }, [micStream, micOn])

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <div className="relative aspect-video bg-gray-800">
        {webcamOn && videoStream ? (
          <ReactPlayer
            playsinline
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={videoStream}
            width="100%"
            height="100%"
            onError={(err) => {
              console.error("Video player error:", err)
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">{displayName || "Guest"}</p>
            </div>
          </div>
        )}

        {/* Audio element for participant audio */}
        <audio ref={micRef} autoPlay playsInline muted={isLocal} />

        {/* Status indicators */}
        <div className="absolute bottom-2 left-2 flex space-x-2">
          {/* Mic status */}
          <div className={`p-1 rounded-full ${micOn ? "bg-green-600" : "bg-red-600"}`}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              {micOn ? (
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              )}
            </svg>
          </div>

          {/* Camera status */}
          <div className={`p-1 rounded-full ${webcamOn ? "bg-green-600" : "bg-red-600"}`}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              {webcamOn ? (
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              ) : (
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l1.414 1.414A2 2 0 002 7v4a2 2 0 002 2h1.586l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414A2 2 0 018 10V6.414L16.586 15A1 1 0 0018 13.586L4.414 0A1 1 0 003.707 2.293zM10 5.586L16.414 12A2 2 0 0018 10V6a2 2 0 00-2.586-1.914L14 5.414A1 1 0 0014.707 4l-4.293 4.293A1 1 0 0010 5.586z" clipRule="evenodd" />
              )}
            </svg>
          </div>
        </div>

        {/* Local participant indicator */}
        {isLocal && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            You
          </div>
        )}
      </div>

      {/* Participant info */}
      <div className="p-3 bg-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-white font-medium text-sm truncate">
            {displayName || "Guest"} {isLocal && "(You)"}
          </p>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <span>Webcam: {webcamOn ? "ON" : "OFF"}</span>
            <span>•</span>
            <span>Mic: {micOn ? "ON" : "OFF"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantView