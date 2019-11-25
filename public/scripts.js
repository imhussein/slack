const socket = io("http://localhost:9000");
// const wikiNamespace = io("http://localhost:9000/wiki");
// const mozillaNamespace = io("http://localhost:9000/mozilla");
// const linuxNamespace = io();

socket.on("connect", function() {
  socket.emit("message", { data: { message: "Main Namespace on Client" } });
  socket.on("message", function(data) {
    console.log(data.data.message);
  });
  socket.on("nsList", function(data) {
    let namespaces = document.querySelector(".namespaces");
    namespaces.innerHTML = "";
    data.data.forEach(ns => {
      namespaces.innerHTML += `
            <div class="namespace" ns=${ns.endpoint}>
                <img src=${ns.img} />
            </div>
        `;
    });

    Array.from(document.getElementsByClassName("namespace")).forEach(
      element => {
        element.addEventListener("click", function(e) {
          //   console.log(e.target.getAttribute("ns"));
          if (e.target.parentElement.classList.contains("namespace")) {
            console.log(e.target.parentElement.getAttribute("ns"));
          }
        });
      }
    );

    const nsSocket = io("http://localhost:9000/wiki");

    nsSocket.on("nsRoomLoad", function(data) {
      let roomList = document.querySelector(".room-list");
      roomList.innerHTML = "";
      data.forEach(room => {
        roomList.innerHTML += `
            <li class="room"><span class="glyphicon ${
              room.privateRoom ? "glyphicon-lock" : "glyphicon-globe"
            }"></span>${room.roomTitle}</li>
          `;
      });

      let roomNodes = Array.from(document.getElementsByClassName("room"));

      roomNodes.forEach(element => {
        element.addEventListener("click", function(e) {});
      });

      let topRoom = document.querySelectorAll(".room")[0];
      let topRoomName = topRoom.innerText;
      joinRoom(topRoomName, nsSocket);
    });

    nsSocket.on("messageToClients", message => {
      document.querySelector("#messages").innerHTML += buildHtml(message);
    });

    document
      .querySelector(".message-form")
      .addEventListener("submit", function(e) {
        e.preventDefault();
        let inputValue = document.querySelector("#user-message").value;
        nsSocket.emit("newMessageToServer", { text: inputValue });
      });
  });
});

function joinRoom(roomName, socket) {
  socket.emit("joinRoom", roomName, newRoomMember => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newRoomMember}  <span class="glyphicon glyphicon-user"></span>`;
  });
}

function buildHtml(message) {
  let innerHTML = `
        <li>
            <div  className="user-image">
            <img src="${
              message.avatar
            }" alt="Avatar" width='32px' height='32px'/>
            </div>
            <div className="user-message">
                <div className="user-name-time"><span>${new Date(
                  message.time
                ).toLocaleString()}</span></div>
                <div className="message-text">${message.text}</div>
            </div>
        </li>
    `;
  return innerHTML;
}
