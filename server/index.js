// const {Server} = require('socket.io')

// const io = new Server(8000, {
//     cors: true
// });

// const emailToSocketIdMap = new Map();
// const socketidToEmailMap = new Map();

// io.on('connection' , (socket) => {
//     console.log('Socket is connected ', socket.id);
//     socket.on('room:join', (data) => {
//         const {email, room} = data;
//         emailToSocketIdMap.set(email, socket.id);
//         socketidToEmailMap.set(socket.id, email);

//         io.to(room).emit('user:joined', {email, id: socket.id})
//         socket.join(room)
//         io.to(socket.id).emit('room:join', data)
//     } )

//     socket.on('user:call' , ({to, offer}) => {
//         io.to(to).emit('incomming:call', {from: socket.id, offer})
//     })

//     socket.on('call:accepted', ({to, ans}) => {
//         io.to(to).emit("call:accepted", {from: socket.id, ans})
//     })

//     socket.on('peer:nego:needed', ({to, offer}) => {
//         io.to(to).emit('peer:nego:needed', {from:socket.id, offer})
//     })

//     socket.on('peer:nego:done', ({to, ans}) => {
//         io.to(to).emit('peer:nego:final', {from:socket.id, ans})
//     })
// })

const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: { origin: "*" },
});

// Maps to keep track of users
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
const rooms = {}; // { roomId: [ { email, id } ] }

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // User joins a room
  socket.on("room:join", (data) => {
    const { email, room } = data;

    if (!rooms[room]) rooms[room] = [];

    // Check if room is full (max 2 users)
    if (rooms[room].length >= 2) {
      socket.emit("room:full");
      return;
    }

    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    rooms[room].push({ email, id: socket.id });
    socket.join(room);

    // Notify the joining user about current users
    const otherUsers = rooms[room].filter((u) => u.id !== socket.id);
    socket.emit("room:join", { email, room, otherUsers });

    // Notify others in room about the new user
    socket.to(room).emit("user:joined", { email, id: socket.id });
  });

  // Handle user calls
  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  // User leaves the room
  socket.on("room:leave", ({ email, room }) => {
    leaveRoom(socket, email, room);
  });

  // Handle unexpected disconnect
  socket.on("disconnect", () => {
    const email = socketIdToEmailMap.get(socket.id);
    if (!email) return;

    // Remove user from all rooms
    for (const room in rooms) {
      const user = rooms[room].find((u) => u.id === socket.id);
      if (user) {
        leaveRoom(socket, user.email, room);
      }
    }

    emailToSocketIdMap.delete(email);
    socketIdToEmailMap.delete(socket.id);
    console.log(`User ${email} disconnected`);
  });

  // Helper function to remove user from room
  function leaveRoom(socket, email, room) {
    if (rooms[room]) {
      rooms[room] = rooms[room].filter((u) => u.id !== socket.id);

      // Notify others
      socket.to(room).emit("user:left", { email, id: socket.id });

      // Delete room if empty
      if (rooms[room].length === 0) delete rooms[room];
    }
    socket.leave(room);
    console.log(`User ${socket.id} left room ${room}`);
  }
});

console.log("Socket.io server running on port 8000");
