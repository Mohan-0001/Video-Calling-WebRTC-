// import React from 'react'
// import { useSocket } from '../context/SocketProvider'
// import { useEffect } from 'react'
// import { useCallback } from 'react'
// import { useState } from 'react'
// import ReactPlayer from 'react-player'
// import peer from '../service/peer'


// const RoomPage = () => {

//     const socket = useSocket()
//     const [remoteSocketId, setRemoteSocketId] = useState(null)
//     const [myStream, setMyStream] = useState(null)
//     const [remoteStream, setRemoteStream] = useState()

//     const handleUserJoined = useCallback(({ email, id }) => {
//         console.log(`Email ${email} Joined Room`)
//         setRemoteSocketId(id)
//     }, [socket])

//     const handleCallUser = useCallback(async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })

//         const offer = await peer.getOffer();
//         socket.emit("user:call" , {to: remoteSocketId, offer})
//         setMyStream(stream)
    
//     }, [remoteSocketId, socket])


//     const handleIncommingCall = useCallback(async({from, offer}) => {
//         setRemoteSocketId(from)
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
//         setMyStream(stream)

//         console.log('Incomming Call', from, offer)
//         const ans = await peer.getAnswer(offer);
//         socket.emit('call:accepted', {to: from, ans})
//     }, [])

//     const sendStreams = useCallback(() => {
//         for (const track of myStream.getTracks()) {
//             peer.peer.addTrack(track, myStream);
//         }
//     },[myStream])

//     const handleCallAccepted = useCallback(({from, ans}) => {
//         peer.setLocalDescription(ans);
//         console.log('Call Accepted');
//         sendStreams();
//     },[sendStreams])

//     const handleNegoNeeded = useCallback(async() => {
//         const offer = await peer.getOffer();
//         socket.emit('peer:nego:needed', { offer, to: remoteSocketId})
//     },[remoteSocketId, socket])

//     const handleNegoNeedIncomming = useCallback(async({from, offer}) => {
//         const ans = await peer.getAnswer(offer);
//         socket.emit('peer:nego:done', {to: from, ans})
//     },[socket])

//     const handleNegoNeedFinal = useCallback(async({ans}) => {
//         await peer.setLocalDescription(ans)
//     },[])


//     useEffect(() => {
//         peer.peer.addEventListener('negotiationneeded', handleNegoNeeded )

//         return () => {
//             peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
//         }
//     },[])

//     useEffect(() => {
//         peer.peer.addEventListener('track', async ev => {
//             const remoteStream = ev.streams
//             console.log('Got Tracks ')
//             setRemoteStream(remoteStream[0]);
//         })
//     },[])

//     useEffect(() => {
//         socket.on('user:joined', handleUserJoined)
//         socket.on('incomming:call', handleIncommingCall)
//         socket.on('call:accepted', handleCallAccepted)
//         socket.on('peer:nego:needed', handleNegoNeedIncomming)
//         socket.on('peer:nego:final', handleNegoNeedFinal)

//         return () => {
//             socket.off('user:joined', handleUserJoined)
//             socket.off('incomming:call', handleIncommingCall)
//             socket.off('call:accepted', handleCallAccepted)
//             socket.off('peer:nego:needed', handleNegoNeedIncomming)
//             socket.off('peer:nego:final', handleNegoNeedFinal)
//         }
//     }, [socket, handleUserJoined, handleIncommingCall, handleNegoNeedIncomming, handleNegoNeedFinal])




// import React, { useEffect, useCallback, useState } from "react";
// import peer from "../service/peer";
// import { useSocket } from "../context/SocketProvider";

// const RoomPage = () => {
//   const socket = useSocket();
//   const [remoteSocketId, setRemoteSocketId] = useState(null);
//   const [myStream, setMyStream] = useState();
//   const [remoteStream, setRemoteStream] = useState();

//   const handleUserJoined = useCallback(({ email, id }) => {
//     console.log(`Email ${email} joined room`);
//     setRemoteSocketId(id);
//   }, []);

//   const handleCallUser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     const offer = await peer.getOffer();
//     socket.emit("user:call", { to: remoteSocketId, offer });
//     setMyStream(stream);
//   }, [remoteSocketId, socket]);

