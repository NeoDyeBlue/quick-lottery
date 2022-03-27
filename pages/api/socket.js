// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import WebSocket, { WebSocketServer } from "ws";

let timerValue = 60;

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("socket is running");
  } else {
    console.log("socket is initializing");
    const io = new WebSocketServer({ server: res.socket.server });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(socket.clients);
      // socket.send("Hello");
      // setInterval(() => {
      //   timerValue >= 0 ? (timerValue -= 1) : 60;
      //   socket.clients.forEach((client) => {
      //     if (client.readyState === WebSocket.OPEN) {
      //       client.send(timerValue);
      //     }
      //   });
      // }, 1000);
      socket.on("message", (message) => {
        console.log(`Message received: ${message}`);
      });
    });
  }

  // io = new Server(res.socket.server);
  // res.socket.server.io = io;

  res.end();
}
