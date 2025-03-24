import { io } from "socket.io-client";

const socket = io("http://localhost:4000", { transports: ["websocket"] });

export const useSocket = () => socket;

export default socket;
