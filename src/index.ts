import http from "http";

import app from "./app";
import { port } from "./constants/configConstants";
import { MongooseClientRepository } from "./providers/Client/MongooseClientRepository";
import { initSocket } from "./socket";

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`> Server listening on port ${port}`);

  const mongooseClientRepository = new MongooseClientRepository();
  initSocket(mongooseClientRepository, server);
});