//   const handleIncommingCall = useCallback(
//     async ({ from, offer }) => {
//       setRemoteSocketId(from);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setMyStream(stream);
//       console.log(`Incoming Call`, from, offer);
//       const ans = await peer.getAnswer(offer);
//       socket.emit("call:accepted", { to: from, ans });
//     },
//     [socket]
//   );

//   const sendStreams = useCallback(() => {
//     for (const track of myStream.getTracks()) {
//       peer.peer.addTrack(track, myStream);
//     }
//   }, [myStream]);

//   const handleCallAccepted = useCallback(
//     ({ from, ans }) => {
//       peer.setLocalDescription(ans);
//       console.log("Call Accepted!");
//       sendStreams();
//     },
//     [sendStreams]
//   );

//   const handleNegoNeeded = useCallback(async () => {
//     const offer = await peer.getOffer();
//     socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
//   }, [remoteSocketId, socket]);

//   useEffect(() => {
//     peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
//     return () => {
//       peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
//     };
//   }, [handleNegoNeeded]);

//   const handleNegoNeedIncomming = useCallback(
//     async ({ from, offer }) => {
//       const ans = await peer.getAnswer(offer);
//       socket.emit("peer:nego:done", { to: from, ans });
//     },
//     [socket]
//   );

//   const handleNegoNeedFinal = useCallback(async ({ ans }) => {
//     await peer.setLocalDescription(ans);
//   }, []);

//   useEffect(() => {
//     peer.peer.addEventListener("track", async (ev) => {
//       const remoteStream = ev.streams;
//       console.log("GOT TRACKS!!");
//       setRemoteStream(remoteStream[0]);
//     });
//   }, []);

//   useEffect(() => {
//     socket.on("user:joined", handleUserJoined);
//     socket.on("incomming:call", handleIncommingCall);
//     socket.on("call:accepted", handleCallAccepted);
//     socket.on("peer:nego:needed", handleNegoNeedIncomming);
//     socket.on("peer:nego:final", handleNegoNeedFinal);

//     return () => {
//       socket.off("user:joined", handleUserJoined);
//       socket.off("incomming:call", handleIncommingCall);
//       socket.off("call:accepted", handleCallAccepted);
//       socket.off("peer:nego:needed", handleNegoNeedIncomming);
//       socket.off("peer:nego:final", handleNegoNeedFinal);
//     };
//   }, [
//     socket,
//     handleUserJoined,
//     handleIncommingCall,
//     handleCallAccepted,
//     handleNegoNeedIncomming,
//     handleNegoNeedFinal,
//   ]);


//    return (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//     {/* Header */}
//     <div className="mb-6 text-center">
//       <h1 className="text-3xl font-bold text-gray-800">Room</h1>
//       <p className="text-gray-600">
//         {remoteSocketId ? "✅ Connected to user" : "❌ Not in Room"}
//       </p>
//     </div>

//     {/* Controls */}
//     <div className="flex gap-4 mb-6">
//       {remoteSocketId && (
//         <button
//           onClick={handleCallUser}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//         >
//           📞 Call User
//         </button>
//       )}
//       {myStream && (
//         <button
//           onClick={sendStreams}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
//         >
//           🎥 Share Stream
//         </button>
//       )}
//     </div>

//     {/* Video Section */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
//       {/* My Video */}
//       {myStream && (
//         <div className="relative rounded-lg overflow-hidden shadow-lg border bg-black">
//           <video
//             ref={(video) => {
//               if (video && myStream) {
//                 video.srcObject = myStream;
//               }
//             }}
//             autoPlay
//             muted
//             playsInline
//             className="w-full h-64 object-cover"
//           />
//           <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
//             Me
//           </span>
//         </div>
//       )}

//       {/* Remote Video */}
//       {remoteStream && (
//         <div className="relative rounded-lg overflow-hidden shadow-lg border bg-black">
//           <video
//             ref={(video) => {
//               if (video && remoteStream) {
//                 video.srcObject = remoteStream;
//               }
//             }}
//             autoPlay
//             playsInline
//             className="w-full h-64 object-cover"
//           />
//           <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
//             Remote
//           </span>
//         </div>
//       )}
//     </div>
//   </div>
// );

// }

// export default RoomPage




// import React, { useEffect, useCallback, useState } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import peer from "../service/peer";
// import { useSocket } from "../context/SocketProvider";

// const RoomPage = () => {
//   const { roomId } = useParams(); // 👈 room from URL path
//   const [searchParams] = useSearchParams();
//   const email = searchParams.get("email"); // 👈 email from query

