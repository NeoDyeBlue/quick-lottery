const { createServer } = require("http");
const express = require("express");
const next = require("next");
const WebSocket = require("ws");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  const socketServer = new WebSocket.Server({ server });

  const TIMER_LENGTH = 60;
  const MAX_NUMBER = 9;
  let bets = [];
  let responseData = {
    timer: TIMER_LENGTH,
    results: ["0", "0", "0"],
    winnerCount: 0,
  };

  function generateResults() {
    let results = [];

    for (i = 0; i < 3; i++) {
      let number = String(Math.floor(Math.random() * MAX_NUMBER + 1));

      while (results.includes(number)) {
        number = String(Math.floor(Math.random() * MAX_NUMBER));
      }

      results.push(number);
    }

    return results;
  }

  socketServer.on("connection", (socket) => {
    socket.on("message", (message) => {
      bets.push(JSON.parse(message));
      // console.log();
    });
  });

  setInterval(() => {
    if (responseData.timer > 0) {
      responseData.timer -= 1;
    } else {
      responseData.winnerCount = 0;
      responseData.timer = TIMER_LENGTH;
      responseData.results = generateResults();
      bets.forEach((bet) => {
        if (
          bet.length === responseData.results.length &&
          bet.every((value, index) => value === responseData.results[index])
        ) {
          responseData.winnerCount += 1;
        }
      });
      bets = [];
    }

    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(responseData));
      }
    });
  }, 1000);

  expressApp.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log("Ready on http://localhost:3000");
  });
});
