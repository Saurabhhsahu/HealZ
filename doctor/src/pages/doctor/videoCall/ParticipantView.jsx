import React, { useEffect, useMemo, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";

function ParticipantView({ participantId }) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null;
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current && micOn && micStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      micRef.current.srcObject = mediaStream;
      micRef.current.play().catch((error) => console.error("audio-play-error", error));
    } else if (micRef.current) {
      micRef.current.srcObject = null;
    }
  }, [micStream, micOn]);

  return (
    <div className="relative flex flex-col justify-between rounded-2xl overflow-hidden bg-gray-800 shadow-lg aspect-video">
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      
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
          style={{ position: 'absolute', top: 0, left: 0 }}
          onError={(err) => console.log(err, "participant video error")}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl font-bold">
            {displayName?.charAt(0).toUpperCase() || 'G'}
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 flex space-x-2">
        <div className={`p-2 rounded-full ${micOn ? 'bg-green-500' : 'bg-red-500'}`}>
           {/* Mic Icon */}
        </div>
        <div className={`p-2 rounded-full ${webcamOn ? 'bg-green-500' : 'bg-red-500'}`}>
          {/* Webcam Icon */}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-white font-semibold truncate">
          {displayName} {isLocal && "(You)"}
        </p>
      </div>
    </div>
  );
}

export default ParticipantView;