//   const socket = useSocket();
//   const [remoteSocketId, setRemoteSocketId] = useState(null);
//   const [myStream, setMyStream] = useState();
//   const [remoteStream, setRemoteStream] = useState();

//   // 🔹 Auto join room when page loads
//   useEffect(() => {
//     if (email && roomId) {
//       socket.emit("room:join", { email, room: roomId });
//     }
//   }, [socket, email, roomId]);

//   const handleUserJoined = useCallback(({ email, id }) => {
//     console.log(`Email ${email} joined room`);
//     setRemoteSocketId(id);
//   }, []);

//   const handleCallUser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     for (const track of stream.getTracks()) {
//       peer.peer.addTrack(track, stream); // add local tracks immediately
//     }
//     const offer = await peer.getOffer();
//     socket.emit("user:call", { to: remoteSocketId, offer });
//     setMyStream(stream);
//   }, [remoteSocketId, socket]);

//   const handleIncommingCall = useCallback(
//     async ({ from, offer }) => {
//       setRemoteSocketId(from);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setMyStream(stream);
//       for (const track of stream.getTracks()) {
//         peer.peer.addTrack(track, stream);
//       }
//       console.log(`Incoming Call`, from, offer);
//       const ans = await peer.getAnswer(offer);
//       socket.emit("call:accepted", { to: from, ans });
//     },
//     [socket]
//   );

//   const sendStreams = useCallback(() => {
//     if (myStream) {
//       for (const track of myStream.getTracks()) {
//         peer.peer.addTrack(track, myStream);
//       }
//     }
//   }, [myStream]);

//   const handleCallAccepted = useCallback(
//     ({ from, ans }) => {
//       peer.setLocalDescription(ans);
//       console.log("Call Accepted!");
//       sendStreams();
//     },
//     [sendStreams]
//   );

//   const handleNegoNeeded = useCallback(async () => {
//     const offer = await peer.getOffer();
//     socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
//   }, [remoteSocketId, socket]);

//   useEffect(() => {
//     peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
//     return () => {
//       peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
//     };
//   }, [handleNegoNeeded]);

//   const handleNegoNeedIncomming = useCallback(
//     async ({ from, offer }) => {
//       const ans = await peer.getAnswer(offer);
//       socket.emit("peer:nego:done", { to: from, ans });
//     },
//     [socket]
//   );

//   const handleNegoNeedFinal = useCallback(async ({ ans }) => {
//     await peer.setLocalDescription(ans);
//   }, []);

//   useEffect(() => {
//     peer.peer.addEventListener("track", async (ev) => {
//       const remoteStream = ev.streams;
//       console.log("GOT TRACKS!!");
//       setRemoteStream(remoteStream[0]);
//     });
//   }, []);

//   useEffect(() => {
//     socket.on("user:joined", handleUserJoined);
//     socket.on("incomming:call", handleIncommingCall);
//     socket.on("call:accepted", handleCallAccepted);
//     socket.on("peer:nego:needed", handleNegoNeedIncomming);
//     socket.on("peer:nego:final", handleNegoNeedFinal);

//     return () => {
//       socket.off("user:joined", handleUserJoined);
//       socket.off("incomming:call", handleIncommingCall);
//       socket.off("call:accepted", handleCallAccepted);
//       socket.off("peer:nego:needed", handleNegoNeedIncomming);
//       socket.off("peer:nego:final", handleNegoNeedFinal);
//     };
//   }, [
//     socket,
//     handleUserJoined,
//     handleIncommingCall,
//     handleCallAccepted,
//     handleNegoNeedIncomming,
//     handleNegoNeedFinal,
//   ]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       {/* Header */}
//       <div className="mb-6 text-center">
//         <h1 className="text-3xl font-bold text-gray-800">Room</h1>
//         <p className="text-gray-600">
//           {remoteSocketId ? "✅ Connected to user" : "❌ Waiting for user to join"}
//         </p>
//         <p className="text-sm text-gray-500 mt-1">Room ID: {roomId}</p>
//       </div>

//       {/* Controls */}
//       <div className="flex gap-4 mb-6">
//         {remoteSocketId && (
//           <button
//             onClick={handleCallUser}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//           >
//             📞 Call User
//           </button>
//         )}
//         {myStream && (
//           <button
//             onClick={sendStreams}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
//           >
//             🎥 Share Stream
//           </button>
//         )}
//       </div>

