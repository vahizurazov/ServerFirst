const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
// const getApiAndEmit = "TODO";

const kharkiv =
  "https://api.darksky.net/forecast/3d894b4be108444b6212b5f1791a8b10/49.99469602377802,36.231951714435134";
const florida =
  "https://api.darksky.net/forecast/3d894b4be108444b6212b5f1791a8b10/43.7695,11.2558";

// const miniState = {
//   columns: [
//     { title: "First", id: "1" },
//     { title: "Second", id: "2" },
//     { title: "Third", id: "13" }
//   ]
// };

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(kharkiv); // Getting the data from DarkSky 755027

    // const res = await miniState;
    console.log("response", res.data);
    socket.emit("FromAPI", res.data); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

let interval;
io.on("connection", socket => {
  console.log("New client connected");
  // console.log(socket, "socket");

  // if (interval) {
  //   clearInterval(interval);
  // }
  getApiAndEmit(socket);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
