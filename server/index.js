const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const rooms = new Map();

app.use(express.json());
app.use(express.static("./build"));

app.get("/rooms", (request, response) => {
  response.json(rooms);
  console.log(response);

});

app.get("/rooms/:id", (request, response) => {

  const { id } = request.params;
  const obj = rooms.has(id)
    ? {
        users: [...rooms.get(id).get("users").values()],
        messages: [...rooms.get(id).get("messages").values()],
      }
    : { users: [], messages: [] };
  response.json(obj);
});

app.post("/rooms", (request, response) => {
  const { roomId, userName } = request.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }
  response.send();
});

io.on("connection", (socket) => {
  console.log(socket);
  socket.on("ROOM_JOIN", ({ roomId, userName }) => {
    socket.join(roomId);
    console.log('name',userName);
    rooms.get(roomId).get("users").set(socket.id, userName);
    const users = [...rooms.get(roomId).get("users").values()];
    socket.to(roomId).emit("ROOM_SET_USERS", users);
  });

  socket.on("ROOM_NEW_MESSAGE", ({ roomId, userName, text }) => {
    const obj = { userName, text };
    console.log('mes', roomId,userName,text);
    rooms.get(roomId).get("messages").push(obj);
    socket.to(roomId).emit("ROOM_NEW_MESSAGE", obj);
  });

  socket.on("disconnect", () => {
    rooms.forEach((value, roomId) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        socket.to(roomId).emit("ROOM_SET_USERS", users);
      }
    });
  });
});

server.listen(8888, (error) => {
  if (error) {
    throw Error(error);
  }
  console.log("севрер запущен на порту 8888");
});
