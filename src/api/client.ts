import { Router } from "express";
import yaml from "js-yaml";
import * as s3 from "../utils/s3";

const router = Router();

router.get("/latest", async (req, res, next) => {
  try {
    const file = await s3.getFilePromise("client/latest.yml");
    const chunks: Buffer[] = [];

    for await (const chunk of file.Body as AsyncIterable<Buffer>) {
      chunks.push(chunk);
    }

    const content = Buffer.concat(chunks).toString();
    const doc = yaml.load(content) as { path: string } | undefined;

    const url = await s3.getFileUrl(`client/${doc?.path || "Super Sacoa app Setup 1.5.0.exe"}`);

    return res.redirect(url);
  } catch (err) {
    next(err);
  }
});

export default router;
