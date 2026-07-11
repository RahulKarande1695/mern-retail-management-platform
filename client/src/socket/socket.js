import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
 // autoConnect:false ka?
 //  By default import zala ki connect hoto.
  autoConnect: false,
});

export default socket;
