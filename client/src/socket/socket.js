import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
 // By default import zala ki connect hovu naye.
  autoConnect: false,
});

export default socket;
