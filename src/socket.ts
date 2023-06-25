import io from "socket.io-client";

//add .env
const URL = "http://localhost:4000";

export const socket = io.connect(URL);
