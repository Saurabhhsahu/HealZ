import React, { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
// It's recommended to use an icon library like 'react-icons' for better icons
// For example: import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare } from 'react-icons/fa';

function Controls() {
  const { leave, toggleMic, toggleWebcam, startRecording, stopRecording } = useMeeting();
  const [isRecording, setIsRecording] = useState(false);

  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsRecording(!isRecording);
  };
  
  // These would be dynamic based on the SDK's state
  const micOn = true; // Replace with actual state
  const webcamOn = true; // Replace with actual state


  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        onClick={toggleMic}
        className={`p-3 rounded-full transition-all duration-300 ${micOn ? "bg-gray-600 hover:bg-gray-700" : "bg-red-500 hover:bg-red-600"}`}
      >
        {/* Replace with an actual icon */}
        <span className="text-white">{micOn ? "Mute" : "Unmute"}</span>
      </button>

      <button
        onClick={toggleWebcam}
        className={`p-3 rounded-full transition-all duration-300 ${webcamOn ? "bg-gray-600 hover:bg-gray-700" : "bg-red-500 hover:bg-red-600"}`}
      >
        {/* Replace with an actual icon */}
        <span className="text-white">{webcamOn ? "Cam Off" : "Cam On"}</span>
      </button>
      
      <button
        onClick={handleRecording}
        className={`p-3 rounded-full transition-all duration-300 ${isRecording ? "bg-red-500" : "bg-gray-600"}`}
      >
         <span className="text-white">{isRecording ? "Stop Rec" : "Start Rec"}</span>
      </button>

      <button
        onClick={leave}
        className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
      >
        Leave
      </button>
    </div>
  );
}

export default Controls;