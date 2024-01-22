// import { useState, useEffect } from "react";

// const useWebSocket = () => {
//   const [ws, setWs] = useState(null);

//   useEffect(() => {
//     // Establish WebSocket connection when the component mounts
//     const socket = new WebSocket("ws://localhost:8080");

//     socket.onopen = () => {
//       console.log("WebSocket connection opened");
//       setWs(socket);
//     };

//     socket.onclose = (event) => {
//       console.log("WebSocket connection closed:", event.code, event.reason);
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     socket.onmessage = (event) => {
//       const receivedMessage = JSON.parse(event.data);
//       console.log("Received message Server:", receivedMessage);

//       // Update your component state or perform other actions based on the message
//       // For example, you can display the received message in your chat UI
//     };

//     // Cleanup WebSocket connection when the component unmounts
//     return () => {
//       if (ws) {
//         ws.close();
//       }
//     };
//   }, []);

//   return ws;
// };

// export default useWebSocket;
