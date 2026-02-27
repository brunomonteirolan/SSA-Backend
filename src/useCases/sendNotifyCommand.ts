import { RequestHandler } from "express";
import { Store } from "../@types/store";
import { io, storesConnected } from "../socket";

export const sendNotifyCommand: RequestHandler = async (req, res, next) => {
  try {
    const { store } = res.locals as { store: Store };
    const message = req.body?.message || "Notificação do sistema";

    // Update store status in memory
    storesConnected[store.storeId] = {
      ...storesConnected[store.storeId],
      status: { message: `Notificação enviada: ${message}`, type: "info", timestamp: Date.now() },
    };

    // Emit to the specific store client and broadcast update to web dashboard
    io?.to("web").emit("update-connections", { stores: storesConnected });
    io?.to(store.socketId).emit("notify-store", { message, timestamp: Date.now() });

    return res.json({ message: "Notificação enviada com sucesso" });
  } catch (err) {
    next(err);
  }
};
