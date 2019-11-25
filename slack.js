const express = require("express");
const app = express();
const socketio = require("socket.io");
app.use(express.static(__dirname + "/public"));
let namespaces = require("./data/namespaces");
require("colors");

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on("connection", function(socket) {
  socket.on("message", function(data) {
    console.log(data.data.message.green);
  });
  io.emit("message", { data: { message: "Main Namespace On Server" } });
  let namespacesData = namespaces.map(ns => ({
    img: ns.image,
    endpoint: ns.endpoint
  }));
  socket.emit("nsList", { data: namespacesData });
});

namespaces.forEach(function(ns, index) {
  const thisNamespace = io.of(ns.endpoint);
  thisNamespace.on("connection", function(socket) {
    console.log(`${socket.id} has join namespace ${ns.endpoint}`.yellow);
    socket.emit("nsRoomLoad", namespaces[0].rooms);
    socket.on("joinRoom", function(data, numbersOfUsersInRoom) {
      socket.join(data);
      io.of(ns.endpoint)
        .to(data)
        .clients((err, clients) => {
          if (err) {
            console.log(err);
          }
          numbersOfUsersInRoom(clients.length);
        });
    });
    socket.on("newMessageToServer", function(message) {
      const fullMsg = {
        text: message.text,
        time: Date.now(),
        username: "Mohamed",
        avatar:
          "https://images.unsplash.com/photo-1574546225180-4200b83e7573?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
      };
      const roomTitile = Object.keys(socket.rooms)[1];
      io.of(ns.endpoint)
        .to(roomTitile)
        .emit("messageToClients", fullMsg);
    });
  });
});