//       {/* Video Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
//         {/* My Video */}
//         {myStream && (
//           <div className="relative rounded-lg overflow-hidden shadow-lg border bg-black">
//             <video
//               ref={(video) => {
//                 if (video && myStream) {
//                   video.srcObject = myStream;
//                 }
//               }}
//               autoPlay
//               muted
//               playsInline
//               className="w-full h-64 object-cover"
//             />
//             <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
//               Me
//             </span>
//           </div>
//         )}

//         {/* Remote Video */}
//         {remoteStream && (
//           <div className="relative rounded-lg overflow-hidden shadow-lg border bg-black">
//             <video
//               ref={(video) => {
//                 if (video && remoteStream) {
//                   video.srcObject = remoteStream;
//                 }
//               }}
//               autoPlay
//               playsInline
//               className="w-full h-64 object-cover"
//             />
//             <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
//               Remote
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RoomPage;



// import React, { useEffect, useCallback, useState } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import peer from "../service/peer";
// import { useSocket } from "../context/SocketProvider";

// const RoomPage = () => {
//   const { roomId } = useParams();
//   const [searchParams] = useSearchParams();
//   const email = searchParams.get("email");

//   const socket = useSocket();
//   const [remoteSocketId, setRemoteSocketId] = useState(null);
//   const [myStream, setMyStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);

//   // 🔹 Get local media immediately
//   useEffect(() => {
//     const startStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         setMyStream(stream);

//         // Add tracks early so they are ready when negotiation happens
//         stream.getTracks().forEach((track) => {
//           peer.peer.addTrack(track, stream);
//         });
//       } catch (err) {
//         console.error("Error accessing media devices:", err);
//       }
//     };

//     startStream();
//   }, []);

//   // 🔹 Auto join room when loaded
//   useEffect(() => {
//     if (email && roomId) {
//       socket.emit("room:join", { email, room: roomId });
//     }
//   }, [socket, email, roomId]);

//   // 🔹 When another user joins
//   const handleUserJoined = useCallback(
//     async ({ email: joinedEmail, id }) => {
//       console.log(`${joinedEmail} joined room`);
//       setRemoteSocketId(id);

//       // Create & send offer to new user
//       const offer = await peer.getOffer();
//       socket.emit("user:call", { to: id, offer });
//     },
//     [socket]
//   );

//   // 🔹 Handle incoming call
//   const handleIncommingCall = useCallback(
//     async ({ from, offer }) => {
//       console.log("Incoming Call from:", from);
//       setRemoteSocketId(from);

//       const ans = await peer.getAnswer(offer);
//       socket.emit("call:accepted", { to: from, ans });
//     },
//     [socket]
//   );

//   // 🔹 Handle call accepted
//   const handleCallAccepted = useCallback(
//     async ({ from, ans }) => {
//       console.log("Call accepted by:", from);
//       await peer.setLocalDescription(ans);
//     },
//     []
//   );

//   // 🔹 Negotiation needed
//   const handleNegoNeeded = useCallback(async () => {
//     const offer = await peer.getOffer();
//     socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
//   }, [remoteSocketId, socket]);

//   useEffect(() => {
//     peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
//     return () => {
//       peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
//     };
//   }, [handleNegoNeeded]);

//   const handleNegoNeedIncomming = useCallback(
//     async ({ from, offer }) => {
//       const ans = await peer.getAnswer(offer);
//       socket.emit("peer:nego:done", { to: from, ans });
//     },
//     [socket]
//   );

//   const handleNegoNeedFinal = useCallback(async ({ ans }) => {
//     await peer.setLocalDescription(ans);
//   }, []);

//   // 🔹 When remote track arrives
//   useEffect(() => {
//     peer.peer.addEventListener("track", (ev) => {
//       console.log("GOT TRACKS!!");
//       setRemoteStream(ev.streams[0]);
//     });
//   }, []);

//   // 🔹 Setup socket listeners
//   useEffect(() => {
//     socket.on("user:joined", handleUserJoined);
//     socket.on("incomming:call", handleIncommingCall);
//     socket.on("call:accepted", handleCallAccepted);
//     socket.on("peer:nego:needed", handleNegoNeedIncomming);
//     socket.on("peer:nego:final", handleNegoNeedFinal);

