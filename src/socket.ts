import io from "socket.io-client";

const URL = "https://doodledraw-38177af52386.herokuapp.com";
// @ts-ignore
export const socket = io.connect(URL);
