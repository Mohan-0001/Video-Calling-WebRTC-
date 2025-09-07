// import React from 'react'
// import { useCallback } from 'react'
// import { useState } from 'react'
// import { useSocket } from '../context/SocketProvider'
// import { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'

// const LobbyScreen = () => {
//     const [email, setEmail] = useState()
//     const [room, setRoom] = useState()
//     const socket = useSocket()
//     const navigate = useNavigate()
//     // console.log(socket)

//     const handleSubmitForm = useCallback((e) => {
//         e.preventDefault();
//         socket.emit('room:join', {email,room})
//     }, [email, room, socket])

//     const handleJoinRoom = useCallback((data) => {
//         const {email, room} = data
//         navigate(`/room/${room}`)
//     }, [])

//     useEffect(() => {
//         socket.on('room:join', handleJoinRoom)

//         return () => {
//             socket.off('room:join', handleJoinRoom)
//         }
//     }, [socket, handleJoinRoom])

//     return (
//         <div>
//             <h1>Lobby</h1>
//             <form  onSubmit={handleSubmitForm}>
//                 <label htmlFor="email">Email ID  </label>
//                 <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
//                 <br />
//                 <label htmlFor="room">Room No.  </label>
//                 <input type="text" id='room' value={room} onChange={(e) => setRoom(e.target.value)} />
//                 <br />
//                 <button>Join</button>
//             </form>
//         </div>
//     )
// }

// export default LobbyScreen;





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // for unique roomId

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmitForm = (e) => {
    e.preventDefault();

    // generate a unique room ID
    const roomId = uuidv4();

    // navigate to room page with roomId + email in URL
    navigate(`/room/${roomId}?email=${encodeURIComponent(email)}`);
  };

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <button type="submit">Create Meeting</button>
      </form>
    </div>
  );
};

export default LobbyScreen;
