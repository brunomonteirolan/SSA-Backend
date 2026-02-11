import { Server } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { Store } from "../@types/store";
import { IClientRepository } from "../providers/Client/IClientRepository";
import { ConnectClientUseCase } from "../useCases/ConnectClient/ConnectClientUseCase";
import { DisconnectClientUseCase } from "../useCases/DisconnectClient/DisconnectClientUseCase";

export const storesConnected: Record<string, Store> = {};
export let io: SocketServer | null = null;

export const initSocket = (clientRepository: IClientRepository, server: Server) => {
  console.log("> Starting socket.io");

  io = new SocketServer();
  io.attach(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

  io.on("connection", (socket: Socket) => {
    const storeIdSocket = socket.handshake.query.storeId as string;

    socket.join(storeIdSocket ? "stores" : "web");
    console.log(`New connection: ${socket.id}`, socket.rooms);

    if (storeIdSocket) {
      if (!storesConnected[storeIdSocket]) {
        new ConnectClientUseCase(clientRepository)
          .exec({ storeId: storeIdSocket, socketId: socket.id })
          .then(() => console.log("client created"))
          .catch((err) => console.log("error saving client", err));

        storesConnected[storeIdSocket] = { storeId: storeIdSocket, socketId: socket.id };
        io?.to("web").emit("update-connections", { stores: storesConnected });
      } else {
        return socket.disconnect(true);
      }

      socket.on("update-configs", (data) => {
        storesConnected[storeIdSocket] = {
          ...storesConnected[storeIdSocket],
          status: undefined,
          ...data,
        };
        io?.to("web").emit("update-connections", { stores: storesConnected });
      });

      socket.on("update-status", (status) => {
        storesConnected[storeIdSocket] = { ...storesConnected[storeIdSocket], status };
        io?.to("web").emit("update-connections", { stores: storesConnected });
      });
    } else {
      socket.emit("update-connections", { stores: storesConnected });

      socket.on("update-client", (socketId) => {
        io?.to(socketId).emit("update-client");
      });
    }

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);

      if (storesConnected[storeIdSocket]) {
        new DisconnectClientUseCase(clientRepository)
          .exec(storeIdSocket)
          .then(() => console.log("client disconnected"))
          .catch((err) => console.log("error disconnecting client", err));

        delete storesConnected[storeIdSocket];
        socket.to("web").emit("update-connections", { stores: storesConnected });
      }
    });
  });
};
