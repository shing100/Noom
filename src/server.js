import http from "http"
import WebSocket from "ws";
import express from "express"

const app = express()

app.set("view engine", "pug")
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const onSocketClose = () => {
  console.log("Disconnected from the Browser ❌");
}

const sockets = [];

const onSocketMessage = (message) => {
  console.log(message.toString('utf8'));
}

wss.on("connection", (socket) => {
  sockets.push(socket)
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (message) => {
    sockets.forEach((aSocket) => aSocket.send(onSocketMessage(message)));
  });
});

server.listen(3000, handleListen);