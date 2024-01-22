const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();

server.on("connection", (socket) => {
  console.log("Client connected to server ");
  clients.add(socket);

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    console.log(`Received message from client: ${parsedMessage}`);

    // Broadcast the received message to other clients
    clients.forEach((client) => {
      if (client === socket) {
        client.send(JSON.stringify(parsedMessage));
      }
    });
  });
});
