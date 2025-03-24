import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";

const socket = io("http://localhost:5000"); // Change this to your backend URL

const VideoCall = ({ onClose }) => {
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing media devices:", err));

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCallerSignal(data.signal);
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const callTeacher = () => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callTeacher", { signalData: data });
    });

    peer.on("stream", (teacherStream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = teacherStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      peer.signal(signal);
      setCallAccepted(true);
    });

    setPeer(peer);
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("acceptCall", { signal: data });
    });

    peer.on("stream", (teacherStream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = teacherStream;
      }
    });

    peer.signal(callerSignal);
    setPeer(peer);
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !muted;
      setMuted(!muted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const endCall = () => {
    if (peer) peer.destroy();
    setPeer(null);
    setCallAccepted(false);
    setReceivingCall(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white">
      <h2 className="text-3xl font-semibold mb-4">Video Call 📹</h2>

      <div className="flex gap-6">
        <video ref={userVideo} autoPlay playsInline className="w-64 h-48 bg-gray-800 rounded-md border" />
        {callAccepted && <video ref={partnerVideo} autoPlay playsInline className="w-64 h-48 bg-gray-800 rounded-md border" />}
      </div>

      <div className="flex mt-6 space-x-4">
        {!callAccepted ? (
          <button
            onClick={callTeacher}
            className="bg-green-500 px-6 py-2 rounded-lg shadow-lg text-white font-semibold hover:bg-green-600"
          >
            Call Teacher 📞
          </button>
        ) : null}

        {receivingCall && !callAccepted ? (
          <button
            onClick={acceptCall}
            className="bg-blue-500 px-6 py-2 rounded-lg shadow-lg text-white font-semibold hover:bg-blue-600"
          >
            Accept Call 📲
          </button>
        ) : null}

        {callAccepted && (
          <>
            <button
              onClick={toggleMute}
              className={`px-6 py-2 rounded-lg shadow-lg font-semibold ${muted ? "bg-gray-500" : "bg-yellow-500"} hover:bg-yellow-600`}
            >
              {muted ? "Unmute 🔊" : "Mute 🔇"}
            </button>

            <button
              onClick={toggleVideo}
              className={`px-6 py-2 rounded-lg shadow-lg font-semibold ${videoEnabled ? "bg-gray-500" : "bg-purple-500"} hover:bg-purple-600`}
            >
              {videoEnabled ? "Hide Video 📷" : "Show Video 🎥"}
            </button>

            <button
              onClick={endCall}
              className="bg-red-500 px-6 py-2 rounded-lg shadow-lg text-white font-semibold hover:bg-red-600"
            >
              End Call ❌
            </button>
          </>
        )}
      </div>

      <button onClick={onClose} className="absolute top-4 right-4 text-xl">
        ❌
      </button>
    </div>
  );
};

export default VideoCall;
