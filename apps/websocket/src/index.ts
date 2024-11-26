import { connectDB } from "db/src/index";
const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 8080 });

connectDB()
  .then(() => console.log("WS connected to Database"))
  .catch((err) => console.log("Error Ws connecting to Database", err));

wss.on("connection", (ws: any) => {
  console.log("Client Connected");
  ws.send("Hey Client");

  ws.on("close", () => {
    ws.send("Bye Client");
    console.log("client disconnected");
  });
});

console.log("Websocket running");
