import http from "http";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8080;

import app from "./app";
import { seedData } from "./utils/helpers";

const server = http.createServer(app);

//seed dummy data provided
// seedData();

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