//     return () => {
//       socket.off("user:joined", handleUserJoined);
//       socket.off("incomming:call", handleIncommingCall);
//       socket.off("call:accepted", handleCallAccepted);
//       socket.off("peer:nego:needed", handleNegoNeedIncomming);
//       socket.off("peer:nego:final", handleNegoNeedFinal);
//     };
//   }, [
//     socket,
//     handleUserJoined,
//     handleIncommingCall,
//     handleCallAccepted,
//     handleNegoNeedIncomming,
//     handleNegoNeedFinal,
//   ]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       {/* Header */}
//       <div className="mb-6 text-center">
//         <h1 className="text-3xl font-bold text-gray-800">Room</h1>
//         <p className="text-gray-600">
//           {remoteSocketId ? "✅ Connected to user" : "⌛ Waiting for user..."}
//         </p>
//         <p className="text-sm text-gray-500 mt-1">Room ID: {roomId}</p>
//       </div>

//       {/* Video Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
//         {/* My Video */}
//         {myStream && (
//           <div className="relative rounded-lg overflow-hidden shadow-lg border bg-black">
//             <video
//               ref={(video) => {
//                 if (video) video.srcObject = myStream;
//               }}
//               autoPlay
//               muted
//               playsInline
//               className="w-full h-64 object-cover"
//             />
//             <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
//               Me
//             </span>
//           </div>
//         )}

//         {/* Remote Video */}
//         {remoteStream && (
//           <div className="relative rounded-lg overflow-hidden shadow-lg border bg-black">
//             <video
//               ref={(video) => {
//                 if (video) video.srcObject = remoteStream;
//               }}
//               autoPlay
//               playsInline
//               className="w-full h-64 object-cover"
//             />
//             <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
//               Remote
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RoomPage;




import React, { useEffect, useCallback, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

const RoomPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Local media
  useEffect(() => {
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        stream.getTracks().forEach((track) => peer.peer.addTrack(track, stream));
      } catch (err) {
        console.error("Media error:", err);
      }
    };
    startStream();
  }, []);

  // Join room
  useEffect(() => {
    if (email && roomId) socket.emit("room:join", { email, room: roomId });
  }, [socket, email, roomId]);

  // Room full
  useEffect(() => {
    socket.on("room:full", () => {
      alert("Room is full! Only 2 users allowed.");
      navigate("/");
    });
    return () => socket.off("room:full");
  }, [socket, navigate]);

  // Socket events
  const handleUserJoined = useCallback(
    async ({ id }) => {
      setRemoteSocketId(id);
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: id, offer });
    },
    [socket]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleNegoNeeded = useCallback(async () => {
    if (!remoteSocketId) return;
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", (ev) => {
      setRemoteStream(ev.streams[0]);
    });
  }, []);

  // Remote user left
  useEffect(() => {
    socket.on("user:left", () => {
      setRemoteSocketId(null);
      setRemoteStream(null);
    });
    return () => socket.off("user:left");
  }, [socket]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const toggleMic = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setMicOn(!micOn);
    }
  };

  const toggleCam = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setCamOn(!camOn);
    }
  };

  const handleDisconnect = () => {
    if (myStream) myStream.getTracks().forEach((t) => t.stop());
    socket.emit("room:leave", { email, room: roomId });
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 relative">
      {/* Video container */}
      <div className="flex-1 relative w-full h-full bg-black gap-4">
        {remoteStream && (
          <video
            ref={(v) => v && (v.srcObject = remoteStream)}
            autoPlay
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}

        {myStream && (
          <video
            ref={(v) => v && (v.srcObject = myStream)}
            autoPlay
            muted
            playsInline
            className="absolute bottom-4 right-4 w-32 h-40 md:w-56 md:h-72 rounded-lg border border-gray-700 object-cover shadow-lg"
          />
        )}

        {!remoteStream && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl">
            Waiting for user...
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center items-center gap-6 p-4 bg-black/70">
        <button onClick={toggleMic} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
          {micOn ? <Mic /> : <MicOff className="text-red-500" />}
        </button>

        <button onClick={toggleCam} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
          {camOn ? <Video /> : <VideoOff className="text-red-500" />}
        </button>

        <button onClick={handleDisconnect} className="p-3 rounded-full bg-red-600 hover:bg-red-500">
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default RoomPage;
