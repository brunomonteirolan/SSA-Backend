import express from "express";
// Routes
import appVersions from "./appVersions";
import stores from "./stores";
import client from "./client";
import clients from "./clients";
import companies from "./companies";

const router = express.Router();

router.get("/ping", (req, res) => res.json({ message: "pong" }));
router.use("/appVersions", appVersions);
router.use("/stores", stores);
router.use("/client", client);
router.use("/clients", clients);
router.use("/companies", companies);

export default router;
